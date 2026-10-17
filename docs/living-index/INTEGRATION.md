# Living Index: frontend and API integration

The public Living Index is separate from the editorial `/cows-of-aura` page.
Routes: `/living-index`, `/living-index/cows`, `/living-index/cows/{slug}`.
The supplied plate-wall design, passport drawer, search, type filters, ordering,
birthday recognition, pagination and weekly charts are retained. Mock registers
and spreadsheet-import scripts are not used by the application.

## Data flow and freshness

Cloud SQL → existing Cloud Run `aura-api-auth` service → Next.js server → browser.
`GET /v1/public/living-index` is an explicit anonymous public projection. The
existing `/v1/animals` and other operational endpoints still require approved
Firebase authentication. The website never receives a database password, IAM
credential, Firebase company session, raw source workbook, or private API response.

Server requests and the same-origin `/api/living-index` endpoint use `no-store`.
An open, visible page fetches a fresh snapshot every 120 seconds and when a tab
becomes visible. Committed database changes to a published animal therefore
normally appear within two minutes plus network/query time. This is polling,
not a guaranteed delivery SLA. Suspended/offline browsers update when resumed.
Photos can be cached for 120 seconds; withdrawn photographs may remain in a
browser cache until expiry. Refresh failure retains the last successful snapshot
with an explicit warning; the initial unavailable screen retries automatically.

Names, sex, breed, birth/join dates, published family links, milk quantities and
herd collection totals come from the live database. A new animal needs an
explicit publication approval; a new operational record for an already published
animal needs no website deploy. Routes resolve at request time, so newly
published cows also need no deploy. Slugs are centrally stored and should stay
stable when names change.

## Local setup

```sh
npm ci
npm run dev -- --port 3010
npm run living-index:test
npm run living-index:smoke
npm run build
```

The optional server-only `AURA_PUBLIC_API_BASE_URL` defaults to
`https://aura-api-auth-1030880733562.asia-south1.run.app`. Set it in `.env.local`
to a verified candidate URL for testing; use the production service for production.
Do not prefix it with `NEXT_PUBLIC_`; the browser calls the same-origin route.
No API secret is required for these intentionally public fields.

## Adding cows and photos

Animal facts belong in Cloud SQL, managed through the estate’s backend workflow.
Publication approval and approved photos are centrally managed in the backend
repository’s `scripts/living-index` tooling and `public_animal_*` tables. See
`aura-intelligence/services/aura-api/docs/PUBLIC_LIVING_INDEX.md` for the operator
workflow. The initial central source folder is
`/Users/aura/Documents/Aura Intelligence/living-index-content`.
Place photos under `animals/COW-xxxx/photo.jpg` (or `green.jpg`, `tone.jpg`) and
list them in `manifest.json`. Images are re-encoded without EXIF/GPS and stored
privately; only approved image IDs for a published active cow can be served.
Do not copy internal pictures or evidence URLs into this frontend repository.
The design’s video and its poster are the only new bundled media.

The UI deliberately has no notes, health, pregnancy, treatment, staff identities,
contact data, source paths, grazing locations, or evidence attachments. Name
meanings are optional reviewed publication copy; the design’s unreviewed meanings
are not initially published. The current DB has no animal type attributes, so
the filter labels these profiles unspecified until backend data supplies a type.
Estimated birth dates are not celebrated as birthdays.

Milk charts sum known readings and label missing sessions; zero is a recorded
value, not a substitute for missing data. The last 30 days end today in
Asia/Kolkata, not at the last logged date. History covers 366 calendar days.
Collections are herd data, never allocated to individual cows. Each collection
group uses one reported total, or sums components only when there is no reported
total. Ambiguous groups or missing grouping keys are withheld. No collection
uses internal notes to infer destinations.

## Repository workflow

Keep one deployable `main`, with short-lived feature branches and reviewed PRs.
This feature lives in `app/living-index`, `components/living-index` and
`lib/living-index`; shared navigation has only a link. Future compost learning,
spray or other public subjects can have sibling feature folders and their own
allowlisted API projection. Keep API/database changes in the backend repository.
The public contract is validated strictly: coordinate approved schema changes in
both repositories, or introduce a new version before changing its fields. Frontend
layout changes using existing fields require no API change. Deploy compatible
backend changes before frontend promotion. Long-lived branches
per feature will drift and do not provide data privacy or runtime isolation.

Deploy a preview, run the smoke check and browser interactions, then merge the
frontend PR through the normal main deployment process. Existing Vercel project:
The Aura Life / public-web (`prj_bkQAMfEXPOafUesX69NQjxKTF5dN`).
