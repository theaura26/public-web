/* Conditions at Mudigere, from open data.
 *
 * This is the one thing on the page that Aura did not measure, and the
 * reason it is here at all is arithmetic: the estate's own record reaches
 * the gateway a median of thirty-one days after the event, and no amount
 * of care on the feed closes that gap. A page called live needs one thing
 * that is true this morning.
 *
 * What it is: Open-Meteo's operational model, free and key-free, sampled
 * at the nearest grid cell. What it is not: a measurement on the estate.
 * That cell sits about four kilometres away at 1035 m, in country where
 * the ground moves thirty metres in a couple of hundred, so it is the
 * weather over Mudigere rather than the weather in Block 3. The card says
 * so in words, and none of these figures is ever allowed near the feed.
 *
 * One request covers the whole window — daily aggregates for air and
 * rain, hourly for soil, rolled up here. Using the forecast endpoint for
 * all of it rather than splicing the ERA5 archive onto the front is
 * deliberate: the two models band soil at different depths, and the join
 * puts a step in the series that looks like weather and is not.
 */

import { estateParts } from './time'

const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

/* The season total comes from a different endpoint to the sparkline.
 *
 * The forecast endpoint reaches back 92 days and returns null for the
 * older end of that — for this estate on 4 September, 33 of the 96 days
 * since 1 June came back empty. Nulls are dropped from the series,
 * because a gap cannot be plotted, and the same array was then counted
 * for "days in the season". So the page said 598 mm and "rain on all but
 * 3 days since June" when the truth was 1253 mm and five dry days, and
 * the window it described was 7 July to 4 September with June absent
 * from it entirely.
 *
 * This endpoint is the same models, addressed by date rather than by an
 * offset, and it answers for the whole season without gaps. */
const SEASON_ENDPOINT = 'https://historical-forecast-api.open-meteo.com/v1/forecast'

/** Above this, a day counts as a rain day. The meteorological
    convention, and stated on the page rather than left inside the word
    "rain" — a 0.9 mm day is not dry to anyone standing in it. */
const RAIN_DAY_MM = 1

/** Aura Estate, Mudigere. The coordinate the site publishes. */
const LAT = 13.1686
const LON = 75.434
const TZ = 'Asia/Kolkata'

/** Enough to read a trend without the sparkline turning into noise. */
const WINDOW_DAYS = 21

/* The south-west monsoon reaches this coast in the first days of June.
   Rain since then is the number that actually describes a year on this
   land, and it is the one figure here that grows all season. */
const MONSOON_ONSET = '06-01'

export type Series = { day: string; value: number }[]

export type SprayWindow = {
  open: boolean
  /** Why it is shut, or how long it stays open. */
  reason: string
  /** Estate-local "6 am" style label for the next opening, when shut. */
  opensAt: string | null
}

export type LeafWetness = {
  /** Hours in the last twenty-four at or above 90% humidity, or raining. */
  hours: number
  /** True when the run is long enough for the rust threshold. */
  infectionRisk: boolean
}

export type Conditions = {
  /** Where the model actually computed, and how far that is from us. */
  grid: { lat: number; lon: number; offsetKm: number; elevationM: number | null }
  fetchedAt: string
  rain: {
    last7mm: number
    prev7mm: number
    /** Total since the monsoon reached the coast, and the days it fell on. */
    seasonMm: number
    seasonDays: number
    seasonWetDays: number
    /** Calendar days from the onset to today. Equal to seasonDays when
        the record is whole, and reported separately so a gap in the
        data can never quietly shrink the denominator again. */
    seasonSpanDays: number
    /** First and last day the total actually covers. */
    seasonFrom: string
    seasonTo: string
    series: Series
  }
  soilMoisture: { latest: number; weekAgo: number | null; series: Series }
  soilTemp: { latest: number; weekAgo: number | null; series: Series }
  air: { max: number; min: number; series: Series }
  /** Reference evapotranspiration today, mm. What the crop will ask for. */
  et0: number | null
  spray: SprayWindow | null
  leafWetness: LeafWetness | null
}

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371
  const p1 = (aLat * Math.PI) / 180
  const p2 = (bLat * Math.PI) / 180
  const dP = p2 - p1
  const dL = ((bLon - aLon) * Math.PI) / 180
  const h = Math.sin(dP / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dL / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

type Payload = {
  latitude: number
  longitude: number
  elevation?: number
  daily?: {
    time: string[]
    temperature_2m_max: (number | null)[]
    temperature_2m_min: (number | null)[]
    precipitation_sum: (number | null)[]
    et0_fao_evapotranspiration?: (number | null)[]
  }
  hourly?: {
    time: string[]
    soil_temperature_6cm: (number | null)[]
    soil_moisture_3_to_9cm: (number | null)[]
    relative_humidity_2m?: (number | null)[]
    precipitation?: (number | null)[]
    precipitation_probability?: (number | null)[]
    wind_gusts_10m?: (number | null)[]
    is_day?: (number | null)[]
  }
}

/* ── Reading the hours like somebody who has to work in them ───────────
   Two derivations, and both are standard practice rather than anything
   invented here.

   The spray window. Drift is the constraint: a biodynamic preparation is
   put out as a fine mist, and above roughly twenty-five kilometres an
   hour of gust most of it lands somewhere other than the leaf. Rain
   inside the next couple of hours washes it off before it is taken up.
   So the window is the next run of daylight hours that is calm enough
   and dry enough — which is why the estate’s own log books its work at
   6–9 in the morning and 3–7 in the evening, and not at midday.

   Leaf wetness. Coffee leaf rust and black rot both need free water on
   the leaf to germinate, and the working threshold is about six hours in
   the temperature band the Ghats sit in through the monsoon. Counting
   the hours at or above ninety per cent humidity, or raining, is the
   ordinary way to estimate it without a leaf-wetness sensor in the
   block. It is a pressure reading, not a diagnosis. */

const GUST_LIMIT_KMH = 25
const RAIN_CHANCE_LIMIT_PCT = 40
const WETNESS_RH_PCT = 90
const WETNESS_HOURS_THRESHOLD = 6

function hourLabel(iso: string): string {
  const hour = Number(iso.slice(11, 13))
  const suffix = hour < 12 ? 'am' : 'pm'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12} ${suffix}`
}

function sprayWindow(hourly: NonNullable<Payload['hourly']>, nowIso: string): SprayWindow | null {
  const gusts = hourly.wind_gusts_10m
  const chance = hourly.precipitation_probability
  const isDay = hourly.is_day
  if (!gusts || !chance || !isDay) return null

  const start = hourly.time.findIndex((t) => t >= nowIso)
  if (start < 0) return null

  const usable = (i: number) =>
    isDay[i] === 1 &&
    (gusts[i] ?? 99) <= GUST_LIMIT_KMH &&
    (chance[i] ?? 100) <= RAIN_CHANCE_LIMIT_PCT

  if (usable(start)) {
    let until = start
    while (until + 1 < hourly.time.length && usable(until + 1)) until++
    return {
      open: true,
      reason: `calm and dry until ${hourLabel(hourly.time[until])}`,
      opensAt: null,
    }
  }

  /* Shut. Name the binding constraint rather than shrugging. */
  const gust = gusts[start] ?? null
  const rain = chance[start] ?? null
  const reason =
    isDay[start] !== 1 ? 'after dark'
      : gust != null && gust > GUST_LIMIT_KMH ? `gusting ${Math.round(gust)} km/h`
        : rain != null && rain > RAIN_CHANCE_LIMIT_PCT ? `${Math.round(rain)}% chance of rain`
          : 'conditions against it'

  /* Look ahead 36 hours for two consecutive workable hours. */
  for (let i = start; i < Math.min(start + 36, hourly.time.length - 1); i++) {
    if (usable(i) && usable(i + 1)) {
      return { open: false, reason, opensAt: hourLabel(hourly.time[i]) }
    }
  }
  return { open: false, reason, opensAt: null }
}

function leafWetness(hourly: NonNullable<Payload['hourly']>, nowIso: string): LeafWetness | null {
  const rh = hourly.relative_humidity_2m
  const precip = hourly.precipitation
  if (!rh) return null

  const now = hourly.time.findIndex((t) => t >= nowIso)
  const end = now < 0 ? hourly.time.length : now
  const from = Math.max(0, end - 24)

  let hours = 0
  for (let i = from; i < end; i++) {
    const humid = (rh[i] ?? 0) >= WETNESS_RH_PCT
    const wet = (precip?.[i] ?? 0) > 0
    if (humid || wet) hours++
  }
  return { hours, infectionRisk: hours >= WETNESS_HOURS_THRESHOLD }
}

/** Hourly readings collapsed to one mean per estate-local day. */
function dailyMean(times: string[], values: (number | null)[]): Series {
  const buckets = new Map<string, number[]>()
  times.forEach((t, i) => {
    const v = values[i]
    if (v == null) return
    const day = t.slice(0, 10)
    const bucket = buckets.get(day)
    if (bucket) bucket.push(v)
    else buckets.set(day, [v])
  })
  return [...buckets.entries()]
    .map(([day, vs]) => ({ day, value: vs.reduce((a, b) => a + b, 0) / vs.length }))
    .sort((a, b) => a.day.localeCompare(b.day))
}

function sum(series: Series): number {
  return series.reduce((a, b) => a + b.value, 0)
}

/**
 * Read the conditions. Never throws: an outage costs this block and
 * nothing else, and a block that guessed would be worse than one that is
 * simply absent.
 */
export async function readConditions(): Promise<Conditions | null> {
  if (process.env.AURA_LIVE_CONDITIONS === '0') return null

  let payload: Payload
  try {
    const url = new URL(ENDPOINT)
    url.searchParams.set('latitude', String(LAT))
    url.searchParams.set('longitude', String(LON))
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration')
    url.searchParams.set(
      'hourly',
      'soil_temperature_6cm,soil_moisture_3_to_9cm,relative_humidity_2m,precipitation,precipitation_probability,wind_gusts_10m,is_day',
    )
    /* One request has to cover both the three-week sparkline and the
       season total, so it reaches back to the onset — capped at the
       endpoint’s own 92-day ceiling. */
    const p0 = estateParts(new Date())
    const onset = Date.parse(`${p0.year}-${MONSOON_ONSET}T00:00:00Z`)
    const sinceOnset = Math.floor((Date.now() - onset) / 86_400_000)
    url.searchParams.set('past_days', String(Math.max(WINDOW_DAYS, Math.min(92, sinceOnset))))
    url.searchParams.set('forecast_days', '1')
    url.searchParams.set('timezone', TZ)

    const res = await fetch(url, {
      /* The model runs hourly and the ground moves slower than that. */
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    payload = (await res.json()) as Payload
  } catch {
    return null
  }

  const daily = payload.daily
  const hourly = payload.hourly
  if (!daily?.time?.length || !hourly?.time?.length) return null

  const rainSeries: Series = daily.time
    .map((day, i) => ({ day, value: daily.precipitation_sum[i] }))
    .filter((d): d is { day: string; value: number } => d.value != null)
  const airSeries: Series = daily.time
    .map((day, i) => {
      const hi = daily.temperature_2m_max[i]
      const lo = daily.temperature_2m_min[i]
      return hi != null && lo != null ? { day, value: (hi + lo) / 2 } : null
    })
    .filter((d): d is { day: string; value: number } => d !== null)

  const moistureSeries = dailyMean(hourly.time, hourly.soil_moisture_3_to_9cm)
  const tempSeries = dailyMean(hourly.time, hourly.soil_temperature_6cm)

  if (!rainSeries.length || !moistureSeries.length || !tempSeries.length) return null

  const p0s = estateParts(new Date())
  const seasonStart = `${p0s.year}-${MONSOON_ONSET}`

  /* Asked for by date, so June is in it. Falls back to the forecast
     window if the request fails — a short season is better than no card,
     and seasonSpanDays says how short it is. */
  let seasonSeries = rainSeries.filter((d) => d.day >= seasonStart)
  try {
    const su = new URL(SEASON_ENDPOINT)
    su.searchParams.set('latitude', String(LAT))
    su.searchParams.set('longitude', String(LON))
    su.searchParams.set('daily', 'precipitation_sum')
    su.searchParams.set('start_date', seasonStart)
    su.searchParams.set('end_date', p0s.dateKey)
    su.searchParams.set('timezone', TZ)
    const sres = await fetch(su, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) })
    if (sres.ok) {
      const sp = (await sres.json()) as Payload
      const full: Series = (sp.daily?.time ?? [])
        .map((day, i) => ({ day, value: sp.daily?.precipitation_sum?.[i] }))
        .filter((d): d is { day: string; value: number } => d.value != null)
      if (full.length > seasonSeries.length) seasonSeries = full
    }
  } catch {
    /* Keep the forecast-window season. */
  }

  const seasonSpanDays = Math.floor(
    (Date.parse(`${p0s.dateKey}T00:00:00Z`) - Date.parse(`${seasonStart}T00:00:00Z`)) / 86_400_000,
  ) + 1

  const latestIndex = daily.time.length - 1
  /* The API returns estate-local ISO strings without a zone, so the
     comparison has to be made in the same shape. */
  const p = estateParts(new Date())
  const nowIso = `${p.dateKey}T${String(p.hour).padStart(2, '0')}:00`
  const at = (s: Series, back: number) => s[s.length - 1 - back]?.value ?? null

  return {
    grid: {
      lat: payload.latitude,
      lon: payload.longitude,
      offsetKm: Math.round(haversineKm(LAT, LON, payload.latitude, payload.longitude) * 10) / 10,
      elevationM: payload.elevation ?? null,
    },
    fetchedAt: new Date().toISOString(),
    rain: {
      last7mm: sum(rainSeries.slice(-7)),
      prev7mm: sum(rainSeries.slice(-14, -7)),
      seasonMm: sum(seasonSeries),
      seasonDays: seasonSeries.length,
      seasonWetDays: seasonSeries.filter((d) => d.value > RAIN_DAY_MM).length,
      seasonSpanDays,
      seasonFrom: seasonSeries[0]?.day ?? seasonStart,
      seasonTo: seasonSeries[seasonSeries.length - 1]?.day ?? p0s.dateKey,
      /* The chart stays three weeks long; the total is the season. */
      series: rainSeries.slice(-WINDOW_DAYS),
    },
    soilMoisture: {
      latest: at(moistureSeries, 0) ?? 0,
      weekAgo: at(moistureSeries, 7),
      series: moistureSeries,
    },
    soilTemp: {
      latest: at(tempSeries, 0) ?? 0,
      weekAgo: at(tempSeries, 7),
      series: tempSeries,
    },
    air: {
      max: daily.temperature_2m_max[latestIndex] ?? 0,
      min: daily.temperature_2m_min[latestIndex] ?? 0,
      series: airSeries,
    },
    et0: daily.et0_fao_evapotranspiration?.[latestIndex] ?? null,
    spray: sprayWindow(hourly, nowIso),
    leafWetness: leafWetness(hourly, nowIso),
  }
}

/** The estate-local day the series ends on, for labelling. */
export function seriesEndLabel(series: Series): string {
  const last = series.at(-1)?.day
  return last ? estateParts(`${last}T06:00:00Z`).dateKey : ''
}

/* What the rain line is allowed to claim.
 *
 * It used to read "since June — rain on all but 3 days" off a series
 * that started on 7 July. The forecast endpoint returns null for the far
 * end of its 92-day window, nulls are dropped because a gap cannot be
 * plotted, and the shortened array was then counted as the season. June
 * was not in it, and neither were 33 days of July that had no reading —
 * so five dry days out of 96 was reported as three out of 60, and 1253
 * mm of monsoon as 598.
 *
 * Two things it now says out loud. "Rain" here means over a millimetre,
 * the meteorological convention, because a 0.9 mm day is not dry to
 * anyone standing in it. And when the record has a hole in it, the line
 * names the window it actually covers rather than the one it would like
 * to.
 */
export function rainCaption(rain: {
  seasonDays: number
  seasonWetDays: number
  seasonSpanDays: number
  seasonFrom: string
  seasonTo: string
}) {
  const dry = rain.seasonDays - rain.seasonWetDays
  const whole = rain.seasonDays >= rain.seasonSpanDays
  const day = (iso: string) => {
    const [, m, d] = iso.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${Number(d)} ${months[Number(m) - 1]}`
  }
  const when = whole ? 'since June' : `${day(rain.seasonFrom)}–${day(rain.seasonTo)}`
  return dry === 0
    ? `${when} — over 1 mm every day`
    : `${when} — over 1 mm on all but ${dry} ${dry === 1 ? 'day' : 'days'}`
}

