// ============================================================
// ANALYTICS.JS - Charts and Reports
// ============================================================

let distBarChart = null, effChart = null, intgChart = null, regfacChart = null;
let effDistChart = null, intgDistChart = null, nativeChart = null, nativeDistChart = null;

// ============================================================
// MAIN ANALYTICS
// ============================================================
function renderAnalytics() {
  const distStats = DISTRICTS_DATA.map(d => {
    const stats = getDistrictStats(d.district_id);
    const data = allDistrictData[d.district_id] || [];
    const lookup = allDistrictData[d.district_id]?._lookup || {};

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
  const effDist = Array(10).fill(0);
  const intgDist = Array(10).fill(0);

  DISTRICTS_DATA.forEach(dist => {
    const posts = getPostsForDistrict(dist.district_id);
    const lookup = allDistrictData[dist.district_id]?._lookup || {};
    posts.forEach(post => {
      const r = lookup[post.post_id];
      if (!r || !r.efficiency || !r.integrity) return;
      const eff = Number(r.efficiency);
      const intg = Number(r.integrity);
      if (eff >= 1 && eff <= 10) effDist[eff - 1]++;
      if (intg >= 1 && intg <= 10) intgDist[intg - 1]++;
      const avg = ((eff + intg) / 2).toFixed(1);
      const rating = avg >= 8 ? '⭐ Excellent' : avg >= 6 ? '👍 Good' : avg >= 4 ? '🟡 Average' : '🔴 Below Average';
      rows.push({ dist, post, r, eff, intg, avg, rating });
    });
  });

  // Render table
  tbody.innerHTML = rows.length ? rows.sort((a, b) => b.avg - a.avg).map(({ dist, post, r, eff, intg, avg, rating }) => `
    <tr>
      <td>${dist.district_name}</td>
      <td>${post.department_name}</td>
      <td>${post.post_name}</td>
      <td>${r.officer_name || '–'}</td>
      <td style="font-weight:700; color:${eff >= 7 ? 'var(--success)' : eff >= 4 ? 'var(--warning)' : 'var(--danger)'}">${eff}</td>
      <td style="font-weight:700; color:${intg >= 7 ? 'var(--success)' : intg >= 4 ? 'var(--warning)' : 'var(--danger)'}">${intg}</td>
      <td style="font-weight:700">${avg}</td>
      <td>${rating}</td>
    </tr>
  `).join('') : '<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text-muted)">No E&I data available</td></tr>';

  // Score distribution charts
  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const colors = ['#e74c3c','#e74c3c','#f39c12','#f39c12','#f39c12','#27ae60','#27ae60','#27ae60','#16a085','#16a085'];

  const edCtx = document.getElementById('effDistChart')?.getContext('2d');
  if (edCtx) {
    if (effDistChart) effDistChart.destroy();
    effDistChart = new Chart(edCtx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Officers', data: effDist, backgroundColor: colors }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  const idCtx = document.getElementById('intgDistChart')?.getContext('2d');
  if (idCtx) {
    if (intgDistChart) intgDistChart.destroy();
    intgDistChart = new Chart(idCtx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Officers', data: intgDist, backgroundColor: colors }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }
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
    const posts = getPostsForDistrict(dist.district_id);
    const lookup = allDistrictData[dist.district_id]?._lookup || {};
    posts.forEach(post => {
      const r = lookup[post.post_id];
      if (!r || !r.officer_name || r.is_vacant === 'true') return;
      const isNative = r.native_dist === dist.district_id;
      if (isNative) { nativeCount++; nativeByDist[dist.district_name] = (nativeByDist[dist.district_name] || 0) + 1; }
      else nonNativeCount++;
      const nativeName = r.native_dist ? (DISTRICTS_DATA.find(d => d.district_id === r.native_dist)?.district_name || r.native_dist) : '–';
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
