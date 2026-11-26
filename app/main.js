// StatAtlas router: hash routes, no build step, no network.
//   #/                          home dashboard (country picker via ?country= or select)
//   #/country/<code>           one country's full profile
//   #/compare?a=..&b=..&c=..    compare up to three countries
//   #/indicators[/<key>]        rank all countries on one indicator
//   #/about                     methodology and sources
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { home, country, compare, indicators, about, missing } from './views.js';
import { countryByCode } from './data.js';

const app = document.getElementById('app');

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart || '');
  return { segments, query };
}

function render() {
  window.__shotReady = false;
  const { segments, query } = parseHash();
  const [page, arg] = segments;
  let html;
  if (!page) {
    html = home(query.get('country') || 'idn');
  } else if (page === 'country') {
    html = country(arg || '');
  } else if (page === 'compare') {
    html = compare([query.get('a'), query.get('b'), query.get('c')]);
  } else if (page === 'indicators') {
    html = indicators(arg || 'population');
  } else if (page === 'about') {
    html = about();
  } else {
    html = missing();
  }
  app.innerHTML = html;
  document.title = titleFor(page, arg);
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function titleFor(page, arg) {
  if (!page) return 'StatAtlas — National Statistics Explorer';
  if (page === 'country') {
    const c = countryByCode(arg || '');
    return c ? `${c.name} — Statistics | StatAtlas` : 'Country not found | StatAtlas';
  }
  if (page === 'compare') return 'Compare Countries | StatAtlas';
  if (page === 'indicators') return 'Indicator Explorer | StatAtlas';
  if (page === 'about') return 'About the Data | StatAtlas';
  return 'Page not found | StatAtlas';
}

function wireControls() {
  // Home: the country picker navigates to that country's profile.
  const homeSelect = document.getElementById('home-country');
  const homeGo = document.getElementById('home-go');
  if (homeSelect && homeGo) {
    const go = () => {
      location.hash = `#/country/${homeSelect.value}`;
    };
    homeGo.addEventListener('click', go);
    homeSelect.addEventListener('change', () => {
      // Re-render the dashboard for the newly picked country, in place.
      location.hash = `#/?country=${homeSelect.value}`;
    });
  }
  // Compare: changing any picker rebuilds the compare URL with all three slots.
  const slots = ['cmp-1', 'cmp-2', 'cmp-3'].map((id) => document.getElementById(id));
  if (slots.every(Boolean)) {
    const rebuild = () => {
      const vals = slots.map((s) => s.value);
      const params = new URLSearchParams();
      if (vals[0]) params.set('a', vals[0]);
      if (vals[1]) params.set('b', vals[1]);
      if (vals[2]) params.set('c', vals[2]);
      location.hash = `#/compare${params.toString() ? '?' + params.toString() : ''}`;
    };
    slots.forEach((s) => s.addEventListener('change', rebuild));
  }
}

window.addEventListener('hashchange', render);
render();
