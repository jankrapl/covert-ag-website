// Time-horizon widget and compound interest calculator on the pension page.

// Time horizon
const age = document.getElementById('calcAge') as HTMLInputElement | null;
const retire = document.getElementById('calcRetire') as HTMLInputElement | null;

function updateSpan() {
  if (!age || !retire) return;
  const a = parseInt(age.value, 10) || 0;
  const r = parseInt(retire.value, 10) || 0;
  const years = Math.max(0, r - a);
  document.querySelectorAll('[data-span-years]').forEach((el) => { el.textContent = String(years); });
  const bar = document.querySelector<HTMLElement>('[data-span-bar]');
  if (bar) bar.style.width = `${Math.min(100, (years / 50) * 100)}%`;
}
age?.addEventListener('input', updateSpan);
retire?.addEventListener('input', updateSpan);

// Compound interest
const root = document.getElementById('calc');
const COL_DEPOSIT = '#2f9c82';
const COL_GROWTH = '#cb7d22';
const SURFACE = '#0b2b27';

if (root) {
  const labels = JSON.parse(root.dataset.labels ?? '{}') as Record<'dep' | 'grow' | 'total' | 'year', string>;
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const fields = ['cOnce', 'cMonth', 'cYears', 'cRate'];
  const chf = (n: number) => `CHF ${Math.round(n).toLocaleString('de-CH')}`;

  // Monthly compounding, deposits at the end of each month.
  const futureValue = (once: number, monthly: number, years: number, ratePct: number) => {
    const i = ratePct / 100 / 12;
    const n = Math.round(years * 12);
    if (i === 0) return once + monthly * n;
    return once * (1 + i) ** n + (monthly * ((1 + i) ** n - 1)) / i;
  };

  const compact = (n: number) => {
    if (n >= 1e6) return `${(n / 1e6).toLocaleString('de-CH', { maximumFractionDigits: 1 })} Mio.`;
    if (n >= 1e4) return `${Math.round(n / 1e3)}k`;
    return Math.round(n).toLocaleString('de-CH');
  };

  // Axis maximum and step on a 1/2/2.5/5 grid.
  function niceStep(max: number) {
    const rough = max / 4;
    const pow = 10 ** Math.floor(Math.log10(rough || 1));
    const unit = [1, 2, 2.5, 5, 10].find((s) => s * pow >= rough) ?? 10;
    return unit * pow;
  }

  function read() {
    const v = (id: string) => parseFloat(($<HTMLInputElement>(`${id}N`)).value) || 0;
    return { once: Math.max(0, v('cOnce')), monthly: Math.max(0, v('cMonth')), years: Math.min(40, Math.max(1, Math.round(v('cYears')))), rate: Math.max(0, v('cRate')) };
  }

  let series: { year: number; dep: number; grow: number; total: number }[] = [];

  function render() {
    const { once, monthly, years, rate } = read();
    series = Array.from({ length: years }, (_, k) => {
      const year = k + 1;
      const total = futureValue(once, monthly, year, rate);
      const dep = once + monthly * 12 * year;
      return { year, dep, grow: Math.max(0, total - dep), total };
    });
    const last = series[series.length - 1];
    $('cDep').textContent = chf(last.dep);
    $('cGrow').textContent = chf(last.grow);
    $('cTotal').textContent = chf(last.total);
    $('cDiff').textContent = chf(futureValue(once, monthly, years, 5) - futureValue(once, monthly, years, 3));
    $('cDiffY').textContent = String(years);
    drawChart(last.total);
    drawTable();
  }

  const chartBox = $('cChart');

  function drawChart(maxTotal: number) {
    // Drawn at the container's real width, so axis text stays 12px on a phone.
    const W = Math.max(280, Math.round(chartBox.clientWidth));
    const H = W < 520 ? 240 : 300;
    const L = W < 520 ? 44 : 56, R = 8, T = 26, B = 26;
    const plotW = W - L - R, plotH = H - T - B;
    const step = niceStep(maxTotal || 1);
    const yMax = Math.max(step, Math.ceil(maxTotal / step) * step);
    const y = (v: number) => T + plotH - (v / yMax) * plotH;
    const band = plotW / series.length;
    const barW = Math.min(24, Math.max(4, band * 0.72));
    const roomFor = Math.max(4, Math.floor(plotW / 34));
    const everyNth = [1, 2, 5, 10].find((n) => series.length / n <= roomFor) ?? 10;

    let grid = '';
    for (let v = 0; v <= yMax + 1e-6; v += step) {
      grid += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(246,241,231,.14)" stroke-width="1"/>`;
      grid += `<text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="#b8c9bf">${compact(v)}</text>`;
    }

    let bars = '';
    series.forEach((d, i) => {
      const x = L + band * i + (band - barW) / 2;
      const yDep = y(d.dep), yTop = y(d.total);
      const gap = 2;
      const r = Math.min(4, barW / 2);
      // Deposits sit square on the baseline; growth above it with a 2px surface gap and a rounded top.
      const depTop = d.grow > 0 ? yDep + gap / 2 : yDep;
      bars += `<rect x="${x}" y="${depTop}" width="${barW}" height="${Math.max(0, y(0) - depTop)}" fill="${COL_DEPOSIT}"/>`;
      const growH = yDep - gap / 2 - yTop;
      if (growH > 0.5) {
        const rr = Math.min(r, growH);
        bars += `<path fill="${COL_GROWTH}" d="M${x} ${yDep - gap / 2}V${yTop + rr}Q${x} ${yTop} ${x + rr} ${yTop}H${x + barW - rr}Q${x + barW} ${yTop} ${x + barW} ${yTop + rr}V${yDep - gap / 2}Z"/>`;
      }
      if (i === series.length - 1 || (i + 1) % everyNth === 0) {
        bars += `<text x="${x + barW / 2}" y="${H - 8}" text-anchor="middle" font-size="12" fill="#b8c9bf">${d.year}</text>`;
      }
      // Hit target spans the full band and height, larger than the mark.
      bars += `<rect class="calc__hit" data-i="${i}" x="${L + band * i}" y="${T}" width="${band}" height="${plotH}" fill="transparent"/>`;
    });

    const lastX = L + band * (series.length - 1) + band / 2;
    const anchor = series.length > 3 ? 'end' : 'middle';
    const labelX = series.length > 3 ? Math.min(lastX + barW / 2, W - R) : lastX;
    const cap = `<text x="${labelX}" y="${y(series[series.length - 1].total) - 8}" text-anchor="${anchor}" font-size="13" font-weight="500" fill="#f6f1e7">${chf(series[series.length - 1].total)}</text>`;

    $('cChart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${labels.total}, ${labels.dep}, ${labels.grow}" style="background:${SURFACE}">${grid}${bars}${cap}</svg>`;
  }

  function drawTable() {
    const rows = series.map((d) => `<tr><th scope="row">${d.year}</th><td>${chf(d.dep)}</td><td>${chf(d.grow)}</td><td>${chf(d.total)}</td></tr>`).join('');
    $('cTable').innerHTML = `<table><thead><tr><th scope="col">${labels.year}</th><th scope="col">${labels.dep}</th><th scope="col">${labels.grow}</th><th scope="col">${labels.total}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  // Tooltip
  const tip = $<HTMLElement>('cTip');
  function showTip(hit: SVGElement) {
    const d = series[Number(hit.dataset.i)];
    if (!d) return;
    tip.innerHTML = `<strong>${labels.year} ${d.year}</strong><span><i class="calc__key" style="background:${COL_GROWTH}"></i>${labels.grow}<b>${chf(d.grow)}</b></span><span><i class="calc__key" style="background:${COL_DEPOSIT}"></i>${labels.dep}<b>${chf(d.dep)}</b></span><span>${labels.total}<b>${chf(d.total)}</b></span>`;
    tip.hidden = false;
    const box = chartBox.getBoundingClientRect();
    const r = hit.getBoundingClientRect();
    const left = r.left - box.left + r.width / 2 - tip.offsetWidth / 2;
    tip.style.left = `${Math.max(0, Math.min(box.width - tip.offsetWidth, left))}px`;
  }
  chartBox.addEventListener('pointerover', (e) => {
    const t = e.target as SVGElement;
    if (t.classList?.contains('calc__hit')) showTip(t);
  });
  chartBox.addEventListener('click', (e) => {
    const t = e.target as SVGElement;
    if (t.classList?.contains('calc__hit')) showTip(t);
  });
  chartBox.addEventListener('pointerleave', () => { tip.hidden = true; });

  // Sliders and number fields mirror each other.
  for (const id of fields) {
    const range = $<HTMLInputElement>(id);
    const num = $<HTMLInputElement>(`${id}N`);
    range.addEventListener('input', () => { num.value = range.value; render(); });
    num.addEventListener('input', () => { if (num.value !== '') range.value = num.value; render(); });
  }
  render();
  new ResizeObserver(() => { tip.hidden = true; render(); }).observe(chartBox);
}
