// ============================================================
// ANALYTICS.JS - Charts and Reports
// ============================================================

let distBarChart = null, effChart = null, intgChart = null, regfacChart = null;
let effDistChart = null, intgDistChart = null, nativeChart = null, nativeDistChart = null;
let ratingDonutChart = null, distEIChart = null, deptEIChart = null, drilldownChart = null;
let _eiMatrix = {}, _eiDepts = [], _eiHeatmapMode = 'combined';

// ============================================================
// MAIN ANALYTICS
// ============================================================
function renderAnalytics() {
  const distStats = DISTRICTS_DATA.map(d => {
    const stats = getDistrictStats(d.district_id);
    const data   = allDistrictData[d.district_id] || [];
    const lookup = allDistrictData[d.district_id]?._lookup
      || data.reduce((acc, row) => { if (row.post_id) acc[row.post_id] = row; return acc; }, {});

    let effSum = 0, effCount = 0, intgSum = 0, intgCount = 0;
    let regular = 0, fac = 0;
    Object.values(lookup).forEach(r => {
      if (r.efficiency) { effSum += Number(r.efficiency); effCount++; }
      if (r.integrity) { intgSum += Number(r.integrity); intgCount++; }
      if (r.reg_fac === 'Regular') regular++;
      if (r.reg_fac === 'FAC') fac++;
    });

    return {
      name: d.district_name.length > 12 ? d.district_name.substring(0, 10) + '..' : d.district_name,
      pct: stats.pct,
      avgEff: effCount ? (effSum / effCount).toFixed(1) : 0,
      avgIntg: intgCount ? (intgSum / intgCount).toFixed(1) : 0,
      regular, fac
    };
  });

  // District completion bar chart
  const dCtx = document.getElementById('distBarChart')?.getContext('2d');
  if (dCtx) {
    if (distBarChart) distBarChart.destroy();
    distBarChart = new Chart(dCtx, {
      type: 'bar',
      data: {
        labels: distStats.map(d => d.name),
        datasets: [{ label: 'Completion %', data: distStats.map(d => d.pct), backgroundColor: distStats.map(d => d.pct >= 80 ? '#27ae60' : d.pct >= 30 ? '#f39c12' : '#e74c3c') }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } }, onClick: (e, els) => { if (els[0]) drillDownDistrict(DISTRICTS_DATA[els[0].index].district_id); } }
    });
  }

  // Avg Efficiency bar chart
  const eCtx = document.getElementById('effChart')?.getContext('2d');
  if (eCtx) {
    if (effChart) effChart.destroy();
    effChart = new Chart(eCtx, {
      type: 'bar',
      data: {
        labels: distStats.map(d => d.name),
        datasets: [{ label: 'Avg Efficiency', data: distStats.map(d => d.avgEff), backgroundColor: '#16a085' }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 10 } }, plugins: { legend: { display: false } } }
    });
  }

  // Avg Integrity bar chart
  const iCtx = document.getElementById('intgChart')?.getContext('2d');
  if (iCtx) {
    if (intgChart) intgChart.destroy();
    intgChart = new Chart(iCtx, {
      type: 'bar',
      data: {
        labels: distStats.map(d => d.name),
        datasets: [{ label: 'Avg Integrity', data: distStats.map(d => d.avgIntg), backgroundColor: '#8e44ad' }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 10 } }, plugins: { legend: { display: false } } }
    });
  }

  // Reg vs FAC
  const rfCtx = document.getElementById('regfacChart')?.getContext('2d');
  if (rfCtx) {
    const totalReg = distStats.reduce((a, b) => a + b.regular, 0);
    const totalFAC = distStats.reduce((a, b) => a + b.fac, 0);
    if (regfacChart) regfacChart.destroy();
    regfacChart = new Chart(rfCtx, {
      type: 'pie',
      data: {
        labels: ['Regular', 'FAC'],
        datasets: [{ data: [totalReg, totalFAC], backgroundColor: ['#27ae60', '#e8521a'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }
}

// Drill-down: navigate to district entry on chart click
function drillDownDistrict(districtId) {
  openDistrictEntry(districtId);
}

// ============================================================
// E&I REPORT
// ============================================================
function renderEIReport() {
  const tbody = document.getElementById('eiBody');
  if (!tbody) return;

  const rows = [];
  const effScoreDist  = Array(10).fill(0);
  const intgScoreDist = Array(10).fill(0);

  // Per-district aggregates
  const distAgg = {};
  DISTRICTS_DATA.forEach(d => {
    distAgg[d.district_id] = { name: d.district_name, effSum: 0, effCount: 0, intgSum: 0, intgCount: 0 };
  });

  // Per-dept and matrix aggregates
  const deptAgg = {};
  const matrix  = {};
  let excellent = 0, good = 0, average = 0, belowAvg = 0, totalRated = 0;
  let stateEffSum = 0, stateIntgSum = 0;

  DISTRICTS_DATA.forEach(dist => {
    const posts   = getPostsForDistrict(dist.district_id);
    const rawData = allDistrictData[dist.district_id] || [];
    const lookup  = allDistrictData[dist.district_id]?._lookup
      || rawData.reduce((acc, row) => { if (row.post_id) acc[row.post_id] = row; return acc; }, {});
    posts.forEach(post => {
      const r = lookup[post.post_id];
      if (!r || !r.efficiency || !r.integrity) return;
      const eff  = Number(r.efficiency);
      const intg = Number(r.integrity);
      if (eff < 1 || eff > 10 || intg < 1 || intg > 10) return;

      effScoreDist[eff - 1]++;
      intgScoreDist[intg - 1]++;
      stateEffSum += eff; stateIntgSum += intg; totalRated++;

      distAgg[dist.district_id].effSum  += eff;  distAgg[dist.district_id].effCount++;
      distAgg[dist.district_id].intgSum += intg; distAgg[dist.district_id].intgCount++;

      const dk = post.dept_id;
      if (!deptAgg[dk]) deptAgg[dk] = { name: post.department_name, effSum: 0, effCount: 0, intgSum: 0, intgCount: 0 };
      deptAgg[dk].effSum  += eff;  deptAgg[dk].effCount++;
      deptAgg[dk].intgSum += intg; deptAgg[dk].intgCount++;

      const mk = `${dk}__${dist.district_id}`;
      if (!matrix[mk]) matrix[mk] = { deptId: dk, deptName: post.department_name, distId: dist.district_id, effSum: 0, effCount: 0, intgSum: 0, intgCount: 0 };
      matrix[mk].effSum  += eff;  matrix[mk].effCount++;
      matrix[mk].intgSum += intg; matrix[mk].intgCount++;

      const avg = (eff + intg) / 2;
      if (avg >= 8) excellent++;
      else if (avg >= 6) good++;
      else if (avg >= 4) average++;
      else belowAvg++;

      rows.push({ dist, post, r, eff, intg,
        avg: avg.toFixed(1),
        rating: avg >= 8 ? '⭐ Excellent' : avg >= 6 ? '👍 Good' : avg >= 4 ? '🟡 Average' : '🔴 Below Average' });
    });
  });

  // Store globally for toggle / drill-down
  _eiMatrix = matrix;
  _eiDepts  = Object.entries(deptAgg).sort((a, b) => a[1].name.localeCompare(b[1].name));

  // ── KPI Cards ────────────────────────────────────────────────
  const el = id => document.getElementById(id);
  const avgEff  = totalRated ? (stateEffSum  / totalRated).toFixed(1) : '–';
  const avgIntg = totalRated ? (stateIntgSum / totalRated).toFixed(1) : '–';
  const avgComb = totalRated ? ((stateEffSum + stateIntgSum) / (totalRated * 2)).toFixed(1) : '–';
  if (el('ei-totalRated'))   el('ei-totalRated').textContent   = totalRated;
  if (el('ei-avgEff'))       el('ei-avgEff').textContent       = avgEff;
  if (el('ei-avgIntg'))      el('ei-avgIntg').textContent      = avgIntg;
  if (el('ei-avgCombined'))  el('ei-avgCombined').textContent  = avgComb;
  if (el('ei-pctExcellent')) el('ei-pctExcellent').textContent = totalRated ? Math.round((excellent / totalRated) * 100) + '%' : '–';
  if (el('ei-pctBelowAvg'))  el('ei-pctBelowAvg').textContent  = totalRated ? Math.round((belowAvg  / totalRated) * 100) + '%' : '–';

  // ── Officers Table ────────────────────────────────────────────
  tbody.innerHTML = rows.length
    ? rows.sort((a, b) => b.avg - a.avg).map(({ dist, post, r, eff, intg, avg, rating }) => `
        <tr>
          <td>${dist.district_name}</td>
          <td>${post.department_name}</td>
          <td>${post.post_name}</td>
          <td>${r.officer_name || '–'}</td>
          <td style="font-weight:700;color:${eff >= 7 ? 'var(--success)' : eff >= 4 ? 'var(--warning)' : 'var(--danger)'}">${eff}</td>
          <td style="font-weight:700;color:${intg >= 7 ? 'var(--success)' : intg >= 4 ? 'var(--warning)' : 'var(--danger)'}">${intg}</td>
          <td style="font-weight:700">${avg}</td>
          <td>${rating}</td>
        </tr>`).join('')
    : '<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text-muted)">No E&I data available</td></tr>';

  // ── Score Distribution Charts ─────────────────────────────────
  const sLabels = ['1','2','3','4','5','6','7','8','9','10'];
  const sColors = ['#b91c1c','#dc2626','#f97316','#f97316','#f59e0b','#16a34a','#16a34a','#059669','#0284c7','#0284c7'];

  const edCtx = el('effDistChart')?.getContext('2d');
  if (edCtx) {
    if (effDistChart) effDistChart.destroy();
    effDistChart = new Chart(edCtx, {
      type: 'bar',
      data: { labels: sLabels, datasets: [{ data: effScoreDist, backgroundColor: sColors, borderRadius: 6, borderSkipped: false }] },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { title: ctx => 'Score: ' + ctx[0].label, label: ctx => '  ' + ctx.raw + ' officers' } } },
        scales: { x: { title: { display: true, text: 'Efficiency Score →', font: { size: 9 } } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        animation: { duration: 900, easing: 'easeOutQuart' } }
    });
  }

  const idCtx = el('intgDistChart')?.getContext('2d');
  if (idCtx) {
    if (intgDistChart) intgDistChart.destroy();
    intgDistChart = new Chart(idCtx, {
      type: 'bar',
      data: { labels: sLabels, datasets: [{ data: intgScoreDist, backgroundColor: sColors, borderRadius: 6, borderSkipped: false }] },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { title: ctx => 'Score: ' + ctx[0].label, label: ctx => '  ' + ctx.raw + ' officers' } } },
        scales: { x: { title: { display: true, text: 'Integrity Score →', font: { size: 9 } } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        animation: { duration: 900, easing: 'easeOutQuart' } }
    });
  }

  // ── Rating Category Donut ─────────────────────────────────────
  const rdCtx = el('ratingDonutChart')?.getContext('2d');
  if (rdCtx) {
    if (ratingDonutChart) ratingDonutChart.destroy();
    ratingDonutChart = new Chart(rdCtx, {
      type: 'doughnut',
      data: {
        labels: ['⭐ Excellent (≥8)', '👍 Good (6–7)', '🟡 Average (4–5)', '🔴 Below Avg (<4)'],
        datasets: [{ data: [excellent, good, average, belowAvg],
          backgroundColor: ['#16a34a','#22c55e','#f59e0b','#dc2626'],
          borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 10, boxWidth: 12 } },
          tooltip: { callbacks: { label: ctx => `  ${ctx.label}: ${ctx.raw} officers` } }
        },
        animation: { duration: 1000, easing: 'easeOutBounce' } }
    });
  }

  // ── District-wise E&I horizontal bar (all districts) ─────────
  const distArr = DISTRICTS_DATA
    .map(d => ({
      name:    d.district_name.length > 14 ? d.district_name.slice(0, 13) + '..' : d.district_name,
      avgEff:  distAgg[d.district_id].effCount  ? +(distAgg[d.district_id].effSum  / distAgg[d.district_id].effCount ).toFixed(1) : 0,
      avgIntg: distAgg[d.district_id].intgCount ? +(distAgg[d.district_id].intgSum / distAgg[d.district_id].intgCount).toFixed(1) : 0,
      hasData: distAgg[d.district_id].effCount > 0
    }))
    .filter(d => d.hasData)
    .sort((a, b) => b.avgEff - a.avgEff);

  const deiCtx = el('distEIChart')?.getContext('2d');
  if (deiCtx) {
    if (distEIChart) distEIChart.destroy();
    distEIChart = new Chart(deiCtx, {
      type: 'bar',
      data: {
        labels: distArr.map(d => d.name),
        datasets: [
          { label: 'Avg Efficiency', data: distArr.map(d => d.avgEff),  backgroundColor: 'rgba(44,90,160,0.85)',  borderRadius: 4, borderSkipped: false },
          { label: 'Avg Integrity',  data: distArr.map(d => d.avgIntg), backgroundColor: 'rgba(22,160,133,0.75)', borderRadius: 4, borderSkipped: false }
        ]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: { x: { beginAtZero: true, max: 10, ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 9 } } } },
        plugins: { legend: { position: 'top', labels: { font: { size: 10 }, boxWidth: 12 } } },
        animation: { duration: 1200, easing: 'easeOutQuart' } }
    });
  }

  // ── Department-wise E&I horizontal bar ───────────────────────
  const deptArr = Object.entries(deptAgg)
    .map(([, v]) => ({
      name:    v.name.length > 24 ? v.name.slice(0, 22) + '..' : v.name,
      avgEff:  +(v.effSum  / v.effCount ).toFixed(1),
      avgIntg: +(v.intgSum / v.intgCount).toFixed(1)
    }))
    .sort((a, b) => b.avgEff - a.avgEff);

  const depCtx = el('deptEIChart')?.getContext('2d');
  if (depCtx) {
    if (deptEIChart) deptEIChart.destroy();
    deptEIChart = new Chart(depCtx, {
      type: 'bar',
      data: {
        labels: deptArr.map(d => d.name),
        datasets: [
          { label: 'Avg Efficiency', data: deptArr.map(d => d.avgEff),  backgroundColor: 'rgba(142,68,173,0.85)', borderRadius: 4, borderSkipped: false },
          { label: 'Avg Integrity',  data: deptArr.map(d => d.avgIntg), backgroundColor: 'rgba(232,82,26,0.75)',  borderRadius: 4, borderSkipped: false }
        ]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: { x: { beginAtZero: true, max: 10, ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 9 } } } },
        plugins: { legend: { position: 'top', labels: { font: { size: 10 }, boxWidth: 12 } } },
        animation: { duration: 1200, easing: 'easeOutQuart' } }
    });
  }

  // ── Populate dept drill-down dropdown (once) ──────────────────
  const deptSel = el('eiDrillDeptSelect');
  if (deptSel && deptSel.options.length <= 1) {
    _eiDepts.forEach(([id, v]) => {
      const opt = document.createElement('option');
      opt.value = id; opt.textContent = v.name;
      deptSel.appendChild(opt);
    });
  }

  // ── Heatmap ────────────────────────────────────────────────────
  _eiHeatmapMode = 'combined';
  ['hmBtnCombined','hmBtnEff','hmBtnIntg'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.className = 'btn btn-sm hm-btn' + (id === 'hmBtnCombined' ? ' hm-btn-active' : '');
  });
  renderHeatmap('combined');
}

// ── Drill-down ─────────────────────────────────────────────────
function renderEIDrilldown() {
  const deptId = document.getElementById('eiDrillDeptSelect')?.value;
  const placeholder = document.getElementById('drilldownPlaceholder');
  const chartWrap   = document.getElementById('drilldownChartWrap');
  const ctx = document.getElementById('drilldownChart')?.getContext('2d');
  if (!ctx) return;

  if (drilldownChart) { drilldownChart.destroy(); drilldownChart = null; }

  if (!deptId) {
    if (placeholder) placeholder.style.display = 'flex';
    if (chartWrap)   chartWrap.style.display   = 'none';
    return;
  }
  if (placeholder) placeholder.style.display = 'none';
  if (chartWrap)   chartWrap.style.display   = 'block';

  const deptName = document.getElementById('eiDrillDeptSelect')?.selectedOptions[0]?.textContent || '';

  const data = DISTRICTS_DATA.map(d => {
    const entry = _eiMatrix[`${deptId}__${d.district_id}`];
    return {
      name:    d.district_name.length > 14 ? d.district_name.slice(0, 13) + '..' : d.district_name,
      avgEff:  entry && entry.effCount  ? +(entry.effSum  / entry.effCount ).toFixed(1) : null,
      avgIntg: entry && entry.intgCount ? +(entry.intgSum / entry.intgCount).toFixed(1) : null,
      hasData: !!(entry && entry.effCount > 0)
    };
  }).filter(d => d.hasData);

  if (data.length === 0) {
    if (placeholder) { placeholder.style.display = 'flex'; placeholder.querySelector('span:last-child').textContent = `No E&I data for ${deptName}`; }
    if (chartWrap) chartWrap.style.display = 'none';
    return;
  }

  drilldownChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [
        {
          label: 'Avg Efficiency',
          data: data.map(d => d.avgEff),
          backgroundColor: data.map(d => {
            const v = d.avgEff || 0;
            return v >= 8 ? 'rgba(22,163,74,0.88)' : v >= 6 ? 'rgba(37,99,235,0.82)' : v >= 4 ? 'rgba(245,158,11,0.85)' : 'rgba(220,38,38,0.85)';
          }),
          borderRadius: 5, borderSkipped: false
        },
        {
          label: 'Avg Integrity',
          data: data.map(d => d.avgIntg),
          backgroundColor: 'rgba(22,160,133,0.5)',
          borderRadius: 5, borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, max: 10, ticks: { stepSize: 1, font: { size: 10 } },
          title: { display: true, text: 'Avg Score (out of 10)', font: { size: 10 } } },
        x: { ticks: { font: { size: 10 } } }
      },
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10 }, boxWidth: 12 } },
        title: { display: true, text: `${deptName}  –  District-wise Avg Efficiency & Integrity`, font: { size: 12, weight: '700' }, color: '#1a2340', padding: { bottom: 12 } }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });
}

// ── Heatmap toggle ─────────────────────────────────────────────
function switchHeatmap(mode) {
  _eiHeatmapMode = mode;
  ['hmBtnCombined','hmBtnEff','hmBtnIntg'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.className = 'btn btn-sm hm-btn';
  });
  const activeId = { combined: 'hmBtnCombined', eff: 'hmBtnEff', intg: 'hmBtnIntg' }[mode];
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) activeBtn.className = 'btn btn-sm hm-btn hm-btn-active';
  renderHeatmap(mode);
}

// ── Heatmap render ─────────────────────────────────────────────
function renderHeatmap(mode) {
  const table = document.getElementById('eiHeatmapTable');
  if (!table) return;

  const deptSet = new Set(), distSet = new Set();
  Object.values(_eiMatrix).forEach(v => { deptSet.add(v.deptId); distSet.add(v.distId); });

  if (deptSet.size === 0) {
    table.innerHTML = '<tbody><tr><td style="text-align:center;padding:30px;color:var(--text-muted)">No E&I data available</td></tr></tbody>';
    return;
  }

  const depts = _eiDepts.filter(([id]) => deptSet.has(id));
  const dists  = DISTRICTS_DATA.filter(d => distSet.has(d.district_id));

  function hmClass(val) {
    if (val === null) return 'hm-na';
    if (val < 4) return 'hm-lo';
    if (val < 6) return 'hm-mid';
    if (val < 8) return 'hm-good';
    return 'hm-hi';
  }
  function getVal(deptId, distId) {
    const e = _eiMatrix[`${deptId}__${distId}`];
    if (!e || e.effCount === 0) return null;
    if (mode === 'eff')  return e.effSum  / e.effCount;
    if (mode === 'intg') return e.intgSum / e.intgCount;
    return (e.effSum + e.intgSum) / (e.effCount * 2);
  }
  function shortDist(name) {
    const w = name.split(' ');
    return w[0].length <= 7 ? w[0] : w[0].slice(0, 6) + '..';
  }

  let html = '<thead><tr><th class="hm-dept-col">Department \\ District</th>';
  dists.forEach(d => { html += `<th class="hm-dist-col" title="${d.district_name}">${shortDist(d.district_name)}</th>`; });
  html += '</tr></thead><tbody>';

  depts.forEach(([deptId, deptInfo]) => {
    html += `<tr><td class="hm-dept-label">${deptInfo.name}</td>`;
    dists.forEach(d => {
      const val = getVal(deptId, d.district_id);
      const cls = hmClass(val);
      const display = val !== null ? val.toFixed(1) : '–';
      html += `<td class="hm-cell ${cls}" title="${deptInfo.name} × ${d.district_name}: ${display}">${display}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;
}

// ============================================================
// NATIVE DISTRICT REPORT
// ============================================================
function renderNativeReport() {
  const tbody = document.getElementById('nativeBody');
  if (!tbody) return;

  let nativeCount = 0, nonNativeCount = 0;
  const nativeByDist = {};
  DISTRICTS_DATA.forEach(d => { nativeByDist[d.district_name] = 0; });

  const rows = [];
  DISTRICTS_DATA.forEach(dist => {
    const posts   = getPostsForDistrict(dist.district_id);
    const rawData = allDistrictData[dist.district_id] || [];
    const lookup  = allDistrictData[dist.district_id]?._lookup
      || rawData.reduce((acc, row) => { if (row.post_id) acc[row.post_id] = row; return acc; }, {});
    posts.forEach(post => {
      const r = lookup[post.post_id];
      if (!r || !r.officer_name || r.is_vacant === 'true') return;
      const isNative = r.native_dist === dist.district_id;
      if (isNative) { nativeCount++; nativeByDist[dist.district_name] = (nativeByDist[dist.district_name] || 0) + 1; }
      else nonNativeCount++;
      const nativeName = r.native_dist ? (r.native_dist === 'OTHER_STATE' ? 'Other State' : (DISTRICTS_DATA.find(d => d.district_id === r.native_dist)?.district_name || r.native_dist)) : '–';
      rows.push({ dist, post, r, isNative, nativeName });
    });
  });

  tbody.innerHTML = rows.length ? rows.map(({ dist, post, r, isNative, nativeName }) => `
    <tr>
      <td>${dist.district_name}</td>
      <td>${post.post_name}</td>
      <td>${r.officer_name}</td>
      <td>${dist.district_name}</td>
      <td>${nativeName}</td>
      <td>${isNative ? '<span class="row-status-badge badge-vacant">🏡 Native</span>' : '<span class="row-status-badge badge-partial">🔀 Non-Native</span>'}</td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">No data available</td></tr>';

  // Native pie chart
  const nCtx = document.getElementById('nativeChart')?.getContext('2d');
  if (nCtx) {
    if (nativeChart) nativeChart.destroy();
    nativeChart = new Chart(nCtx, {
      type: 'doughnut',
      data: {
        labels: ['Native District', 'Non-Native'],
        datasets: [{ data: [nativeCount, nonNativeCount], backgroundColor: ['#16a085', '#e8521a'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  // Native by district bar chart
  const ndCtx = document.getElementById('nativeDistChart')?.getContext('2d');
  if (ndCtx) {
    const entries = Object.entries(nativeByDist).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 15);
    if (nativeDistChart) nativeDistChart.destroy();
    nativeDistChart = new Chart(ndCtx, {
      type: 'bar',
      data: {
        labels: entries.map(([name]) => name.length > 12 ? name.substring(0, 10) + '..' : name),
        datasets: [{ label: 'Native Officers', data: entries.map(([, v]) => v), backgroundColor: '#16a085' }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
    });
  }
}
