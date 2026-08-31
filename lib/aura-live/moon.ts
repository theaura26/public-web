/* The moon, computed rather than fetched.
 *
 * Aura farms biodynamically and by Vedic practice — the estate's own
 * intervention calendar lives under 03_INTERVENTIONS/Fertiliser & BD, the
 * activity log files work under "Biodynamic" and "Vedic", and the site
 * carries an unwritten Now subject called Lunar rhythm. So the moon is
 * not decoration here; it is one of the two calendars the estate actually
 * works to, and it is the only live fact on this page that needs no
 * network at all.
 *
 * WHAT IS COMPUTED, AND HOW WELL
 * ------------------------------
 * Meeus, *Astronomical Algorithms*, chapters 47 and 48, truncated to the
 * larger periodic terms. That lands the moon's ecliptic longitude inside
 * about a tenth of a degree — far finer than anything below needs, since
 * a nakshatra is 13°20' wide and a sign is 30°.
 *
 * Sidereal positions use the Lahiri ayanamsa, which is the Indian
 * civil standard and what a Panchang uses.
 *
 * WHAT IS REPORTED, AND WHAT IS NOT CLAIMED
 * -----------------------------------------
 * Everything here is a statement about where the moon is and what the
 * two traditions call that position. None of it is a claim that the
 * position changes an outcome in the field. That distinction is the same
 * one the rest of this feature runs on: report the record, do not assert
 * the effect.
 *
 * One honest limit. Maria Thun's sowing calendar sets its root, leaf,
 * flower and fruit days from the moon against the *constellations* —
 * which are unequal, and which she adjusted empirically over decades of
 * trials. What is derived below uses the equal sidereal signs instead.
 * The two agree most days and part company near the boundaries, so the
 * plant-part day here is the classical rule rather than a reproduction
 * of her published calendar, and it says so where it is shown.
 */

const RAD = Math.PI / 180

/** Julian Ephemeris Day. */
function julianDay(date: Date): number {
  return date.getTime() / 86_400_000 + 2440587.5
}

/** Julian centuries from J2000.0. */
function centuries(jd: number): number {
  return (jd - 2451545) / 36525
}

type LunarPosition = {
  /** Apparent geocentric ecliptic longitude, degrees, tropical. */
  longitude: number
  /** Ecliptic latitude, degrees. */
  latitude: number
  /** Earth–moon distance, km. */
  distance: number
  /** The sun's apparent longitude, for the phase angle. */
  sunLongitude: number
}

/* Meeus 47, principal terms. The coefficients are the largest entries of
   table 47.A; the tail contributes well under a hundredth of a degree and
   is dropped. */
function lunarPosition(jd: number): LunarPosition {
  const T = centuries(jd)

  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T          // mean longitude
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T            // mean elongation
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T             // sun’s mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T           // moon’s mean anomaly
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T              // argument of latitude

  const d = D * RAD, m = M * RAD, mp = Mp * RAD, f = F * RAD

  const lon =
    6.288774 * Math.sin(mp) +
    1.274027 * Math.sin(2 * d - mp) +
    0.658314 * Math.sin(2 * d) +
    0.213618 * Math.sin(2 * mp) +
    -0.185116 * Math.sin(m) +
    -0.114332 * Math.sin(2 * f) +
    0.058793 * Math.sin(2 * d - 2 * mp) +
    0.057066 * Math.sin(2 * d - m - mp) +
    0.053322 * Math.sin(2 * d + mp) +
    0.045758 * Math.sin(2 * d - m) +
    -0.040923 * Math.sin(m - mp) +
    -0.034720 * Math.sin(d) +
    -0.030383 * Math.sin(m + mp) +
    0.015327 * Math.sin(2 * d - 2 * f) +
    -0.012528 * Math.sin(mp + 2 * f) +
    0.010980 * Math.sin(mp - 2 * f)

  const lat =
    5.128122 * Math.sin(f) +
    0.280602 * Math.sin(mp + f) +
    0.277693 * Math.sin(mp - f) +
    0.173237 * Math.sin(2 * d - f) +
    0.055413 * Math.sin(2 * d - mp + f) +
    0.046271 * Math.sin(2 * d - mp - f) +
    0.032573 * Math.sin(2 * d + f) +
    0.017198 * Math.sin(2 * mp + f)

  const dist =
    385000.56 +
    (-20905.355 * Math.cos(mp) +
      -3699.111 * Math.cos(2 * d - mp) +
      -2955.968 * Math.cos(2 * d) +
      -569.925 * Math.cos(2 * mp)) / 1

  /* The sun, to the accuracy a phase angle needs (Meeus 25, low). */
  const L0 = 280.46646 + 36000.76983 * T
  const Ms = (357.52911 + 35999.05029 * T) * RAD
  const C = 1.914602 * Math.sin(Ms) + 0.019993 * Math.sin(2 * Ms) + 0.000289 * Math.sin(3 * Ms)

  return {
    longitude: norm360(Lp + lon),
    latitude: lat,
    distance: dist,
    sunLongitude: norm360(L0 + C),
  }
}

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360
}

/** Lahiri ayanamsa — the Indian civil standard, and what a Panchang uses. */
function ayanamsa(jd: number): number {
  const T = centuries(jd)
  return 23.85 + 0.0139 * (T * 100)   // ≈ 24.2° in 2026; good to a few arc-minutes
}

/* ── The two traditions ──────────────────────────────────────────────── */

const NAKSHATRA = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

/* The nakshatras the classical agricultural texts — Krishi Parashara and
   Surapala’s Vrikshayurveda — single out as favourable for sowing and
   planting. Reported as tradition, never as agronomy. */
const SOWING_NAKSHATRA = new Set([
  'Rohini', 'Mrigashira', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra',
  'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Revati',
])

export type PlantPart = 'root' | 'leaf' | 'flower' | 'fruit'

/* Sidereal sign → element → the part of the plant the biodynamic sowing
   calendar associates with it. Coffee is a fruit and seed crop, so a
   fruit day is the one that matters most at Mudigere. */
const SIGN_PART: PlantPart[] = [
  'fruit',  // Aries — fire
  'root',   // Taurus — earth
  'flower', // Gemini — air
  'leaf',   // Cancer — water
  'fruit',  // Leo
  'root',   // Virgo
  'flower', // Libra
  'leaf',   // Scorpio
  'fruit',  // Sagittarius
  'root',   // Capricorn
  'flower', // Aquarius
  'leaf',   // Pisces
]

const PART_NOTE: Record<PlantPart, string> = {
  root: 'A root day. The tradition puts horn manure and soil work here.',
  leaf: 'A leaf day. Associated with water, and with leafy growth rather than harvest.',
  flower: 'A flower day. Associated with air and light.',
  fruit: 'A fruit and seed day — the one that speaks to coffee.',
}

const PHASE_NAME = [
  'New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous',
  'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent',
]

export type Moon = {
  /** 0 → new, 0.5 → full. */
  phase: number
  phaseName: string
  /** Illuminated fraction of the disc, 0–1. */
  illumination: number
  /** Days since the last new moon. */
  age: number
  /** Sidereal position. */
  nakshatra: string
  nakshatraFavourable: boolean
  sign: number
  plantPart: PlantPart
  plantPartNote: string
  /** Sap rising or falling, in the biodynamic sense — the moon's
   *  declination climbing or falling, not the waxing/waning cycle. */
  ascending: boolean
}

export function moonFor(date: Date = new Date()): Moon {
  const jd = julianDay(date)
  const { longitude, latitude, sunLongitude } = lunarPosition(jd)

  /* Phase angle from the elongation. Meeus 48.4, the approximation that
     ignores the small parallax terms. */
  const elongation = norm360(longitude - sunLongitude)
  const phase = elongation / 360
  const illumination = (1 - Math.cos(elongation * RAD)) / 2
  const age = phase * 29.530588853

  /* Ascending or descending: is the moon's declination climbing? Compare
     now with twelve hours ago rather than differentiating — cheaper, and
     the sign is all that is wanted. */
  const declinationNow = declination(longitude, latitude, jd)
  const then = lunarPosition(jd - 0.5)
  const declinationThen = declination(then.longitude, then.latitude, jd - 0.5)

  const sidereal = norm360(longitude - ayanamsa(jd))
  const sign = Math.floor(sidereal / 30)
  const part = SIGN_PART[sign]
  const nakshatra = NAKSHATRA[Math.floor(sidereal / (360 / 27))]

  return {
    phase,
    phaseName: PHASE_NAME[Math.round(phase * 8) % 8],
    illumination,
    age,
    nakshatra,
    nakshatraFavourable: SOWING_NAKSHATRA.has(nakshatra),
    sign,
    plantPart: part,
    plantPartNote: PART_NOTE[part],
    ascending: declinationNow > declinationThen,
  }
}

/** Ecliptic → equatorial, for the declination only. */
function declination(lon: number, lat: number, jd: number): number {
  const T = centuries(jd)
  const obliquity = (23.439291 - 0.0130042 * T) * RAD
  const l = lon * RAD
  const b = lat * RAD
  return (
    Math.asin(
      Math.sin(b) * Math.cos(obliquity) + Math.cos(b) * Math.sin(obliquity) * Math.sin(l),
    ) / RAD
  )
}
