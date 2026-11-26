// StatAtlas charts: small inline-SVG chart builders, no libraries, no network.
// Every chart is a function returning an SVG string, so any page can embed one.

function svgOpen(width, height, label) {
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">`;
}

function niceMax(values) {
  const max = Math.max(...values, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / pow;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * pow;
}

function fmtCompact(v) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k';
  return String(Math.round(v * 10) / 10);
}

// Line chart with dots, area fill and year labels. values: numbers, labels: year strings.
export function lineChart({ values, labels, color = '#0e7490', height = 220, yLabel = '', format = (v) => String(v) }) {
  const W = 640;
  const H = height;
  const padL = 52;
  const padR = 14;
  const padT = yLabel ? 28 : 14;
  const padB = 30;
  const max = niceMax(values);
  const min = 0;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const x = (i) => padL + (i / (values.length - 1)) * iw;
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${padL},${y(0)} ${points} ${x(values.length - 1).toFixed(1)},${y(0)}`;
  const grid = [0, 0.5, 1].map((f) => {
    const gy = padT + ih * (1 - f);
    const gv = min + (max - min) * f;
    return `<line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#64748b">${format(gv)}</text>`;
  }).join('');
  const yearLabels = labels.map((lab, i) => {
    if (i % 2 !== 0 && labels.length > 6) return '';
    return `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#64748b">${lab}</text>`;
  }).join('');
  const dots = values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${color}"><title>${labels[i]}: ${format(v)}</title></circle>`).join('');
  return `${svgOpen(W, H, 'Line chart')}
  ${yLabel ? `<text x="${padL}" y="12" font-size="11" font-weight="600" fill="#334155">${yLabel}</text>` : ''}
  ${grid}
  <polygon points="${area}" fill="${color}" opacity="0.10"/>
  <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${dots}${yearLabels}</svg>`;
}

// Vertical bar chart. items: [{label, value}], highlightIndex optional.
export function barChart({ items, color = '#0e7490', highlight = '#f59e0b', height = 220, format = (v) => String(v), highlightIndex = -1 }) {
  const W = 640;
  const H = height;
  const padL = 52;
  const padR = 10;
  const padT = 12;
  const padB = 30;
  const max = niceMax(items.map((i) => i.value));
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const slot = iw / items.length;
  const barW = Math.min(46, slot * 0.62);
  const grid = [0, 0.5, 1].map((f) => {
    const gy = padT + ih * (1 - f);
    return `<line x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#64748b">${format(max * f)}</text>`;
  }).join('');
  const bars = items.map((it, i) => {
    const bx = padL + slot * i + (slot - barW) / 2;
    const bh = (it.value / max) * ih;
    const by = padT + ih - bh;
    const c = i === highlightIndex ? highlight : color;
    return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW}" height="${bh.toFixed(1)}" rx="3" fill="${c}"><title>${it.label}: ${format(it.value)}</title></rect>
    <text x="${(bx + barW / 2).toFixed(1)}" y="${(by - 5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">${format(it.value)}</text>
    <text x="${(bx + barW / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#64748b">${it.label}</text>`;
  }).join('');
  return `${svgOpen(W, H, 'Bar chart')}${grid}${bars}</svg>`;
}

// Horizontal ranked bars, best for comparing many countries on one indicator.
export function rankedBars({ items, color = '#0e7490', format = (v) => String(v), top = 12 }) {
  const rows = items.slice(0, top);
  const rowH = 34;
  const H = 14 + rows.length * rowH + 8;
  const W = 640;
  const padL = 108;
  const padR = 64;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const bars = rows.map((it, i) => {
    const y = 14 + i * rowH;
    const bw = ((it.value / max) * (W - padL - padR)).toFixed(1);
    return `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12" fill="#1e293b">${it.label}</text>
    <rect x="${padL}" y="${y}" width="${bw}" height="20" rx="4" fill="${color}"><title>${it.label}: ${format(it.value)}</title></rect>
    <text x="${padL + Number(bw) + 8}" y="${y + 15}" font-size="12" font-weight="600" fill="#334155">${format(it.value)}</text>`;
  }).join('');
  return `${svgOpen(W, H, 'Ranked bar chart')}${bars}</svg>`;
}

// Donut chart for shares that add to 100, with a legend drawn as HTML beside it.
export function donutChart({ parts, size = 200 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 26;
  let offset = 25; // start at the top
  const arcs = parts.map((p) => {
    const frac = p.value / 100;
    const start = (offset / 100) * Math.PI * 2 - Math.PI / 2;
    const end = ((offset + p.value) / 100) * Math.PI * 2 - Math.PI / 2;
    offset += p.value;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const xi1 = cx + inner * Math.cos(start);
    const yi1 = cy + inner * Math.sin(start);
    const xi2 = cx + inner * Math.cos(end);
    const yi2 = cy + inner * Math.sin(end);
    return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${xi2.toFixed(1)} ${yi2.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi1.toFixed(1)} ${yi1.toFixed(1)} Z" fill="${p.color}"><title>${p.label}: ${p.value}%</title></path>`;
  }).join('');
  return `${svgOpen(size, size, 'Donut chart')}${arcs}<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="15" font-weight="700" fill="#0f172a">100%</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#64748b">of GDP</text></svg>`;
}

// Age-structure bars: three horizontal bars (0-14, 15-64, 65+) with labels.
export function ageBars({ age }) {
  const rows = [
    { label: 'Ages 0–14', value: age.young, color: '#38bdf8' },
    { label: 'Ages 15–64', value: age.working, color: '#0e7490' },
    { label: 'Ages 65+', value: age.senior, color: '#f59e0b' },
  ];
  const W = 640;
  const rowH = 44;
  const H = rows.length * rowH + 8;
  const padL = 96;
  const padR = 56;
  const bars = rows.map((it, i) => {
    const y = 8 + i * rowH;
    const bw = ((it.value / 100) * (W - padL - padR)).toFixed(1);
    return `<text x="${padL - 10}" y="${y + 17}" text-anchor="end" font-size="12" fill="#1e293b">${it.label}</text>
    <rect x="${padL}" y="${y}" width="${bw}" height="24" rx="4" fill="${it.color}"><title>${it.label}: ${it.value}% of population</title></rect>
    <text x="${padL + Number(bw) + 8}" y="${y + 17}" font-size="12" font-weight="700" fill="#334155">${it.value}%</text>`;
  }).join('');
  return `${svgOpen(W, H, 'Age structure chart')}${bars}</svg>`;
}
