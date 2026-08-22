# India Startup Map

An open, source-linked directory for exploring India’s startup and technology ecosystem by city, sector, funding stage, hiring status, remote-work policy, and verified technology stack.

[**Explore the live map →**](https://india-startup-map.srbmaury.chatgpt.site/) · [Browse companies](https://india-startup-map.srbmaury.chatgpt.site/explore) · [View the methodology](#data-quality-and-methodology)

## Why this exists

Startup information is usually scattered across company websites, careers pages, public registries, community directories, and outdated listicles. India Startup Map brings those records together while preserving an important distinction: a company can be discoverable without pretending every field has been verified.

The project is designed for:

- engineers exploring companies and technology stacks;
- job seekers finding hiring and remote-friendly organizations;
- founders and ecosystem researchers comparing startup activity across cities;
- contributors correcting incomplete or outdated public records.

## Current coverage

Snapshot as of August 2026:

| Metric | Coverage |
| --- | ---: |
| Mapped company locations | 1,907 |
| Active cities | 126 |
| Location-unverified organizations | 710 |
| Evidence-backed technologies | 20 |
| Bengaluru companies | 507 |
| Mumbai companies | 374 |
| Delhi NCR companies | 199 |
| Chennai companies | 146 |
| Hyderabad companies | 125 |
| Pune companies | 105 |

Counts change as records are added, deduplicated, or corrected.

## Product features

- Interactive India map powered by MapLibre and OpenStreetMap tiles
- City pages with searchable and filterable company directories
- Individual profiles containing company details, careers links, founders, stage, location precision, and sources
- Dedicated remote-company directory with evidence labels
- Technology index that excludes companies without supporting stack evidence
- Explicit location-unverified directory for records that should not be plotted
- Grouped markers for city-level records, preventing overlapping pins from obscuring the map
- ChatGPT-authenticated admin workspace restricted by a server-side email allowlist
- Source-linked moderation flow for location and technology verification

## Data quality and methodology

The map follows a few strict rules:

1. **No invented coordinates.** Records with only city-level evidence are labelled `CITY`; confirmed office records use more precise labels.
2. **Unknown is not remote.** A missing office location never implies that a company is remote-friendly.
3. **Technology claims need evidence.** Topical tags and job-description wish lists are not automatically treated as production technology stacks.
4. **Uncertain locations stay off the map.** They remain searchable in the location-unverified directory until a reliable source is attached.
5. **Directory sources remain visible.** Company profiles link to the source supporting the location or company record.
6. **Duplicates are removed by stable slug.** Imports are deduplicated before being included in the exported directory.

### Main data sources

- Official company and careers websites
- [Wikidata](https://www.wikidata.org/) headquarters and official-website records
- [Bangalore Startup Map](https://www.bangalorestartupmap.com/) location-confirmed Bengaluru records
- [Remote In Tech](https://github.com/remoteintech/remote-jobs) remote-work directory
- Manually verified office and employer records stored alongside their public sources

Community and directory records are discovery inputs, not guarantees. Always confirm current roles, office availability, and remote eligibility on the company’s own website.

## Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | National overview and city map | Public |
| `/explore` | Complete company directory | Public |
| `/:city` | City-specific directory and map | Public |
| `/startup/:slug` | Company profile and sources | Public |
| `/remote` | Evidence-labelled remote companies | Public |
| `/tech` | Verified technology index | Public |
| `/tech/:technology` | Companies using a technology | Public |
| `/location-unverified` | Companies excluded from the map | Public |
| `/submit` | Community submission interface | Public |
| `/admin` | Moderation workspace | Authorized admin only |

> The current submission interface demonstrates the intake experience; durable submission storage is not connected yet. Verified dataset changes are made through source-controlled contributions.

## Technology

- React 19
- TypeScript
- vinext and Vite
- Cloudflare Workers-compatible runtime
- MapLibre GL JS
- OpenStreetMap tiles
- OpenAI Sites hosting and Sign in with ChatGPT
- Node.js test runner and ESLint

## Local development

### Requirements

- Node.js `>=22.13.0`
- npm

### Setup

```bash
git clone https://github.com/srbmaury/India-Startup-Map.git
cd India-Startup-Map
npm install
npm run dev
```

Open the local URL printed by the development server.

### Validation

```bash
npm run lint
npm test
```

`npm test` creates a production build and verifies the core public and protected routes.

## Project structure

```text
app/
├── admin/                    Protected moderation workspace
├── startup/[slug]/           Company profile pages
├── tech/                     Technology index and detail pages
├── data.ts                   Dataset composition and exports
├── *-companies.ts            Source-specific company datasets
├── location-overrides.ts     Explicit verified location corrections
└── startup-map.tsx           Interactive MapLibre map
tests/
└── rendered-html.test.mjs    Build and route checks
.openai/hosting.json          Sites project configuration
```

## Contributing data

Contributions are welcome, especially for underrepresented cities and incomplete records.

Before opening a pull request:

1. Search the directory and existing source files for duplicates.
2. Include the company’s official website.
3. Attach a public source supporting its headquarters or office city.
4. Do not provide exact coordinates unless the source supports that precision.
5. Keep technology arrays empty unless a reliable engineering source names the stack.
6. Run `npm run lint` and `npm test`.

For corrections, explain which field changed and link the evidence in the pull-request description.

## Admin access

All public routes work without authentication. `/admin` uses Sign in with ChatGPT and a server-side email allowlist. Authentication establishes identity; the allowlist provides authorization.

Do not move admin authorization into client-side code or expose private review actions through public routes.

## Deployment

The production application is hosted with OpenAI Sites. `.openai/hosting.json` stores only the Sites project identifier and logical resource bindings; deployment credentials and runtime configuration are not committed.

## Known limitations

- Some records have only city-level location precision.
- Careers and hiring status can change faster than the dataset.
- Many directory-sourced companies do not yet have verified technology stacks.
- Community submissions are not durably persisted yet.
- Company logos use public website favicons and may occasionally be missing or outdated.

## Acknowledgements

Thanks to the maintainers and contributors of Wikidata, Bangalore Startup Map, Remote In Tech, OpenStreetMap, and the public company sources that make transparent verification possible.

---

Built and maintained by [srbmaury](https://github.com/srbmaury).
