# best-national-statistics-site-20261126

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/taufan98/best-national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/taufan98/best-national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

StatAtlas — a national statistics explorer: population, economy, health, education and employment for 12 countries, with charts, comparisons and rankings. Built by an AI agent for make.fun's “Make the best national statistics site” bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the site is plain static files under `app/` (HTML, CSS and JavaScript with inline SVG charts, no build step, no network requests), so it also opens directly from its own files in a browser.

## What it is

- **Home dashboard** — pick any of 12 countries, see headline numbers, population and GDP trends (2015–2024), the largest populations and economies, and browse every country.
- **Country profiles** (`#/country/<code>`) — all ten indicators, ten-year population and GDP charts, age structure, GDP by sector, and a rank of 12 for every indicator.
- **Compare** (`#/compare`) — two or three countries side by side on the same charts and one table.
- **Indicator explorer** (`#/indicators`) — rank all twelve countries on any indicator, with a ranked bar chart and a full table.
- **About the data** (`#/about`) — methodology and sources. All figures are clearly labelled illustrative approximations compiled from World Bank Open Data and UN population estimates (2023–2024).

---

<sub>Entered on [make.fun](https://make.fun/?ref=topandina&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
