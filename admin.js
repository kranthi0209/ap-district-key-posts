// ============================================================
// ADMIN.JS - Admin Dashboard Logic
// ============================================================

let allDistrictData = {}; // { districtId: [rows] }
let currentAdminDistrict = null;
let districtPosts_admin = {}; // { districtId: [posts] }
let stateChart = null, topDistChart = null;

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
function showAdminSection(id) {
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

  // Render section-specific content
  if (id === 'sec-analytics') renderAnalytics();
  if (id === 'sec-retirement') renderRetirementReport();
  if (id === 'sec-eiReport') renderEIReport();
  if (id === 'sec-nativeReport') renderNativeReport();
  if (id === 'sec-viewdata') loadViewData();

  // Highlight nav
  const navItems = document.querySelectorAll('.nav-item');
  const navMap = { 'sec-overview': 0, 'sec-dataentry': 1, 'sec-viewdata': 2, 'sec-analytics': 3, 'sec-retirement': 4, 'sec-eiReport': 5, 'sec-nativeReport': 6, 'sec-adminexport': 7, 'sec-admincontact': 8 };
  navItems.forEach(n => n.classList.remove('active'));
  if (navMap[id] !== undefined) navItems[navMap[id]].classList.add('active');
}

// ============================================================
// POPULATE DROPDOWNS
// ============================================================
function populateDistrictDropdowns() {
  const dropdowns = ['adminEntryDistrict', 'viewDistrict', 'exportDistrictSelect'];
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
}

// ============================================================
// REFRESH ALL DATA (Parallel)
// ============================================================
async function refreshAllData() {
  showLoadingPopup('Loading all district data in parallel...');

  // Try to get summary first (faster)
  let useSummary = false;
  try {
    const summaryResp = await getAllDistrictsSummary();
    if (summaryResp && summaryResp.summaries) {
      processSummary(summaryResp.summaries);
      useSummary = true;
    }
  } catch (e) { /* fall through to parallel fetch */ }

  if (!useSummary) {
    // Parallel fetch all districts
    try {
      const results = await fetchAllDistrictsParallel();
      results.forEach(({ districtId, data }) => {
        allDistrictData[districtId] = Array.isArray(data) ? data : (data.data || []);
      });
    } catch (e) {
      console.warn('Parallel fetch failed:', e);
    }
  }

  hideLoadingPopup();
  renderOverview();
}

function processSummary(summaries) {
  // Summary format: { district_id, total, gen_saved, ei_saved }
  summaries.forEach(s => {
    if (!allDistrictData[s.district_id]) allDistrictData[s.district_id] = [];
    allDistrictData[s.district_id]._summary = s;
  });
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
    if (r && r.ei_saved === 'true') eiSaved++;
  });

  // Use summary override if available
  const summary = data._summary;
  if (summary) {
    return {
      total: summary.total || total,
      genSaved: summary.gen_saved || genSaved,
      eiSaved: summary.ei_saved || eiSaved,
      pct: summary.total ? Math.round((summary.gen_saved / summary.total) * 100) : 0
    };
  }

  return {
    total, genSaved, eiSaved,
    pct: total ? Math.round((genSaved / total) * 100) : 0
  };
}

// ============================================================
// RENDER OVERVIEW
// ============================================================
function renderOverview() {
  let totalRecords = 0, completedDist = 0, inProgressDist = 0, eiCompleted = 0;

  DISTRICTS_DATA.forEach(d => {
    const stats = getDistrictStats(d.district_id);
    totalRecords += stats.genSaved;
    if (stats.pct === 100) completedDist++;
    else if (stats.pct > 0) inProgressDist++;
    if (stats.eiSaved === stats.total && stats.total > 0) eiCompleted++;
  });

  document.getElementById('ov-completedDist').textContent = completedDist;
  document.getElementById('ov-inProgressDist').textContent = inProgressDist;
  document.getElementById('ov-totalRecords').textContent = totalRecords;
  document.getElementById('ov-eiCompleted').textContent = eiCompleted;

  renderDistrictTiles();
  renderStateCharts();
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
  const completed = stats.filter(s => s.pct === 100).length;
  const partial = stats.filter(s => s.pct > 0 && s.pct < 100).length;
  const notStarted = stats.filter(s => s.pct === 0).length;

  // State Doughnut
  const sCtx = document.getElementById('stateChart')?.getContext('2d');
  if (sCtx) {
    if (stateChart) stateChart.destroy();
    stateChart = new Chart(sCtx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{ data: [completed, partial, notStarted], backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  // Top districts bar chart
  const sorted = [...stats].sort((a, b) => b.pct - a.pct).slice(0, 10);
  const tCtx = document.getElementById('topDistChart')?.getContext('2d');
  if (tCtx) {
    if (topDistChart) topDistChart.destroy();
    topDistChart = new Chart(tCtx, {
      type: 'bar',
      data: {
        labels: sorted.map(s => s.name.length > 12 ? s.name.substring(0, 10) + '..' : s.name),
        datasets: [{ label: 'Completion %', data: sorted.map(s => s.pct), backgroundColor: sorted.map(s => s.pct >= 80 ? '#27ae60' : s.pct >= 30 ? '#f39c12' : '#e74c3c') }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
    });
  }
}

// ============================================================
// ADMIN DATA ENTRY (For any district)
// ============================================================
async function loadAdminEntry() {
  const districtId = document.getElementById('adminEntryDistrict').value;
  if (!districtId) return;

  const dist = DISTRICTS_DATA.find(d => d.district_id === districtId);
  const userId = CREDENTIALS_DATA.find(c => c.district_id === districtId)?.user_id;
  if (!dist || !userId) return;

  showLoadingPopup(`Loading ${dist.district_name} data...`);
  try {
    const result = await getSheetData(userId);
    const existingData = {};
    if (result && result.data) {
      result.data.forEach(row => { if (row.post_id) existingData[row.post_id] = row; });
    }
    allDistrictData[districtId] = result?.data || [];
    allDistrictData[districtId]._lookup = existingData;
  } catch (e) {
    console.warn('Error loading district:', e);
  }
  hideLoadingPopup();

  // Render table using district.js logic but adapted for admin
  renderAdminEntryTable(districtId);
}

function renderAdminEntryTable(districtId) {
  const posts = getPostsForDistrict(districtId);
  const dist = DISTRICTS_DATA.find(d => d.district_id === districtId);
  const userId = CREDENTIALS_DATA.find(c => c.district_id === districtId)?.user_id;
  const rowData = allDistrictData[districtId]?._lookup || {};
  const area = document.getElementById('adminEntryTableArea');

  // Build table similar to district dashboard but with admin tag
  let tableHTML = `
    <div class="progress-header-card">
      <div class="district-name">📍 ${dist?.district_name || ''} District – Admin Data Entry</div>
    </div>
    <div class="table-container">
      <div class="table-toolbar">
        <h3>Officers Data</h3>
        <div class="toolbar-right">
          <button class="btn btn-sm btn-outline" onclick="loadAdminEntry()">🔄 Refresh</button>
        </div>
      </div>
      <div class="table-scroll-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Sl</th><th>Department</th><th>Post</th><th>Officer</th>
            <th>CFMS</th><th>Contact</th><th>From Date</th><th>Native</th>
            <th>Reg/FAC</th><th>Eff</th><th>Intg</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
  `;
  posts.forEach((post, idx) => {
    const saved = rowData[post.post_id] || {};
    const isVacant = saved.is_vacant === 'true';
    const isNoPost = saved.is_no_post === 'true';
    const isGenSaved = saved.general_saved === 'true';
    const isEISaved = saved.ei_saved === 'true';

    let statusLabel = isEISaved && isGenSaved ? '✅ Full' : isGenSaved ? '⏳ E&I Pending' : isVacant ? '⭕ Vacant' : isNoPost ? '🚫 No Post' : '📝 Pending';
    let statusClass = isEISaved && isGenSaved ? 'badge-full' : isGenSaved ? 'badge-partial' : 'badge-pending';

    tableHTML += `
      <tr>
        <td style="font-weight:700;color:var(--text-muted);text-align:center">${idx+1}</td>
        <td><span class="chip">${post.department_name}</span></td>
        <td style="font-weight:600;color:var(--primary)">${post.post_name}</td>
        <td>${saved.officer_name || (isVacant ? '<em>Vacant</em>' : isNoPost ? '<em>No Post</em>' : '–')}</td>
        <td>${saved.cfms_id || '–'}</td>
        <td>${saved.contact_no || '–'}</td>
        <td>${saved.from_date || '–'}</td>
        <td>${saved.native_dist ? (DISTRICTS_DATA.find(d=>d.district_id===saved.native_dist)?.district_name || saved.native_dist) : '–'}</td>
        <td>${saved.reg_fac || '–'}</td>
        <td>${saved.efficiency || '–'}</td>
        <td>${saved.integrity || '–'}</td>
        <td><span class="row-status-badge ${statusClass}">${statusLabel}</span></td>
        <td>
          <button class="btn btn-xs btn-warning" onclick="adminEditRow('${districtId}','${userId}','${post.post_id}')">✏️ Edit</button>
        </td>
      </tr>
    `;
  });

  tableHTML += '</tbody></table></div></div>';
  area.innerHTML = tableHTML;
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
    ei_saved: (eff && intg) ? 'true' : 'false',
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
    renderAdminEntryTable(districtId);
  } catch (e) {
    showToast('Error saving data', 'error');
  }
  hideLoadingPopup();
}

// ============================================================
// VIEW DATA TABLE
// ============================================================
async function loadViewData() {
  const districtId = document.getElementById('viewDistrict')?.value;
  const districtsToLoad = districtId ? [DISTRICTS_DATA.find(d => d.district_id === districtId)] : DISTRICTS_DATA;

  showLoadingPopup('Loading data...');
  for (const dist of districtsToLoad) {
    if (!allDistrictData[dist.district_id] || allDistrictData[dist.district_id].length === 0) {
      const userId = CREDENTIALS_DATA.find(c => c.district_id === dist.district_id)?.user_id;
      if (userId) {
        try {
          const result = await getSheetData(userId);
          allDistrictData[dist.district_id] = result?.data || [];
          const lookup = {};
          (result?.data || []).forEach(r => { if (r.post_id) lookup[r.post_id] = r; });
          allDistrictData[dist.district_id]._lookup = lookup;
        } catch (e) {}
      }
    }
  }
  hideLoadingPopup();
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
    const nativeName = r.native_dist ? (DISTRICTS_DATA.find(d => d.district_id === r.native_dist)?.district_name || r.native_dist) : '–';
    const status = r.ei_saved === 'true' && r.general_saved === 'true' ? '<span class="row-status-badge badge-full">✅ Full</span>' :
      r.general_saved === 'true' ? '<span class="row-status-badge badge-partial">⏳ E&I</span>' :
      r.is_vacant === 'true' ? '<span class="row-status-badge badge-vacant">⭕ Vacant</span>' :
      r.is_no_post === 'true' ? '<span class="row-status-badge badge-nopost">🚫 No Post</span>' :
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
    const posts = getPostsForDistrict(dist.district_id);
    const lookup = allDistrictData[dist.district_id]?._lookup || {};
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

  tbody.innerHTML = rows.map(({ dist, post, r, estRetireYear, retireBadge }) => `
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
