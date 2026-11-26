// StatAtlas views: HTML for each page, built from the data. Every value is escaped
// before it goes into the page. Pages are hash routes, so every section is reached
// by a link: #/ (home), #/country/<code>, #/compare, #/indicators, #/about.

import { COUNTRIES, INDICATORS, YEARS, DATASET_NOTE, countryByCode, indicatorByKey, growth } from './data.js';
import { lineChart, barChart, rankedBars, donutChart, ageBars } from './charts.js';

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function fmtNum(v, decimals = 0) {
  return Number(v).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtIndicator(key, v) {
  const ind = indicatorByKey(key);
  if (key === 'gdp') return '$' + fmtNum(v) + ' bn';
  if (key === 'gdpPerCapita') return '$' + fmtNum(v);
  if (key === 'population') return fmtNum(v, 1) + 'm';
  if (ind.unit === '%') return fmtNum(v, ind.decimals) + '%';
  if (ind.unit === 'years') return fmtNum(v, 1) + ' yrs';
  if (ind.unit === 'tonnes') return fmtNum(v, 1) + ' t';
  return fmtNum(v, ind.decimals);
}

function nav(active) {
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' aria-current="page" class="active"' : ''}>${label}</a>`;
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="#/"><span class="brand-mark" aria-hidden="true">▦</span> StatAtlas</a>
    <nav class="main-nav" aria-label="Main navigation">
      ${link('#/', 'Home', 'home')}
      ${link('#/compare', 'Compare', 'compare')}
      ${link('#/indicators', 'Indicators', 'indicators')}
      ${link('#/about', 'About the data', 'about')}
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <p><strong>StatAtlas</strong> — a national statistics explorer. ${escape(DATASET_NOTE)}</p>
    <p>Figures shown are for 2024 unless a chart says otherwise. Built as a single-page app that runs entirely offline from its own files.</p>
    <p><a href="#/about">Methodology &amp; sources</a> · <a href="#/">Home</a> · <a href="#/compare">Compare countries</a> · <a href="#/indicators">Browse indicators</a></p>
  </div>
</footer>`;
}

function page(active, inner) {
  return `${nav(active)}<main class="wrap">${inner}</main>${footer()}`;
}

function countryCard(c) {
  return `<li class="country-card">
  <a href="#/country/${c.code}">
    <span class="flag" aria-hidden="true">${c.flag}</span>
    <span class="cc-name">${escape(c.name)}</span>
    <span class="cc-region">${escape(c.region)}</span>
    <span class="cc-stats"><strong>${fmtNum(c.stats.population, 1)}m</strong> people · <strong>$${fmtNum(c.stats.gdp)}bn</strong> GDP</span>
  </a>
</li>`;
}

function kpi(label, value, note) {
  return `<div class="kpi"><span class="kpi-label">${escape(label)}</span><span class="kpi-value">${value}</span><span class="kpi-note">${escape(note)}</span></div>`;
}

// ---------------- Home ----------------
export function home(selectedCode) {
  const c = countryByCode(selectedCode) || countryByCode('idn');
  const popGrowth = growth(c.populationSeries);
  const gdpGrowth = growth(c.gdpSeries);
  const options = COUNTRIES.map((x) => `<option value="${x.code}"${x.code === c.code ? ' selected' : ''}>${escape(x.name)}</option>`).join('');
  const topPop = [...COUNTRIES].sort((a, b) => b.stats.population - a.stats.population).slice(0, 5);
  const topGdp = [...COUNTRIES].sort((a, b) => b.stats.gdp - a.stats.gdp).slice(0, 5);
  const rows = topPop.map((x, i) => `<tr><td>${i + 1}</td><td><a href="#/country/${x.code}">${x.flag} ${escape(x.name)}</a></td><td class="num">${fmtNum(x.stats.population, 1)}m</td><td class="num">$${fmtNum(x.stats.gdpPerCapita)}</td><td class="num">${fmtNum(x.stats.lifeExpectancy, 1)} yrs</td></tr>`).join('');
  return page('home', `
<section class="hero">
  <p class="eyebrow">National statistics · 12 countries · 2015–2024</p>
  <h1>Every nation’s numbers,<br>in one place.</h1>
  <p class="lede">Population, economy, health, education and work — explore a country’s statistics with charts you can read at a glance, compare countries side by side, and rank them on any indicator.</p>
  <form class="country-picker" action="#/country/${c.code}" onsubmit="return false;">
    <label for="home-country">Choose a country</label>
    <div class="picker-row">
      <select id="home-country" name="country">${options}</select>
      <button type="button" id="home-go" class="btn">View country →</button>
    </div>
  </form>
</section>

<section aria-labelledby="kpi-h">
  <h2 id="kpi-h">${c.flag} ${escape(c.name)} at a glance <span class="year-tag">2024</span></h2>
  <div class="kpi-grid">
    ${kpi('Population', fmtNum(c.stats.population, 1) + 'm', `${popGrowth >= 0 ? '+' : ''}${fmtNum(popGrowth, 1)}% since 2015`)}
    ${kpi('GDP', '$' + fmtNum(c.stats.gdp) + 'bn', `${gdpGrowth >= 0 ? '+' : ''}${fmtNum(gdpGrowth, 1)}% since 2015`)}
    ${kpi('GDP per capita', '$' + fmtNum(c.stats.gdpPerCapita), 'current US dollars')}
    ${kpi('Life expectancy', fmtNum(c.stats.lifeExpectancy, 1) + ' yrs', 'at birth, 2024 estimate')}
    ${kpi('Unemployment', fmtNum(c.stats.unemployment, 1) + '%', 'share of labour force')}
    ${kpi('Internet users', fmtNum(c.stats.internet) + '%', 'of the population')}
  </div>
  <p class="more-link"><a href="#/country/${c.code}">Full profile of ${escape(c.name)} →</a></p>
</section>

<section class="chart-pair" aria-labelledby="trend-h">
  <div class="card">
    <h2 id="trend-h">Population trend — ${escape(c.name)}</h2>
    <p class="card-sub">Millions of people, 2015–2024</p>
    ${lineChart({ values: c.populationSeries, labels: YEARS.map(String), color: '#0e7490', yLabel: 'million', format: (v) => fmtNum(v, 0) + 'm' })}
  </div>
  <div class="card">
    <h2>GDP trend — ${escape(c.name)}</h2>
    <p class="card-sub">Billions of current US dollars, 2015–2024</p>
    ${barChart({ items: YEARS.map((y, i) => ({ label: String(y).slice(2), value: c.gdpSeries[i] })), color: '#0e7490', format: (v) => '$' + fmtNum(v) + 'bn' })}
  </div>
</section>

<section class="split" aria-labelledby="rank-h">
  <div class="card">
    <h2 id="rank-h">Largest populations</h2>
    <table class="data-table">
      <thead><tr><th>#</th><th>Country</th><th class="num">Population</th><th class="num">GDP / person</th><th class="num">Life exp.</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="more-link"><a href="#/indicators">Rank all countries on any indicator →</a></p>
  </div>
  <div class="card">
    <h2>Largest economies</h2>
    <ol class="rank-list">
      ${topGdp.map((x, i) => `<li><span class="rank-no">${i + 1}</span> <a href="#/country/${x.code}">${x.flag} ${escape(x.name)}</a> <strong>$${fmtNum(x.stats.gdp)}bn</strong></li>`).join('')}
    </ol>
    <h3>Fastest-growing populations, 2015–2024</h3>
    <ol class="rank-list">
      ${[...COUNTRIES].sort((a, b) => growth(b.populationSeries) - growth(a.populationSeries)).slice(0, 3).map((x) => `<li><a href="#/country/${x.code}">${x.flag} ${escape(x.name)}</a> <strong>+${fmtNum(growth(x.populationSeries), 1)}%</strong></li>`).join('')}
    </ol>
    <p class="more-link"><a href="#/compare">Compare countries side by side →</a></p>
  </div>
</section>

<section aria-labelledby="browse-h">
  <h2 id="browse-h">Browse all countries</h2>
  <ul class="country-grid">${COUNTRIES.map(countryCard).join('')}</ul>
  <p class="note">${escape(DATASET_NOTE)}</p>
</section>`);
}

// ---------------- Country profile ----------------
export function country(code) {
  const c = countryByCode(code);
  if (!c) return missing();
  const popGrowth = growth(c.populationSeries);
  const gdpGrowth = growth(c.gdpSeries);
  const sectorParts = [
    { label: 'Agriculture', value: c.sectors.agriculture, color: '#65a30d' },
    { label: 'Industry', value: c.sectors.industry, color: '#0e7490' },
    { label: 'Services', value: c.sectors.services, color: '#f59e0b' },
  ];
  const rows = INDICATORS.map((ind) => {
    const v = c.stats[ind.key];
    const rank = [...COUNTRIES].sort((a, b) => b.stats[ind.key] - a.stats[ind.key]).findIndex((x) => x.code === c.code) + 1;
    return `<tr><td>${escape(ind.label)}</td><td class="num"><strong>${fmtIndicator(ind.key, v)}</strong></td><td class="num">${rank} of ${COUNTRIES.length}</td><td>${escape(ind.about)}</td></tr>`;
  }).join('');
  const others = COUNTRIES.filter((x) => x.code !== c.code).slice(0, 6);
  return page('', `
<p class="crumbs"><a href="#/">All countries</a> › ${escape(c.region)}</p>
<section class="country-hero">
  <span class="flag big" aria-hidden="true">${c.flag}</span>
  <div>
    <h1>${escape(c.name)}</h1>
    <p class="lede">${escape(c.blurb)}</p>
    <p class="meta">Capital: <strong>${escape(c.capital)}</strong> · Region: <strong>${escape(c.region)}</strong> · Data year: <strong>2024</strong></p>
  </div>
</section>

<div class="kpi-grid">
  ${kpi('Population', fmtNum(c.stats.population, 1) + 'm', `${popGrowth >= 0 ? '+' : ''}${fmtNum(popGrowth, 1)}% since 2015`)}
  ${kpi('GDP', '$' + fmtNum(c.stats.gdp) + 'bn', `${gdpGrowth >= 0 ? '+' : ''}${fmtNum(gdpGrowth, 1)}% since 2015`)}
  ${kpi('GDP per capita', '$' + fmtNum(c.stats.gdpPerCapita), 'current US dollars')}
  ${kpi('Life expectancy', fmtNum(c.stats.lifeExpectancy, 1) + ' yrs', 'at birth')}
  ${kpi('Adult literacy', fmtNum(c.stats.literacy) + '%', 'ages 15 and over')}
  ${kpi('Median age', fmtNum(c.stats.medianAge, 1) + ' yrs', c.stats.medianAge < 30 ? 'a young population' : c.stats.medianAge > 40 ? 'an ageing population' : 'a middle-aged population')}
</div>

<section class="chart-pair">
  <div class="card">
    <h2>Population, 2015–2024</h2>
    <p class="card-sub">Millions of people · ${popGrowth >= 0 ? 'grew' : 'fell'} ${fmtNum(Math.abs(popGrowth), 1)}% over the decade</p>
    ${lineChart({ values: c.populationSeries, labels: YEARS.map(String), color: '#0e7490', yLabel: 'million', format: (v) => fmtNum(v, 0) + 'm' })}
  </div>
  <div class="card">
    <h2>GDP, 2015–2024</h2>
    <p class="card-sub">Billions of current US dollars · 2020 dip reflects the pandemic year</p>
    ${barChart({ items: YEARS.map((y, i) => ({ label: String(y).slice(2), value: c.gdpSeries[i] })), color: '#0e7490', format: (v) => '$' + fmtNum(v) + 'bn' })}
  </div>
</section>

<section class="chart-pair">
  <div class="card">
    <h2>Who lives here — age structure</h2>
    <p class="card-sub">Share of the population by age group, 2024</p>
    ${ageBars({ age: c.age })}
    <p class="note">A wide base (many children) means fast future growth; a wide top (many seniors) means an ageing society.</p>
  </div>
  <div class="card">
    <h2>What the economy makes — GDP by sector</h2>
    <p class="card-sub">Share of GDP, 2024 estimate</p>
    <div class="donut-wrap">
      ${donutChart({ parts: sectorParts })}
      <ul class="legend">
        ${sectorParts.map((p) => `<li><span class="swatch" style="background:${p.color}"></span>${escape(p.label)} — <strong>${p.value}%</strong></li>`).join('')}
      </ul>
    </div>
  </div>
</section>

<section class="card">
  <h2>All indicators — ${escape(c.name)}, 2024</h2>
  <table class="data-table">
    <thead><tr><th>Indicator</th><th class="num">Value</th><th class="num">Rank of ${COUNTRIES.length}</th><th>What it means</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="note">${escape(DATASET_NOTE)}</p>
</section>

<section>
  <h2>Compare ${escape(c.name)} with…</h2>
  <ul class="country-grid">${others.map(countryCard).join('')}</ul>
  <p class="more-link"><a href="#/compare?a=${c.code}">Open the comparison tool with ${escape(c.name)} selected →</a></p>
</section>`);
}

// ---------------- Compare ----------------
export function compare(codes) {
  const picked = codes.map(countryByCode).filter(Boolean).slice(0, 3);
  const all = COUNTRIES;
  const select = (id, current) =>
    `<select id="${id}"><option value="">— pick a country —</option>${all.map((x) => `<option value="${x.code}"${x.code === current ? ' selected' : ''}>${escape(x.name)}</option>`).join('')}</select>`;
  const slots = [0, 1, 2].map((i) => {
    const c = picked[i];
    return `<div class="compare-slot">${select('cmp-' + (i + 1), c ? c.code : '')}${c ? `<p class="cmp-name">${c.flag} <strong>${escape(c.name)}</strong></p>` : '<p class="cmp-name muted">Empty slot</p>'}</div>`;
  }).join('');
  let body = '';
  if (picked.length < 2) {
    body = `<div class="card empty-state"><h2>Pick at least two countries</h2><p>Choose two or three countries above and the comparison charts and table appear here. Try Indonesia vs India vs Nigeria to see three very different population stories.</p></div>`;
  } else {
    const keys = ['population', 'gdp', 'gdpPerCapita', 'lifeExpectancy', 'unemployment', 'internet'];
    const chartRows = keys.map((key) => {
      const ind = indicatorByKey(key);
      const items = picked.map((c) => ({ label: c.name, value: c.stats[key] }));
      return `<div class="card"><h3>${escape(ind.label)}</h3><p class="card-sub">${escape(ind.about)}</p>${barChart({ items, color: '#0e7490', format: (v) => fmtIndicator(key, v) })}</div>`;
    }).join('');
    const tableRows = INDICATORS.map((ind) => {
      const cells = picked.map((c) => `<td class="num"><strong>${fmtIndicator(ind.key, c.stats[ind.key])}</strong></td>`).join('');
      return `<tr><td>${escape(ind.label)}</td>${cells}</tr>`;
    }).join('');
    const headCells = picked.map((c) => `<th class="num">${c.flag} ${escape(c.name)}</th>`).join('');
    const popLines = picked.map((c, i) => `<div class="card"><h3>Population trend — ${escape(c.name)}</h3>${lineChart({ values: c.populationSeries, labels: YEARS.map(String), color: ['#0e7490', '#f59e0b', '#65a30d'][i], yLabel: 'million', format: (v) => fmtNum(v, 0) + 'm' })}</div>`);
    body = `
<section class="chart-pair">${popLines.slice(0, 2).join('')}</section>
${picked.length === 3 ? `<section class="chart-pair single">${popLines.slice(2).join('')}</section>` : ''}
<section aria-labelledby="cmp-bars"><h2 id="cmp-bars">Head to head — 2024</h2><div class="chart-grid">${chartRows}</div></section>
<section class="card"><h2>Full comparison table — 2024</h2>
<table class="data-table"><thead><tr><th>Indicator</th>${headCells}</tr></thead><tbody>${tableRows}</tbody></table>
<p class="note">${escape(DATASET_NOTE)}</p></section>`;
  }
  return page('compare', `
<section class="hero slim">
  <p class="eyebrow">Comparison tool</p>
  <h1>Compare countries</h1>
  <p class="lede">Pick two or three countries and see their populations, economies and living standards side by side.</p>
</section>
<section class="compare-bar card"><div class="compare-slots">${slots}</div>
<p class="note">Changing a picker updates the comparison instantly. <a href="#/compare?a=idn&b=ind&c=nga">Try Indonesia vs India vs Nigeria</a> · <a href="#/compare?a=usa&b=jpn&c=deu">USA vs Japan vs Germany</a></p></section>
${body}`);
}

// ---------------- Indicators ----------------
export function indicators(key) {
  const ind = indicatorByKey(key);
  const sorted = [...COUNTRIES].sort((a, b) => b.stats[ind.key] - a.stats[ind.key]);
  const buttons = INDICATORS.map((i) => `<a class="chip${i.key === ind.key ? ' active' : ''}" href="#/indicators/${i.key}">${escape(i.label)}</a>`).join('');
  const rows = sorted.map((c, i) => {
    const best = i === 0;
    return `<tr${best ? ' class="best-row"' : ''}><td>${i + 1}</td><td><a href="#/country/${c.code}">${c.flag} ${escape(c.name)}</a></td><td class="num"><strong>${fmtIndicator(ind.key, c.stats[ind.key])}</strong></td><td>${escape(c.region)}</td></tr>`;
  }).join('');
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  return page('indicators', `
<section class="hero slim">
  <p class="eyebrow">Indicator explorer · 2024</p>
  <h1>${escape(ind.label)}</h1>
  <p class="lede">${escape(ind.about)}</p>
</section>
<nav class="chips" aria-label="Choose an indicator">${buttons}</nav>
<section class="card">
  <h2>Ranking — ${escape(ind.label)} (${escape(ind.unit)})</h2>
  <p class="card-sub">Highest: <strong>${best.flag} ${escape(best.name)} — ${fmtIndicator(ind.key, best.stats[ind.key])}</strong> · Lowest: <strong>${worst.flag} ${escape(worst.name)} — ${fmtIndicator(ind.key, worst.stats[ind.key])}</strong></p>
  ${rankedBars({ items: sorted.map((c) => ({ label: c.name, value: c.stats[ind.key] })), format: (v) => fmtIndicator(ind.key, v) })}
</section>
<section class="card">
  <h2>Full table — ${escape(ind.label)}</h2>
  <table class="data-table">
    <thead><tr><th>Rank</th><th>Country</th><th class="num">Value</th><th>Region</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="note">${escape(DATASET_NOTE)}</p>
</section>`);
}

// ---------------- About / methodology ----------------
export function about() {
  return page('about', `
<section class="hero slim">
  <p class="eyebrow">Methodology &amp; sources</p>
  <h1>About the data</h1>
  <p class="lede">StatAtlas is a demonstration national-statistics explorer. It shows what a real statistics office site does — country profiles, trends, comparisons and rankings — on a small, clearly-labelled illustrative dataset.</p>
</section>
<section class="card prose">
  <h2>What this dataset is</h2>
  <p>${escape(DATASET_NOTE)}</p>
  <p>Each figure is a rounded approximation of a well-known public estimate for 2024 (population and GDP series run 2015–2024). The numbers are close to the published values for the countries shown, but they are <strong>not</strong> an official release and should not be quoted as one. If you need exact figures, go to the sources below.</p>
  <h2>Sources</h2>
  <ul>
    <li><strong>World Bank Open Data</strong> — population, GDP, GDP per capita, life expectancy, literacy, unemployment, internet use, CO₂ emissions, urban share (data.worldbank.org).</li>
    <li><strong>UN World Population Prospects</strong> — population series and age structure (population.un.org).</li>
    <li><strong>National statistics offices</strong> — the model for how figures like these are published country by country.</li>
  </ul>
  <h2>How to read the site</h2>
  <ul>
    <li><strong>Home</strong> — pick a country, see its headline numbers, its population and GDP trends, and the biggest countries at a glance.</li>
    <li><strong>Country profile</strong> — every indicator for one country, its ten-year trends, its age structure and what its economy is made of.</li>
    <li><strong>Compare</strong> — two or three countries side by side on the same charts and the same table.</li>
    <li><strong>Indicators</strong> — rank all twelve countries on any single indicator.</li>
  </ul>
  <h2>What “rank” means</h2>
  <p>Ranks are within the twelve countries in this dataset only — “1 of 12” means the highest of the twelve, not of the world. A low rank on unemployment is good; a low rank on life expectancy is not. The indicator pages say which direction is better where it applies.</p>
  <h2>About StatAtlas</h2>
  <p>StatAtlas is original work built for the make.fun “best national statistics site” bounty. It is a static single-page app: plain HTML, CSS and JavaScript with inline SVG charts, no external requests, no tracking, no cookies. It runs offline from its own files on desktop and phone.</p>
</section>`);
}

export function missing() {
  return page('', `<section class="card empty-state"><h1>Page not found</h1><p>There is no statistics page at this address. Try the <a href="#/">home page</a>, a <a href="#/compare">comparison</a> or the <a href="#/indicators">indicator explorer</a>.</p></section>`);
}
