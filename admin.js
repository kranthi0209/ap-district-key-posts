// ============================================================
// ADMIN.JS - Admin Dashboard Logic
// ============================================================

let allDistrictData = {}; // { districtId: [rows] }
let currentAdminDistrict = null;
let districtPosts_admin = {}; // { districtId: [posts] }
let sortCol_admin = null;
let sortDir_admin = 1;
let deAllRows = null; // flat cached rows for data entry page
let stateChart = null, topDistChart = null;
let overallRingChart = null, milestoneChart = null, allDistBarChart = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAdmin();
  if (!user) return;

  document.getElementById('adminCurrentDate').textContent =
    new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  // Populate district dropdowns
  populateDistrictDropdowns();

  // Init range slider fills (show full range on load)
  syncRange('Eff'); syncRange('Intg'); syncRange('Svc');

  // Precompute posts per district
  DISTRICTS_DATA.forEach(d => {
    districtPosts_admin[d.district_id] = getPostsForDistrict(d.district_id);
  });

  // Load all district summaries in parallel
  await refreshAllData();
});

// ============================================================
// NAVIGATION
// ============================================================
async function showAdminSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const titleMap = {
    'sec-overview': 'Admin Dashboard',
    'sec-dataentry': 'Admin Data Entry',
    'sec-viewdata': 'View All Data',
    'sec-analytics': 'Analytics & Insights',
    'sec-retirement': 'Retirement Reports',
    'sec-eiReport': 'E&I Reports',
    'sec-nativeReport': 'Native District Report',
    'sec-adminexport': 'Export Data',
    'sec-admincontact': 'Contact Us'
  };
  document.getElementById('adminHeaderTitle').textContent = titleMap[id] || 'Admin';

  // Highlight nav
  const navItems = document.querySelectorAll('.nav-item');
  const navMap = { 'sec-overview': 0, 'sec-dataentry': 1, 'sec-viewdata': 2, 'sec-analytics': 3, 'sec-retirement': 4, 'sec-eiReport': 5, 'sec-nativeReport': 6, 'sec-adminexport': 7, 'sec-admincontact': 8 };
  navItems.forEach(n => n.classList.remove('active'));
  if (navMap[id] !== undefined) navItems[navMap[id]].classList.add('active');

  // Ensure data is loaded before rendering any data-dependent section
  const needsData = ['sec-analytics','sec-eiReport','sec-retirement','sec-nativeReport','sec-viewdata','sec-dataentry'];
  if (needsData.includes(id)) {
    const allLoaded = DISTRICTS_DATA.every(d => allDistrictData[d.district_id]?._lookup);
    if (!allLoaded) await refreshAllData();
  }

  // Render section-specific content
  if (id === 'sec-dataentry')  initDataEntryPage();
  if (id === 'sec-analytics')  renderAnalytics();
  if (id === 'sec-retirement') renderRetirementReport();
  if (id === 'sec-eiReport')   renderEIReport();
  if (id === 'sec-nativeReport') renderNativeReport();
  if (id === 'sec-viewdata')   filterViewTable(); // data already in allDistrictData
}

// ============================================================
// POPULATE DROPDOWNS
// ============================================================
function populateDistrictDropdowns() {
  const dropdowns = ['deDistrict', 'viewDistrict', 'exportDistrictSelect'];
  dropdowns.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    DISTRICTS_DATA.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.district_id;
      opt.textContent = d.district_name;
      sel.appendChild(opt);
    });
  });

  // Populate department dropdown for data entry filter
  const deptSel = document.getElementById('deDept');
  if (deptSel) {
    const depts = [];
    const seen = new Set();
    POSTS_DATA.forEach(p => {
      if (!seen.has(p.dept_id)) { seen.add(p.dept_id); depts.push({ id: p.dept_id, name: p.department_name }); }
    });
    depts.sort((a, b) => a.name.localeCompare(b.name));
    depts.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id; opt.textContent = d.name;
      deptSel.appendChild(opt);
    });
  }
}

// ============================================================
// REFRESH ALL DATA
// ============================================================

// Helper: apply a raw data map { districtId: [rows] } into allDistrictData
function applyDistrictData(rawMap) {
  Object.entries(rawMap).forEach(([districtId, rows]) => {
    allDistrictData[districtId] = rows;
    const lookup = {};
    rows.forEach(r => { if (r.post_id) lookup[r.post_id] = r; });
    allDistrictData[districtId]._lookup = lookup;
  });
}

async function refreshAllData() {
  // ── 1. Serve from sessionStorage cache if still fresh ─────────
  const cached = getAdminCache();
  if (cached) {
    applyDistrictData(cached);
    deAllRows = null;
    renderOverview();
    return;
  }

  // ── 2. Fetch from Google Sheets – 5 districts at a time ───────
  showLoadingPopup('Loading district data… 0 / ' + DISTRICTS_DATA.length);
  const rawMap = {};
  try {
    const batched = await fetchAllDistrictsBatched((loaded, total) => {
      showLoadingPopup(`Loading district data… ${loaded} / ${total}`);
    }, 5);
    Object.assign(rawMap, batched);
  } catch (e) {
    console.warn('Batched fetch error:', e);
  }

  applyDistrictData(rawMap);
  setAdminCache(rawMap);
  deAllRows = null;
  hideLoadingPopup();
  renderOverview();
}

// ============================================================
// COMPUTE DISTRICT STATS
// ============================================================
function getDistrictStats(districtId) {
  const posts = districtPosts_admin[districtId] || [];
  const data = allDistrictData[districtId] || [];
  const total = posts.length;

  // Build lookup
  const lookup = {};
  data.forEach(row => { if (row.post_id) lookup[row.post_id] = row; });

  let genSaved = 0, eiSaved = 0;
  posts.forEach(post => {
    const r = lookup[post.post_id];
    if (r && (r.general_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) genSaved++;
    if (r && (r.ei_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) eiSaved++;
  });

  return {
    total, genSaved, eiSaved,
    pct: total ? Math.round((genSaved / total) * 100) : 0
  };
}

// ============================================================
// RENDER OVERVIEW
// ============================================================
function renderOverview() {
  let completedDist = 0, inProgressDist = 0, notStartedDist = 0, eiCompleted = 0;
  let totalPosts = 0, totalGenSaved = 0, totalEiSaved = 0;

  DISTRICTS_DATA.forEach(d => {
    const stats = getDistrictStats(d.district_id);
    totalPosts    += stats.total;
    totalGenSaved += stats.genSaved;
    totalEiSaved  += stats.eiSaved;
    if (stats.pct === 100) completedDist++;
    else if (stats.pct > 0) inProgressDist++;
    else notStartedDist++;
    if (stats.eiSaved === stats.total && stats.total > 0) eiCompleted++;
  });

  const overallGenPct = totalPosts ? Math.round((totalGenSaved / totalPosts) * 100) : 0;
  const overallEiPct  = totalPosts ? Math.round((totalEiSaved  / totalPosts) * 100) : 0;

  const el = id => document.getElementById(id);
  el('ov-completedDist').textContent  = completedDist;
  el('ov-inProgressDist').textContent = inProgressDist;
  el('ov-totalRecords').textContent   = totalGenSaved.toLocaleString('en-IN');
  el('ov-eiCompleted').textContent    = eiCompleted;

  if (el('ov-notStartedDist')) el('ov-notStartedDist').textContent = notStartedDist;
  if (el('ov-overallPct'))     el('ov-overallPct').textContent     = overallGenPct + '%';
  if (el('ov-totalPostsM'))    el('ov-totalPostsM').textContent    = totalPosts.toLocaleString('en-IN');
  if (el('ov-genSavedM'))      el('ov-genSavedM').textContent      = totalGenSaved.toLocaleString('en-IN');
  if (el('ov-eiSavedM'))       el('ov-eiSavedM').textContent       = totalEiSaved.toLocaleString('en-IN');
  if (el('ov-eiPctM'))         el('ov-eiPctM').textContent         = overallEiPct + '%';
  if (el('ov-chipCompleted'))  el('ov-chipCompleted').textContent  = completedDist + ' Completed';
  if (el('ov-chipProgress'))   el('ov-chipProgress').textContent   = inProgressDist + ' In Progress';
  if (el('ov-chipNotStarted')) el('ov-chipNotStarted').textContent = notStartedDist + ' Not Started';

  renderDistrictTiles();
  renderDistrictProgressTable();
  renderStateCharts();
}

// ============================================================
// DISTRICT PROGRESS REPORT TABLE
// ============================================================
function renderDistrictProgressTable() {
  const tbody = document.getElementById('districtProgressTableBody');
  if (!tbody) return;

  // Set "As on" date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const asOnEl = document.getElementById('dprAsOnDate');
  if (asOnEl) asOnEl.textContent = `${dateStr}  |  ${timeStr}`;

  const sorted = DISTRICTS_DATA.map(d => {
    const stats = getDistrictStats(d.district_id);
    const total = stats.total;
    const genSaved = stats.genSaved;
    const eiSaved = stats.eiSaved;
    const genPct = total ? Math.round((genSaved / total) * 100) : 0;
    const eiPct = total ? Math.round((eiSaved / total) * 100) : 0;

    let statusLabel, statusClass;
    if (genSaved === 0) {
      statusLabel = 'Not Started';
      statusClass = 'status-not-started';
    } else if (genPct === 100) {
      statusLabel = 'Completed';
      statusClass = 'status-completed';
    } else {
      statusLabel = 'Under Progress';
      statusClass = 'status-in-progress';
    }

    let genStatus;
    if (genSaved === 0) genStatus = 'Not Started';
    else if (genPct === 100) genStatus = 'Completed';
    else genStatus = 'Under Progress';

    let eiStatus;
    if (eiSaved === 0) eiStatus = 'Not Started';
    else if (eiPct === 100) eiStatus = 'Completed';
    else eiStatus = 'Under Progress';

    return { d, total, genSaved, eiSaved, genPct, eiPct, statusLabel, statusClass, genStatus, eiStatus };
  }).sort((a, b) => {
    // Primary: % General Data Saved desc
    if (b.genPct !== a.genPct) return b.genPct - a.genPct;
    // Secondary: % Ratings Data Saved desc
    if (b.eiPct !== a.eiPct) return b.eiPct - a.eiPct;
    // Tiebreaker: No of Posts desc
    return b.total - a.total;
  });

  // Compute totals
  let tPosts = 0, tGenSaved = 0, tEiSaved = 0;
  let tGenCompleted = 0, tGenUnderProgress = 0, tGenNotStarted = 0;
  let tEiCompleted = 0, tEiUnderProgress = 0, tEiNotStarted = 0;
  sorted.forEach(item => {
    tPosts += item.total; tGenSaved += item.genSaved; tEiSaved += item.eiSaved;
    if (item.genStatus === 'Completed') tGenCompleted++;
    else if (item.genStatus === 'Under Progress') tGenUnderProgress++;
    else tGenNotStarted++;
    if (item.eiStatus === 'Completed') tEiCompleted++;
    else if (item.eiStatus === 'Under Progress') tEiUnderProgress++;
    else tEiNotStarted++;
  });
  const tGenPct = tPosts ? Math.round((tGenSaved / tPosts) * 100) : 0;
  const tEiPct  = tPosts ? Math.round((tEiSaved  / tPosts) * 100) : 0;

  function pctBadge(count, pct) {
    const cls = pct >= 80 ? 'pg-hi' : (pct >= 40 ? 'pg-mid' : 'pg-lo');
    return `${count} <span class="pct-badge ${cls}">${pct}%</span>`;
  }

  function statusBadge(status) {
    const cls = status === 'Completed' ? 'status-completed' : (status === 'Under Progress' ? 'status-in-progress' : 'status-not-started');
    return `<span class="dp-status ${cls}">${status}</span>`;
  }

  const dataRows = sorted.map((item, idx) => `
    <tr class="${item.statusClass}">
      <td class="tc">${idx + 1}</td>
      <td class="tl">${item.d.district_name}</td>
      <td class="tc">${item.total}</td>
      <td class="tc">${pctBadge(item.genSaved, item.genPct)}</td>
      <td class="tc">${pctBadge(item.eiSaved, item.eiPct)}</td>
      <td class="tc">${statusBadge(item.genStatus)}</td>
      <td class="tc">${statusBadge(item.eiStatus)}</td>
    </tr>`).join('');

  const totalRow = `
    <tr class="total-row">
      <td class="tc" colspan="2">TOTAL &nbsp;(${sorted.length} Districts)</td>
      <td class="tc">${tPosts}</td>
      <td class="tc">${pctBadge(tGenSaved, tGenPct)}</td>
      <td class="tc">${pctBadge(tEiSaved, tEiPct)}</td>
      <td class="tc">—</td>
      <td class="tc">—</td>
    </tr>`;

  tbody.innerHTML = dataRows + totalRow;
}

// ============================================================
// DOWNLOAD REPORT AS PDF
// ============================================================
function dprFilename() {
  const n = new Date();
  const dd  = String(n.getDate()).padStart(2,'0');
  const mm  = String(n.getMonth()+1).padStart(2,'0');
  const yy  = String(n.getFullYear()).slice(-2);
  const hh  = String(n.getHours()).padStart(2,'0');
  const min = String(n.getMinutes()).padStart(2,'0');
  const ss  = String(n.getSeconds()).padStart(2,'0');
  return `Key_Officers _Data Entry_Status_${dd}-${mm}-${yy} ${hh}-${min}-${ss}`;
}

function downloadProgressReportPDF() {
  const center = document.querySelector('#districtProgressReport .dpr-center');
  if (!center) return;
  const P = '-webkit-print-color-adjust:exact;print-color-adjust:exact';
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${dprFilename()}</title>
<style>
  @page { size: A4 portrait; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #fff; color: #000; }
  .dpr-center { display: block; width: 100%; }
  .dpr-header { background: #0c2461 !important; ${P}; text-align: center; padding: 11pt 14pt 9pt; }
  .dpr-title { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8pt; color: #fff !important; ${P}; }
  .dpr-as-on { font-size: 7pt; color: #a8c8ff !important; ${P}; margin-top: 3pt; }
  table { width: 100%; border-collapse: collapse; }
  thead tr:nth-child(1) th { background: #1a3a8a !important; ${P}; color: #fff !important; border: 1px solid #2d5be3; padding: 4pt 7pt; text-align: center; font-size: 7.5pt; }
  thead tr:nth-child(2) th { background: #2980b9 !important; ${P}; color: #fff !important; border: 1px solid #3a9bd5; padding: 3.5pt 7pt; text-align: center; font-size: 7pt; }
  thead tr:nth-child(3) th { background: #3498db !important; ${P}; color: #fff !important; border: 1px solid #5dade2; padding: 3pt 5pt; text-align: center; font-size: 6.5pt; }
  .fs-tick { color: #16a34a !important; ${P}; font-weight: 700; font-size: 8pt; }
  td { border: 1px solid #c8d4e8; padding: 3.5pt 7pt; font-size: 7pt; text-align: center; }
  td.tl { text-align: left; }
  tr.status-completed   td { background: #f0fdf4 !important; ${P}; }
  tr.status-in-progress td { background: #fffbeb !important; ${P}; }
  tr.status-not-started td { background: #fff1f2 !important; ${P}; }
  tr.status-completed   td:first-child { border-left: 3pt solid #16a34a !important; ${P}; }
  tr.status-in-progress td:first-child { border-left: 3pt solid #d97706 !important; ${P}; }
  tr.status-not-started td:first-child { border-left: 3pt solid #dc2626 !important; ${P}; }
  .dp-status { padding: 1.5pt 6pt; border-radius: 8pt; font-weight: 700; font-size: 6.5pt; }
  .dp-status.status-completed   { background: #16a34a !important; ${P}; color: #fff !important; }
  .dp-status.status-in-progress { background: #d97706 !important; ${P}; color: #fff !important; }
  .dp-status.status-not-started { background: #dc2626 !important; ${P}; color: #fff !important; }
  .pct-badge { font-size: 6pt; font-weight: 600; padding: 0.5pt 3.5pt; border-radius: 6pt; margin-left: 2pt; }
  .pct-badge.pg-hi  { background: #bbf7d0 !important; ${P}; color: #15803d !important; }
  .pct-badge.pg-mid { background: #fde68a !important; ${P}; color: #92400e !important; }
  .pct-badge.pg-lo  { background: #fecaca !important; ${P}; color: #b91c1c !important; }
  tr.total-row td { font-weight: 700; background: #dbeafe !important; ${P}; border-top: 2pt solid #1e3799; color: #1e3799 !important; }
  .dpr-footer { font-size: 6pt; color: #888; padding: 4pt 2pt 0; border-top: 1px solid #e2e8f0; margin-top: 5pt; display: flex; justify-content: space-between; }
</style></head><body>
<div class="dpr-center">${center.innerHTML}</div>
<script>window.onload=function(){window.focus();window.print();};<\/script>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank', 'width=900,height=700');
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

// ============================================================
// DOWNLOAD REPORT AS JPEG
// ============================================================
function downloadProgressReportJPEG() {
  const center = document.querySelector('#districtProgressReport .dpr-center');
  if (!center) return;
  if (typeof html2canvas === 'undefined') { alert('html2canvas not loaded yet, please try again.'); return; }

  // Capture just the inner centered block at high resolution
  html2canvas(center, { scale: 3, backgroundColor: '#ffffff', useCORS: true }).then(reportCanvas => {
    // A4 portrait at 150 dpi: 1240 × 1754 px
    const a4W = 1240, a4H = 1754;
    const margin = 60; // px padding on canvas

    const out = document.createElement('canvas');
    out.width  = a4W;
    out.height = a4H;
    const ctx = out.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, a4W, a4H);

    // Scale report to fill the usable width
    const usableW = a4W - margin * 2;
    const scale   = usableW / reportCanvas.width;
    const drawH   = reportCanvas.height * scale;

    // Center vertically if shorter than A4 height, otherwise top-align
    const yOffset = drawH < (a4H - margin * 2) ? (a4H - drawH) / 2 : margin;

    ctx.drawImage(reportCanvas, margin, yOffset, usableW, drawH);

    const link = document.createElement('a');
    link.download = `${dprFilename()}.jpg`;
    link.href = out.toDataURL('image/jpeg', 0.96);
    link.click();
  });
}

// ============================================================
// DISTRICT TILES
// ============================================================
function renderDistrictTiles() {
  const grid = document.getElementById('districtTilesGrid');
  grid.innerHTML = DISTRICTS_DATA.map(d => {
    const stats = getDistrictStats(d.district_id);
    const pct = stats.pct;
    // Color tier: 0=none, 1=started(1-30), 2=partial(31-79), 3=complete(80-100)
    const tier = pct === 0 ? 0 : (pct < 31 ? 1 : (pct < 80 ? 2 : 3));
    return `
      <div class="district-tile dt-${tier}" onclick="openDistrictEntry('${d.district_id}')">
        <div class="dt-name">${d.district_name}</div>
        <div class="dt-pct">${pct}%</div>
        <div class="dt-sub">${stats.genSaved}/${stats.total} posts</div>
        <div class="mini-bar"><div class="fill" style="width:${pct}%"></div></div>
        <div style="font-size:0.7rem; color:var(--text-muted); margin-top:6px;">E&I: ${stats.eiSaved}/${stats.total}</div>
      </div>
    `;
  }).join('');
}

function openDistrictEntry(districtId) {
  document.getElementById('adminEntryDistrict').value = districtId;
  showAdminSection('sec-dataentry');
  loadAdminEntry();
}

// ============================================================
// STATE CHARTS
// ============================================================
function renderStateCharts() {
  const stats = DISTRICTS_DATA.map(d => ({ name: d.district_name, ...getDistrictStats(d.district_id) }));
  const completed  = stats.filter(s => s.pct === 100).length;
  const partial    = stats.filter(s => s.pct > 0 && s.pct < 100).length;
  const notStarted = stats.filter(s => s.pct === 0).length;
  const totalPosts = stats.reduce((a, s) => a + s.total, 0);
  const totalGen   = stats.reduce((a, s) => a + s.genSaved, 0);
  const overallPct = totalPosts ? Math.round((totalGen / totalPosts) * 100) : 0;

  // ── 1. Overall ring (hero banner) ──────────────────────────
  const rCtx = document.getElementById('overallRingChart')?.getContext('2d');
  if (rCtx) {
    if (overallRingChart) overallRingChart.destroy();
    overallRingChart = new Chart(rCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [overallPct, 100 - overallPct],
          backgroundColor: ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.14)'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '74%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { duration: 1400, easing: 'easeOutQuart' }
      }
    });
  }

  // ── 2. State Completion Doughnut ───────────────────────────
  const sCtx = document.getElementById('stateChart')?.getContext('2d');
  if (sCtx) {
    if (stateChart) stateChart.destroy();
    stateChart = new Chart(sCtx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [completed, partial, notStarted],
          backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
          borderWidth: 4, borderColor: '#fff',
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { size: 11 }, boxWidth: 12 } },
          tooltip: { callbacks: { label: ctx => `  ${ctx.label}: ${ctx.raw} districts` } }
        },
        animation: { duration: 1200, easing: 'easeOutBounce' }
      }
    });
  }

  // ── 3. All Districts – grouped horizontal bar ──────────────
  const allByPct = [...stats].sort((a, b) => b.pct - a.pct);
  const tCtx = document.getElementById('topDistChart')?.getContext('2d');
  if (tCtx) {
    if (topDistChart) topDistChart.destroy();
    topDistChart = new Chart(tCtx, {
      type: 'bar',
      data: {
        labels: allByPct.map(s => s.name),
        datasets: [
          {
            label: 'General Data %',
            data: allByPct.map(s => s.pct),
            backgroundColor: allByPct.map(s => s.pct >= 80 ? 'rgba(39,174,96,0.85)' : s.pct >= 50 ? 'rgba(243,156,18,0.85)' : 'rgba(231,76,60,0.85)'),
            borderRadius: 4, borderSkipped: false
          },
          {
            label: 'Ratings Data %',
            data: allByPct.map(s => s.total ? Math.round((s.eiSaved / s.total) * 100) : 0),
            backgroundColor: 'rgba(22,160,133,0.5)',
            borderRadius: 4, borderSkipped: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 10 } } },
          y: { ticks: { font: { size: 10 } } }
        },
        plugins: { legend: { position: 'top', labels: { font: { size: 10 }, boxWidth: 12 } } }
      }
    });
  }

  // ── 4. Milestone Breakdown Bar ─────────────────────────────
  const buckets = [
    { label: '100%',   count: stats.filter(s => s.pct === 100).length,              color: '#16a34a' },
    { label: '75–99%', count: stats.filter(s => s.pct >= 75 && s.pct < 100).length, color: '#22c55e' },
    { label: '50–74%', count: stats.filter(s => s.pct >= 50 && s.pct < 75).length,  color: '#f59e0b' },
    { label: '25–49%', count: stats.filter(s => s.pct >= 25 && s.pct < 50).length,  color: '#f97316' },
    { label: '1–24%',  count: stats.filter(s => s.pct > 0  && s.pct < 25).length,   color: '#ef4444' },
    { label: '0%',     count: stats.filter(s => s.pct === 0).length,                color: '#b91c1c' }
  ];
  const mCtx = document.getElementById('milestoneChart')?.getContext('2d');
  if (mCtx) {
    if (milestoneChart) milestoneChart.destroy();
    milestoneChart = new Chart(mCtx, {
      type: 'bar',
      data: {
        labels: buckets.map(b => b.label),
        datasets: [{
          label: 'Districts',
          data: buckets.map(b => b.count),
          backgroundColor: buckets.map(b => b.color),
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `  ${ctx.raw} district${ctx.raw !== 1 ? 's' : ''}` } }
        },
        animation: { duration: 1200, easing: 'easeOutQuart' }
      }
    });
  }

  // ── 5. All 28 Districts Horizontal Bar ─────────────────────
  const allSorted = [...stats].sort((a, b) => b.pct - a.pct);
  const aCtx = document.getElementById('allDistBarChart')?.getContext('2d');
  if (aCtx) {
    if (allDistBarChart) allDistBarChart.destroy();
    allDistBarChart = new Chart(aCtx, {
      type: 'bar',
      data: {
        labels: allSorted.map(s => s.name),
        datasets: [
          {
            label: 'General Data %',
            data: allSorted.map(s => s.pct),
            backgroundColor: 'rgba(44,90,160,0.82)',
            borderRadius: 4, borderSkipped: false
          },
          {
            label: 'Ratings Data %',
            data: allSorted.map(s => s.total ? Math.round((s.eiSaved / s.total) * 100) : 0),
            backgroundColor: 'rgba(22,160,133,0.75)',
            borderRadius: 4, borderSkipped: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 10 } } },
          y: { ticks: { font: { size: 11 } } }
        },
        plugins: {
          legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 14 } },
          tooltip: { callbacks: { label: ctx => `  ${ctx.dataset.label}: ${ctx.raw}%` } }
        },
        animation: { duration: 1400, easing: 'easeOutQuart' }
      }
    });
  }
}

// ============================================================
// ADMIN DATA ENTRY – REVAMPED
// ============================================================

async function initDataEntryPage(forceReload = false) {
  if (forceReload) {
    clearAdminCache();
    allDistrictData = {};
    deAllRows = null;
  }

  // If data isn't loaded yet (first visit or after force reload), fetch it
  const allLoaded = DISTRICTS_DATA.every(d => allDistrictData[d.district_id]?._lookup);
  if (!allLoaded) {
    await refreshAllData();
    // refreshAllData already calls renderOverview and sets allDistrictData
  }

  deAllRows = buildDeRows();
  applyDataEntryFilters();
}

function buildDeRows() {
  const rows = [];
  DISTRICTS_DATA.forEach(dist => {
    const posts  = getPostsForDistrict(dist.district_id);
    const lookup = allDistrictData[dist.district_id]?._lookup || {};
    const userId = CREDENTIALS_DATA.find(c => c.district_id === dist.district_id)?.user_id || '';
    posts.forEach(post => {
      const saved      = lookup[post.post_id] || {};
      const isVacant   = saved.is_vacant === 'true';
      const isNoPost   = saved.is_no_post === 'true';
      const isGenSaved = saved.general_saved === 'true';
      const isEISaved  = saved.ei_saved === 'true' || isVacant || isNoPost;
      const postStatus   = isVacant ? 'vacant' : isNoPost ? 'nopost' : 'active';
      const entryStatus  = (isGenSaved && isEISaved) ? 'complete' : isGenSaved ? 'partial' : 'pending';
      const svcYears     = serviceYears(saved.from_date);
      rows.push({ dist, post, saved, userId, isVacant, isNoPost, isGenSaved, isEISaved, postStatus, entryStatus, svcYears });
    });
  });
  return rows;
}

function applyDataEntryFilters() {
  if (!deAllRows) return;

  const distF      = document.getElementById('deDistrict')?.value || '';
  const deptF      = document.getElementById('deDept')?.value || '';
  const postQ      = (document.getElementById('dePostSearch')?.value || '').toLowerCase().trim();
  const officerQ   = (document.getElementById('deOfficerSearch')?.value || '').toLowerCase().trim();
  const regfacF    = document.getElementById('deRegFac')?.value || '';
  const postStatusF  = document.querySelector('#dePostStatusGroup .de-tog.active')?.dataset.val || '';
  const entryStatusF = document.querySelector('#deEntryStatusGroup .de-tog.active')?.dataset.val || '';
  const effMin = parseInt(document.getElementById('deEffMin')?.value || 1);
  const effMax = parseInt(document.getElementById('deEffMax')?.value || 10);
  const intgMin = parseInt(document.getElementById('deIntgMin')?.value || 1);
  const intgMax = parseInt(document.getElementById('deIntgMax')?.value || 10);
  const svcMin = parseInt(document.getElementById('deSvcMin')?.value || 0);
  const svcMax = parseInt(document.getElementById('deSvcMax')?.value || 30);
  const effActive  = effMin > 1 || effMax < 10;
  const intgActive = intgMin > 1 || intgMax < 10;
  const svcActive  = svcMin > 0 || svcMax < 30;

  const filtered = deAllRows.filter(r => {
    if (distF   && r.dist.district_id !== distF)   return false;
    if (deptF   && r.post.dept_id     !== deptF)   return false;
    if (postQ   && !r.post.post_name.toLowerCase().includes(postQ))             return false;
    if (officerQ && !(r.saved.officer_name || '').toLowerCase().includes(officerQ)) return false;
    if (regfacF && r.saved.reg_fac !== regfacF)    return false;
    if (postStatusF === 'active'  && r.postStatus !== 'active')  return false;
    if (postStatusF === 'vacant'  && !r.isVacant)                return false;
    if (postStatusF === 'nopost'  && !r.isNoPost)                return false;
    if (entryStatusF && r.entryStatus !== entryStatusF)          return false;
    if (effActive) {
      const v = parseFloat(r.saved.efficiency);
      if (isNaN(v) || v < effMin || v > effMax) return false;
    }
    if (intgActive) {
      const v = parseFloat(r.saved.integrity);
      if (isNaN(v) || v < intgMin || v > intgMax) return false;
    }
    if (svcActive) {
      if (r.svcYears === null) return false;
      // svcMax === 30 means "30+ years" — treat as open-ended ceiling
      if (r.svcYears < svcMin) return false;
      if (svcMax < 30 && r.svcYears > svcMax + 1) return false;
    }
    return true;
  });

  const total      = deAllRows.length;
  const complete   = filtered.filter(r => r.entryStatus === 'complete').length;
  const partial    = filtered.filter(r => r.entryStatus === 'partial').length;
  const pending    = filtered.filter(r => r.entryStatus === 'pending').length;
  const vacnopost  = filtered.filter(r => r.isVacant || r.isNoPost).length;

  document.getElementById('deStat-total').textContent    = total;
  document.getElementById('deStat-showing').textContent  = filtered.length;
  document.getElementById('deStat-complete').textContent = complete;
  document.getElementById('deStat-partial').textContent  = partial;
  document.getElementById('deStat-pending').textContent  = pending;
  document.getElementById('deStat-vacnopost').textContent= vacnopost;
  document.getElementById('deTableCount').textContent    = `Showing ${filtered.length} of ${total} posts`;

  renderDataEntryTable(filtered);
}

function sortAdminTable(col) {
  if (sortCol_admin === col) {
    sortDir_admin *= -1;
  } else {
    sortCol_admin = col;
    sortDir_admin = 1;
  }
  applyDataEntryFilters();
}

function getAdminSortValue(r, col) {
  switch (col) {
    case 'dist':    return (r.dist.district_name || '').toLowerCase();
    case 'dept':    return (r.post.department_name || '').toLowerCase();
    case 'post':    return (r.post.post_name || '').toLowerCase();
    case 'name':    return (r.saved.officer_name || '').toLowerCase();
    case 'cfms':    return r.saved.cfms_id || '';
    case 'contact': return r.saved.contact_no || '';
    case 'from_date': return r.saved.from_date || '';
    case 'svc':     return r.svcYears !== null ? r.svcYears : -1;
    case 'native':  return r.saved.native_dist || '';
    case 'regfac':  return r.saved.reg_fac || '';
    case 'eff':     return parseFloat(r.saved.efficiency) || -1;
    case 'intg':    return parseFloat(r.saved.integrity) || -1;
    case 'pstatus': return r.isVacant ? 1 : r.isNoPost ? 2 : 0;
    case 'estatus': {
      if (r.isGenSaved && r.isEISaved) return 0;
      if (r.isGenSaved) return 1;
      if (r.isVacant || r.isNoPost) return 2;
      return 3;
    }
    default: return '';
  }
}

function renderDataEntryTable(rows) {
  const tbody = document.getElementById('deMainTableBody');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="16" style="text-align:center;padding:40px;color:var(--text-muted);">No records match the selected filters</td></tr>';
    return;
  }

  // Sort rows
  let sorted = [...rows];
  if (sortCol_admin) {
    sorted.sort((a, b) => {
      const va = getAdminSortValue(a, sortCol_admin);
      const vb = getAdminSortValue(b, sortCol_admin);
      if (va < vb) return -sortDir_admin;
      if (va > vb) return sortDir_admin;
      return 0;
    });
  }

  // Update sort indicators
  document.querySelectorAll('[id^="asort-"]').forEach(el => { el.textContent = ''; el.className = 'sort-ind'; });
  if (sortCol_admin) {
    const ind = document.getElementById(`asort-${sortCol_admin}`);
    if (ind) { ind.textContent = sortDir_admin === 1 ? '▲' : '▼'; ind.className = 'sort-ind active'; }
  }

  tbody.innerHTML = sorted.map(({ dist, post, saved, userId, isVacant, isNoPost, isGenSaved, isEISaved, postStatus, entryStatus, svcYears }, idx) => {
    const nativeName = saved.native_dist
      ? (saved.native_dist === 'OTHER_STATE' ? 'Other State' : (DISTRICTS_DATA.find(d => d.district_id === saved.native_dist)?.district_name || saved.native_dist))
      : '–';

    const effBadge  = saved.efficiency ? `<span class="score-badge ${scoreClass(saved.efficiency)}">${saved.efficiency}</span>` : '<span class="text-muted">–</span>';
    const intgBadge = saved.integrity  ? `<span class="score-badge ${scoreClass(saved.integrity)}">${saved.integrity}</span>` : '<span class="text-muted">–</span>';

    const postStatusBadge = isVacant
      ? '<span class="row-status-badge badge-vacant">⭕ Vacant</span>'
      : isNoPost
      ? '<span class="row-status-badge badge-nopost">🚫 No Post</span>'
      : '<span class="row-status-badge badge-active">👤 Active</span>';

    const entryStatusBadge = (isGenSaved && isEISaved)
      ? '<span class="row-status-badge badge-full">✅ Complete</span>'
      : isGenSaved
      ? '<span class="row-status-badge badge-partial">⏳ Gen Only</span>'
      : (isVacant || isNoPost)
      ? '<span class="row-status-badge badge-full">✅ N/A</span>'
      : '<span class="row-status-badge badge-pending">📝 Not Started</span>';

    const regfacBadge = saved.reg_fac
      ? `<span class="regfac-badge regfac-${saved.reg_fac.toLowerCase()}">${saved.reg_fac}</span>` : '–';

    const rowCls = isVacant ? 'de-row-vacant' : isNoPost ? 'de-row-nopost' : entryStatus === 'complete' ? 'de-row-complete' : '';

    return `
      <tr class="${rowCls}">
        <td class="tc de-sl">${idx + 1}</td>
        <td><span class="chip chip-district">${dist.district_name}</span></td>
        <td><span class="chip">${post.department_name}</span></td>
        <td class="de-post-name">${post.post_name}</td>
        <td class="de-officer">${saved.officer_name || (isVacant ? '<em class="text-muted">Vacant</em>' : isNoPost ? '<em class="text-muted">No Post</em>' : '<span class="text-muted">–</span>')}</td>
        <td class="tc de-mono">${saved.cfms_id || '–'}</td>
        <td class="tc de-mono">${saved.contact_no || '–'}</td>
        <td class="tc">${fmtDate(saved.from_date)}</td>
        <td class="tc">${svcYears !== null ? `<span class="svc-badge ${svcClass(svcYears)}">${fmtService(saved.from_date)}</span>` : '–'}</td>
        <td>${nativeName !== '–' ? `<span class="native-badge">${nativeName}</span>` : '–'}</td>
        <td class="tc">${regfacBadge}</td>
        <td class="tc">${effBadge}</td>
        <td class="tc">${intgBadge}</td>
        <td class="tc">${postStatusBadge}</td>
        <td class="tc">${entryStatusBadge}</td>
        <td class="tc"><button class="btn btn-xs btn-warning" onclick="adminEditRow('${dist.district_id}','${userId}','${post.post_id}')">✏️ Edit</button></td>
      </tr>`;
  }).join('');
}

// Format date as "Jan 03 2026"
function fmtDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          .replace(/ /g, ' '); // "03 Jan 2026" → keep as-is
}

// Length of service in years (decimal) from a date string to today
function serviceYears(dateStr) {
  if (!dateStr) return null;
  const from = new Date(dateStr);
  if (isNaN(from)) return null;
  return (Date.now() - from.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

// Format service duration as "2 Yrs 4 Mos"
function fmtService(dateStr) {
  if (!dateStr) return '–';
  const from = new Date(dateStr);
  if (isNaN(from)) return '–';
  const now = new Date();
  let years  = now.getFullYear() - from.getFullYear();
  let months = now.getMonth()    - from.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years < 0)  return '–';
  const yPart = years  ? `${years} Yr${years  !== 1 ? 's' : ''}` : '';
  const mPart = months ? `${months} Mo${months !== 1 ? 's' : ''}` : '';
  return (yPart + (yPart && mPart ? ' ' : '') + mPart) || '< 1 Mo';
}

function scoreClass(val) {
  const v = parseFloat(val);
  if (isNaN(v)) return 'score-na';
  if (v >= 8)   return 'score-high';
  if (v >= 6)   return 'score-good';
  if (v >= 4)   return 'score-mid';
  return 'score-low';
}

function svcClass(yrs) {
  if (yrs >= 5)  return 'svc-long';
  if (yrs >= 2)  return 'svc-mid';
  if (yrs >= 1)  return 'svc-short';
  return 'svc-new';
}

function setDeTog(groupId, el) {
  document.querySelectorAll(`#${groupId} .de-tog`).forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  applyDataEntryFilters();
}

function syncRange(type) {
  const minEl = document.getElementById(`de${type}Min`);
  const maxEl = document.getElementById(`de${type}Max`);
  if (!minEl || !maxEl) return;
  let minVal = parseInt(minEl.value);
  let maxVal = parseInt(maxEl.value);
  if (minVal > maxVal) {
    if (document.activeElement === minEl) { minEl.value = maxVal; minVal = maxVal; }
    else { maxEl.value = minVal; maxVal = minVal; }
  }
  const rangeMin = parseInt(minEl.min);
  const rangeMax = parseInt(minEl.max);
  const span = rangeMax - rangeMin || 1;
  const fill = document.getElementById(`de${type}Fill`);
  const lbl  = document.getElementById(`de${type}RangeLbl`);
  if (fill) {
    const pMin = ((minVal - rangeMin) / span) * 100;
    const pMax = ((maxVal - rangeMin) / span) * 100;
    fill.style.left  = pMin + '%';
    fill.style.width = (pMax - pMin) + '%';
  }
  if (lbl) {
    const maxLabel = (type === 'Svc' && maxVal >= rangeMax) ? maxVal + '+' : maxVal;
    lbl.textContent = minVal + ' – ' + maxLabel;
  }
}

function resetDataEntryFilters() {
  document.getElementById('deDistrict').value     = '';
  document.getElementById('deDept').value         = '';
  document.getElementById('dePostSearch').value   = '';
  document.getElementById('deOfficerSearch').value= '';
  document.getElementById('deRegFac').value       = '';
  ['dePostStatusGroup', 'deEntryStatusGroup'].forEach(id => {
    const btns = document.querySelectorAll(`#${id} .de-tog`);
    btns.forEach(b => b.classList.remove('active'));
    btns[0]?.classList.add('active');
  });
  ['deEffMin', 'deEffMax', 'deIntgMin', 'deIntgMax'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id.includes('Min') ? 1 : 10;
  });
  const svcMinEl = document.getElementById('deSvcMin');
  const svcMaxEl = document.getElementById('deSvcMax');
  if (svcMinEl) svcMinEl.value = 0;
  if (svcMaxEl) svcMaxEl.value = 30;
  syncRange('Eff'); syncRange('Intg'); syncRange('Svc');
  applyDataEntryFilters();
}

// Admin Edit Row – opens inline edit modal
function adminEditRow(districtId, userId, postId) {
  const posts = getPostsForDistrict(districtId);
  const post = posts.find(p => p.post_id === postId);
  const existing = allDistrictData[districtId]?._lookup?.[postId] || {};

  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.id = 'adminEditModal';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:600px; width:95%;">
      <h3>✏️ Edit – ${post?.post_name}</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">${post?.department_name} | ${DISTRICTS_DATA.find(d=>d.district_id===districtId)?.district_name}</p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Officer Name</label>
          <input type="text" class="form-control" id="ae-name" value="${existing.officer_name || ''}" />
        </div>
        <div class="form-group">
          <label>CFMS ID (8 digits)</label>
          <input type="text" class="form-control" id="ae-cfms" value="${existing.cfms_id || ''}" maxlength="8" />
        </div>
        <div class="form-group">
          <label>Contact No (10 digits)</label>
          <input type="text" class="form-control" id="ae-contact" value="${existing.contact_no || ''}" maxlength="10" />
        </div>
        <div class="form-group">
          <label>Working From Date</label>
          <input type="date" class="form-control" id="ae-from" value="${existing.from_date || ''}" />
        </div>
        <div class="form-group">
          <label>Native District</label>
          <select class="form-control" id="ae-native">
            <option value="">Select...</option>
            ${DISTRICTS_DATA.map(d=>`<option value="${d.district_id}" ${existing.native_dist===d.district_id?'selected':''}>${d.district_name}</option>`).join('')}
            <option value="OTHER_STATE" ${existing.native_dist==='OTHER_STATE'?'selected':''}>Other State</option>
          </select>
        </div>
        <div class="form-group">
          <label>Regular / FAC</label>
          <select class="form-control" id="ae-regfac">
            <option value="">Select...</option>
            <option value="Regular" ${existing.reg_fac==='Regular'?'selected':''}>Regular</option>
            <option value="FAC" ${existing.reg_fac==='FAC'?'selected':''}>FAC</option>
          </select>
        </div>
        <div class="form-group">
          <label>Efficiency (1-10)</label>
          <input type="number" class="form-control" id="ae-eff" min="1" max="10" value="${existing.efficiency || ''}" />
        </div>
        <div class="form-group">
          <label>Integrity (1-10)</label>
          <input type="number" class="form-control" id="ae-intg" min="1" max="10" value="${existing.integrity || ''}" />
        </div>
      </div>

      <div style="display:flex; gap:12px; margin-bottom:12px;">
        <label class="flag-check">
          <input type="checkbox" id="ae-vacant" ${existing.is_vacant==='true'?'checked':''} onchange="document.getElementById('ae-nopost').checked=false"> Vacant
        </label>
        <label class="flag-check">
          <input type="checkbox" id="ae-nopost" ${existing.is_no_post==='true'?'checked':''} onchange="document.getElementById('ae-vacant').checked=false"> No Such Post
        </label>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('adminEditModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="adminSaveRow('${districtId}','${userId}','${postId}','${post?.department_name}','${post?.post_name}','${post?.dept_id}')">💾 Save Changes</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function adminSaveRow(districtId, userId, postId, deptName, postName, deptId) {
  const name = document.getElementById('ae-name')?.value.trim();
  const cfms = document.getElementById('ae-cfms')?.value.trim();
  const contact = document.getElementById('ae-contact')?.value.trim();
  const fromDate = document.getElementById('ae-from')?.value;
  const native = document.getElementById('ae-native')?.value;
  const regfac = document.getElementById('ae-regfac')?.value;
  const eff = document.getElementById('ae-eff')?.value;
  const intg = document.getElementById('ae-intg')?.value;
  const isVacant = document.getElementById('ae-vacant')?.checked;
  const isNoPost = document.getElementById('ae-nopost')?.checked;

  // Validate
  if (!isVacant && !isNoPost) {
    if (name && !validateName(name)) { showToast('Officer name should only contain letters', 'error'); return; }
    if (cfms && !validateCFMSID(cfms)) { showToast('CFMS ID must be 8 numeric digits', 'error'); return; }
    if (contact && !validateContact(contact)) { showToast('Contact No must be 10 numeric digits', 'error'); return; }
    if (eff && (isNaN(eff) || eff < 1 || eff > 10)) { showToast('Efficiency must be 1-10', 'error'); return; }
    if (intg && (isNaN(intg) || intg < 1 || intg > 10)) { showToast('Integrity must be 1-10', 'error'); return; }
  }

  const payload = {
    post_id: postId,
    district_id: districtId,
    district_name: DISTRICTS_DATA.find(d => d.district_id === districtId)?.district_name || '',
    dept_id: deptId,
    department_name: deptName,
    post_name: postName,
    officer_name: isVacant || isNoPost ? '' : name,
    cfms_id: isVacant || isNoPost ? '' : cfms,
    contact_no: isVacant || isNoPost ? '' : contact,
    from_date: isVacant || isNoPost ? '' : fromDate,
    native_dist: isVacant || isNoPost ? '' : native,
    reg_fac: isVacant || isNoPost ? '' : regfac,
    efficiency: eff || '',
    integrity: intg || '',
    is_vacant: isVacant ? 'true' : 'false',
    is_no_post: isNoPost ? 'true' : 'false',
    general_saved: (isVacant || isNoPost || (name && cfms && contact && fromDate && native && regfac)) ? 'true' : 'false',
    ei_saved: (isVacant || isNoPost || (eff && intg)) ? 'true' : 'false',
    saved_at: new Date().toISOString(),
    saved_by: 'ADMIN'
  };

  showLoadingPopup('Saving...');
  try {
    await saveRowToSheet(userId, payload);
    if (!allDistrictData[districtId]) allDistrictData[districtId] = [];
    if (!allDistrictData[districtId]._lookup) allDistrictData[districtId]._lookup = {};
    allDistrictData[districtId]._lookup[postId] = payload;
    showToast('Data saved successfully!', 'success');
    document.getElementById('adminEditModal')?.remove();
    // Update the in-memory deAllRows cache so the table reflects the change immediately
    if (deAllRows) {
      const idx = deAllRows.findIndex(r => r.dist.district_id === districtId && r.post.post_id === postId);
      if (idx !== -1) {
        const r = deAllRows[idx];
        r.saved      = payload;
        r.isVacant   = payload.is_vacant === 'true';
        r.isNoPost   = payload.is_no_post === 'true';
        r.isGenSaved = payload.general_saved === 'true';
        r.isEISaved  = payload.ei_saved === 'true' || r.isVacant || r.isNoPost;
        r.postStatus  = r.isVacant ? 'vacant' : r.isNoPost ? 'nopost' : 'active';
        r.entryStatus = (r.isGenSaved && r.isEISaved) ? 'complete' : r.isGenSaved ? 'partial' : 'pending';
      }
    }
    applyDataEntryFilters();
  } catch (e) {
    showToast('Error saving data', 'error');
  }
  hideLoadingPopup();
}

// ============================================================
// VIEW DATA TABLE
// ============================================================
function loadViewData() {
  // Data is already in allDistrictData (loaded by refreshAllData on login)
  filterViewTable();
}

function filterViewTable() {
  const districtId = document.getElementById('viewDistrict')?.value;
  const search = document.getElementById('viewSearch')?.value.toLowerCase();
  const tbody = document.getElementById('viewDataBody');
  if (!tbody) return;

  let rows = [];
  const districts = districtId ? [DISTRICTS_DATA.find(d => d.district_id === districtId)] : DISTRICTS_DATA;

  districts.forEach(dist => {
    const posts = getPostsForDistrict(dist.district_id);
    const lookup = allDistrictData[dist.district_id]?._lookup || {};
    posts.forEach(post => {
      const r = lookup[post.post_id] || {};
      if (search && !(r.officer_name || '').toLowerCase().includes(search)) return;
      rows.push({ dist, post, r });
    });
  });

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:30px;color:var(--text-muted)">No records found</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(({ dist, post, r }) => {
    const nativeName = r.native_dist ? (r.native_dist === 'OTHER_STATE' ? 'Other State' : (DISTRICTS_DATA.find(d => d.district_id === r.native_dist)?.district_name || r.native_dist)) : '–';
    const status = r.is_vacant === 'true' ? '<span class="row-status-badge badge-vacant">⭕ Vacant</span>' :
      r.is_no_post === 'true' ? '<span class="row-status-badge badge-nopost">🚫 No Post</span>' :
      (r.ei_saved === 'true' && r.general_saved === 'true') ? '<span class="row-status-badge badge-full">✅ Full</span>' :
      r.general_saved === 'true' ? '<span class="row-status-badge badge-partial">⏳ E&I</span>' :
      '<span class="row-status-badge badge-pending">📝 Pending</span>';
    return `
      <tr>
        <td>${dist.district_name}</td>
        <td>${post.department_name}</td>
        <td>${post.post_name}</td>
        <td>${r.officer_name || (r.is_vacant === 'true' ? '<em>Vacant</em>' : r.is_no_post === 'true' ? '<em>No Post</em>' : '–')}</td>
        <td>${r.cfms_id || '–'}</td>
        <td>${r.contact_no || '–'}</td>
        <td>${r.from_date || '–'}</td>
        <td>${nativeName}</td>
        <td>${r.reg_fac || '–'}</td>
        <td>${r.efficiency || '–'}</td>
        <td>${r.integrity || '–'}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('');
}

// ============================================================
// EXPORT (ADMIN)
// ============================================================
function getAllRows() {
  const rows = [];
  DISTRICTS_DATA.forEach(dist => {
    const posts = getPostsForDistrict(dist.district_id);
    const lookup = allDistrictData[dist.district_id]?._lookup || {};
    posts.forEach((post, idx) => {
      rows.push({ sl_no: idx + 1, district: dist.district_name, ...post, ...(lookup[post.post_id] || {}) });
    });
  });
  return rows;
}

function adminExportJSON() {
  const blob = new Blob([JSON.stringify(getAllRows(), null, 2)], { type: 'application/json' });
  adminDownload(blob, 'AP_Officers_All_Districts.json');
  showToast('JSON exported!', 'success');
}

function adminExportCSV() {
  const rows = getAllRows();
  const headers = ['district', 'department_name', 'post_name', 'officer_name', 'cfms_id', 'contact_no', 'from_date', 'native_dist', 'reg_fac', 'efficiency', 'integrity', 'is_vacant', 'is_no_post'];
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h] || ''}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  adminDownload(blob, 'AP_Officers_All_Districts.csv');
  showToast('CSV exported!', 'success');
}

function exportDistrictJSON() {
  const districtId = document.getElementById('exportDistrictSelect').value;
  if (!districtId) { showToast('Please select a district', 'warning'); return; }
  const dist = DISTRICTS_DATA.find(d => d.district_id === districtId);
  const posts = getPostsForDistrict(districtId);
  const lookup = allDistrictData[districtId]?._lookup || {};
  const rows = posts.map(p => ({ ...p, ...(lookup[p.post_id] || {}) }));
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  adminDownload(blob, `${dist.district_name}_Officers.json`);
  showToast('District JSON exported!', 'success');
}

function exportDistrictCSV() {
  const districtId = document.getElementById('exportDistrictSelect').value;
  if (!districtId) { showToast('Please select a district', 'warning'); return; }
  const dist = DISTRICTS_DATA.find(d => d.district_id === districtId);
  const posts = getPostsForDistrict(districtId);
  const lookup = allDistrictData[districtId]?._lookup || {};
  const headers = ['department_name', 'post_name', 'officer_name', 'cfms_id', 'contact_no', 'from_date', 'native_dist', 'reg_fac', 'efficiency', 'integrity'];
  const csv = [headers.join(','), ...posts.map(p => {
    const r = lookup[p.post_id] || {};
    return headers.map(h => `"${r[h] || p[h] || ''}"`).join(',');
  })].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  adminDownload(blob, `${dist.district_name}_Officers.csv`);
  showToast('District CSV exported!', 'success');
}

function adminDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}

// ============================================================
// RETIREMENT REPORT
// ============================================================
function renderRetirementReport() {
  const tbody = document.getElementById('retirementBody');
  if (!tbody) return;
  const currentYear = new Date().getFullYear();
  const rows = [];

  DISTRICTS_DATA.forEach(dist => {
    const posts   = getPostsForDistrict(dist.district_id);
    const rawData = allDistrictData[dist.district_id] || [];
    const lookup  = allDistrictData[dist.district_id]?._lookup
      || rawData.reduce((acc, row) => { if (row.post_id) acc[row.post_id] = row; return acc; }, {});
    posts.forEach(post => {
      const r = lookup[post.post_id];
      if (!r || !r.officer_name || r.is_vacant === 'true') return;

      // Estimate DOB from from_date + assuming officer age ~40-55 when posted
      // Without DOB we'll show placeholder; real DOB should be added to form in future
      const fromDateYear = r.from_date ? new Date(r.from_date).getFullYear() : null;
      let estRetireYear = null, retireBadge = '';

      // If we had DOB, we'd compute properly. Here we show "Data unavailable" or use a heuristic
      estRetireYear = fromDateYear ? fromDateYear + 20 : null;  // placeholder

      if (estRetireYear) {
        const yearsLeft = estRetireYear - currentYear;
        if (yearsLeft <= 0) retireBadge = '<span class="retire-badge retire-this">Retiring This Year</span>';
        else if (yearsLeft <= 2) retireBadge = `<span class="retire-badge retire-2yr">Within 2 Years</span>`;
        else if (yearsLeft <= 5) retireBadge = `<span class="retire-badge retire-5yr">Within 5 Years</span>`;
        else retireBadge = '<span class="retire-badge retire-safe">Safe (5+ Years)</span>';
      } else {
        retireBadge = '<span style="color:var(--text-muted);font-size:0.78rem;">DOB not available</span>';
      }

      rows.push({ dist, post, r, estRetireYear, retireBadge });
    });
  });

  tbody.innerHTML = rows.map(({ dist, post, r, retireBadge }) => `
    <tr>
      <td>${dist.district_name}</td>
      <td>${post.department_name}</td>
      <td>${post.post_name}</td>
      <td>${r.officer_name}</td>
      <td>${r.cfms_id || '–'}</td>
      <td>${r.contact_no || '–'}</td>
      <td>${r.from_date || '–'}</td>
      <td style="color:var(--text-muted); font-size:0.78rem;">Pending DOB field</td>
      <td>${retireBadge}</td>
    </tr>
  `).join('') || '<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--text-muted)">No data available</td></tr>';
}
