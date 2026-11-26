// StatAtlas data: an illustrative national-statistics dataset for 12 countries.
// Every figure is APPROXIMATE, compiled from well-known public releases
// (World Bank Open Data, UN World Population Prospects, 2023-2024 vintages).
// Figures are rounded and shown as published estimates, not official releases:
// the site labels them "illustrative" on every page and in the methodology page.
// Years run 2015-2024. Population is in millions, GDP in billions of current USD.

export const DATASET_NOTE =
  'Illustrative figures — approximate values compiled from World Bank Open Data and UN population estimates, 2023–2024. Rounded for display; not an official statistical release.';

export const INDICATORS = [
  { key: 'population', label: 'Population', unit: 'million', decimals: 1, higherBetter: null, about: 'People living in the country, mid-year estimate.' },
  { key: 'gdp', label: 'GDP', unit: 'US$ bn', decimals: 0, higherBetter: null, about: 'Gross domestic product in current US dollars.' },
  { key: 'gdpPerCapita', label: 'GDP per capita', unit: 'US$', decimals: 0, higherBetter: true, about: 'GDP divided by population, current US dollars.' },
  { key: 'lifeExpectancy', label: 'Life expectancy', unit: 'years', decimals: 1, higherBetter: true, about: 'Years a newborn is expected to live at current mortality rates.' },
  { key: 'literacy', label: 'Adult literacy', unit: '%', decimals: 0, higherBetter: true, about: 'Share of people aged 15+ who can read and write.' },
  { key: 'unemployment', label: 'Unemployment', unit: '%', decimals: 1, higherBetter: false, about: 'Share of the labour force without work but available and seeking it.' },
  { key: 'internet', label: 'Internet users', unit: '%', decimals: 0, higherBetter: true, about: 'Share of people who used the internet in the last three months.' },
  { key: 'co2', label: 'CO2 per capita', unit: 'tonnes', decimals: 1, higherBetter: false, about: 'Carbon dioxide emissions from fuel burning, per person.' },
  { key: 'medianAge', label: 'Median age', unit: 'years', decimals: 1, higherBetter: null, about: 'Age that splits the population in half: younger vs older.' },
  { key: 'urban', label: 'Urban population', unit: '%', decimals: 0, higherBetter: null, about: 'Share of people living in urban areas.' },
];

// Series are [2015, 2016, ..., 2024].
export const COUNTRIES = [
  {
    code: 'idn', name: 'Indonesia', region: 'South-East Asia', capital: 'Jakarta', flag: '🇮🇩',
    blurb: 'The world’s largest archipelago nation — over 17,000 islands, the fourth-largest population on Earth, and South-East Asia’s biggest economy.',
    populationSeries: [258.2, 261.1, 264.0, 266.9, 269.6, 272.2, 274.9, 276.0, 277.5, 279.0],
    gdpSeries: [860, 932, 1015, 1042, 1119, 1059, 1187, 1319, 1371, 1400],
    stats: { population: 279.0, gdp: 1400, gdpPerCapita: 5020, lifeExpectancy: 71.8, literacy: 96, unemployment: 5.3, internet: 66, co2: 2.3, medianAge: 30.3, urban: 58 },
    age: { young: 25, working: 68, senior: 7 },
    sectors: { agriculture: 12, industry: 39, services: 49 },
  },
  {
    code: 'ind', name: 'India', region: 'South Asia', capital: 'New Delhi', flag: '🇮🇳',
    blurb: 'The world’s most populous country, home to one in six people on Earth, with a fast-growing services-led economy and a very young workforce.',
    populationSeries: [1322.9, 1338.7, 1354.2, 1369.0, 1383.1, 1396.4, 1409.0, 1417.2, 1428.6, 1440.0],
    gdpSeries: [2103, 2295, 2651, 2702, 2831, 2667, 3150, 3389, 3568, 3900],
    stats: { population: 1440.0, gdp: 3900, gdpPerCapita: 2710, lifeExpectancy: 67.7, literacy: 78, unemployment: 4.2, internet: 52, co2: 1.9, medianAge: 28.7, urban: 36 },
    age: { young: 25, working: 68, senior: 7 },
    sectors: { agriculture: 17, industry: 26, services: 57 },
  },
  {
    code: 'usa', name: 'United States', region: 'North America', capital: 'Washington, D.C.', flag: '🇺🇸',
    blurb: 'The world’s largest economy by GDP, the third-most populous country, and a global centre for technology, finance and higher education.',
    populationSeries: [320.7, 323.1, 325.1, 326.8, 328.2, 329.5, 331.5, 333.3, 334.9, 336.0],
    gdpSeries: [18238, 18745, 19543, 20530, 21372, 20893, 23026, 25744, 27361, 29000],
    stats: { population: 336.0, gdp: 29000, gdpPerCapita: 86300, lifeExpectancy: 78.4, literacy: 99, unemployment: 3.6, internet: 91, co2: 14.3, medianAge: 38.5, urban: 83 },
    age: { young: 18, working: 65, senior: 17 },
    sectors: { agriculture: 1, industry: 18, services: 81 },
  },
  {
    code: 'bra', name: 'Brazil', region: 'South America', capital: 'Brasília', flag: '🇧🇷',
    blurb: 'South America’s largest country and economy, a farming and energy powerhouse with more than 200 million people across five time zones.',
    populationSeries: [203.5, 205.2, 207.0, 208.8, 210.5, 212.0, 213.3, 215.3, 216.4, 217.7],
    gdpSeries: [1802, 1795, 2063, 1916, 1873, 1448, 1649, 1920, 2174, 2170],
    stats: { population: 217.7, gdp: 2170, gdpPerCapita: 9970, lifeExpectancy: 75.7, literacy: 94, unemployment: 7.8, internet: 81, co2: 2.2, medianAge: 33.6, urban: 87 },
    age: { young: 21, working: 70, senior: 9 },
    sectors: { agriculture: 6, industry: 20, services: 74 },
  },
  {
    code: 'nga', name: 'Nigeria', region: 'West Africa', capital: 'Abuja', flag: '🇳🇬',
    blurb: 'Africa’s most populous country and largest economy, with a median age under 18 — the youngest large population in this dataset.',
    populationSeries: [182.2, 186.9, 191.8, 196.9, 202.0, 207.3, 212.9, 218.5, 223.8, 229.2],
    gdpSeries: [494, 404, 375, 421, 448, 432, 440, 472, 363, 253],
    stats: { population: 229.2, gdp: 253, gdpPerCapita: 1100, lifeExpectancy: 52.7, literacy: 62, unemployment: 5.0, internet: 36, co2: 0.6, medianAge: 17.2, urban: 54 },
    age: { young: 43, working: 54, senior: 3 },
    sectors: { agriculture: 23, industry: 31, services: 46 },
  },
  {
    code: 'jpn', name: 'Japan', region: 'East Asia', capital: 'Tokyo', flag: '🇯🇵',
    blurb: 'The world’s oldest large population — a median age near 50 — and the fourth-largest economy, built on manufacturing and technology.',
    populationSeries: [127.1, 126.9, 126.7, 126.5, 126.3, 126.1, 125.7, 125.4, 125.1, 124.8],
    gdpSeries: [4394, 5003, 4930, 5032, 5123, 5040, 5034, 4263, 4213, 4100],
    stats: { population: 124.8, gdp: 4100, gdpPerCapita: 32900, lifeExpectancy: 84.0, literacy: 99, unemployment: 2.6, internet: 93, co2: 8.5, medianAge: 49.5, urban: 92 },
    age: { young: 12, working: 59, senior: 29 },
    sectors: { agriculture: 1, industry: 29, services: 70 },
  },
  {
    code: 'deu', name: 'Germany', region: 'Western Europe', capital: 'Berlin', flag: '🇩🇪',
    blurb: 'Europe’s largest economy and its manufacturing engine — cars, machinery and chemicals — with 84 million people at the heart of the EU.',
    populationSeries: [81.2, 82.3, 82.7, 83.0, 83.2, 83.2, 83.2, 84.1, 84.7, 84.9],
    gdpSeries: [3357, 3468, 3670, 3953, 3867, 3806, 4216, 4076, 4457, 4610],
    stats: { population: 84.9, gdp: 4610, gdpPerCapita: 54300, lifeExpectancy: 80.7, literacy: 99, unemployment: 3.0, internet: 94, co2: 7.3, medianAge: 45.8, urban: 78 },
    age: { young: 14, working: 64, senior: 22 },
    sectors: { agriculture: 1, industry: 30, services: 69 },
  },
  {
    code: 'ken', name: 'Kenya', region: 'East Africa', capital: 'Nairobi', flag: '🇰🇪',
    blurb: 'East Africa’s largest economy and a world leader in mobile money, with a young, fast-growing population and a services-led growth story.',
    populationSeries: [47.9, 48.9, 50.0, 51.1, 52.3, 53.5, 54.7, 54.0, 55.1, 56.2],
    gdpSeries: [70, 76, 82, 92, 100, 101, 110, 114, 108, 116],
    stats: { population: 56.2, gdp: 116, gdpPerCapita: 2060, lifeExpectancy: 62.7, literacy: 82, unemployment: 5.4, internet: 33, co2: 0.3, medianAge: 19.8, urban: 29 },
    age: { young: 39, working: 58, senior: 3 },
    sectors: { agriculture: 22, industry: 17, services: 61 },
  },
  {
    code: 'mex', name: 'Mexico', region: 'North America', capital: 'Mexico City', flag: '🇲🇽',
    blurb: 'The world’s largest Spanish-speaking country, a manufacturing hub next to the United States, and Latin America’s second-largest economy.',
    populationSeries: [121.0, 122.3, 123.5, 124.7, 125.9, 127.0, 128.1, 129.0, 129.7, 130.6],
    gdpSeries: [1168, 1078, 1159, 1222, 1272, 1093, 1314, 1420, 1790, 1790],
    stats: { population: 130.6, gdp: 1790, gdpPerCapita: 13700, lifeExpectancy: 75.4, literacy: 95, unemployment: 2.8, internet: 79, co2: 3.5, medianAge: 29.6, urban: 81 },
    age: { young: 25, working: 67, senior: 8 },
    sectors: { agriculture: 3, industry: 32, services: 65 },
  },
  {
    code: 'gbr', name: 'United Kingdom', region: 'Northern Europe', capital: 'London', flag: '🇬🇧',
    blurb: 'A services powerhouse — finance, creative industries and research — with 68 million people across Great Britain and Northern Ireland.',
    populationSeries: [65.1, 65.6, 66.1, 66.4, 66.7, 66.8, 67.1, 67.7, 68.4, 68.8],
    gdpSeries: [2927, 2703, 2713, 2891, 2829, 2717, 3131, 3089, 3340, 3380],
    stats: { population: 68.8, gdp: 3380, gdpPerCapita: 49100, lifeExpectancy: 78.6, literacy: 99, unemployment: 4.0, internet: 96, co2: 4.7, medianAge: 40.1, urban: 84 },
    age: { young: 17, working: 63, senior: 20 },
    sectors: { agriculture: 1, industry: 18, services: 81 },
  },
  {
    code: 'egy', name: 'Egypt', region: 'North Africa', capital: 'Cairo', flag: '🇪🇬',
    blurb: 'The Arab world’s most populous country, home to the Nile, the Suez Canal and one of the world’s oldest civilisations.',
    populationSeries: [95.9, 97.5, 99.4, 101.3, 103.2, 105.2, 107.3, 110.0, 112.7, 115.4],
    gdpSeries: [330, 332, 235, 251, 303, 365, 423, 476, 396, 380],
    stats: { population: 115.4, gdp: 380, gdpPerCapita: 3290, lifeExpectancy: 70.2, literacy: 73, unemployment: 7.1, internet: 72, co2: 2.1, medianAge: 24.4, urban: 43 },
    age: { young: 33, working: 62, senior: 5 },
    sectors: { agriculture: 11, industry: 34, services: 55 },
  },
  {
    code: 'vnm', name: 'Vietnam', region: 'South-East Asia', capital: 'Hanoi', flag: '🇻🇳',
    blurb: 'One of Asia’s fastest-growing economies, a manufacturing and export success story with a young workforce of nearly 100 million people.',
    populationSeries: [92.7, 93.6, 94.6, 95.6, 96.5, 97.5, 98.5, 98.5, 98.9, 99.3],
    gdpSeries: [234, 257, 282, 310, 335, 346, 367, 408, 430, 450],
    stats: { population: 99.3, gdp: 450, gdpPerCapita: 4530, lifeExpectancy: 74.7, literacy: 96, unemployment: 2.3, internet: 77, co2: 2.6, medianAge: 32.8, urban: 38 },
    age: { young: 22, working: 69, senior: 9 },
    sectors: { agriculture: 12, industry: 38, services: 50 },
  },
];

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === (code || '').toLowerCase()) || null;
}

export function indicatorByKey(key) {
  return INDICATORS.find((i) => i.key === key) || INDICATORS[0];
}

export function growth(series) {
  const first = series[0];
  const last = series[series.length - 1];
  return ((last - first) / first) * 100;
}
