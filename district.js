// ============================================================
// DISTRICT.JS - District Collector Dashboard Logic
// ============================================================

let currentUser = null;
let currentDistrict = null;
let districtPosts = [];
let rowData = {}; // keyed by post_id, holds all entered data
let doughnutChart = null;
let deptBarChart = null;
let sortCol = null;
let sortDir = 1; // 1 = asc, -1 = desc

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  currentUser = requireAuth();
  if (!currentUser) return;
  if (currentUser.district_id === 'ADMIN') { window.location.href = 'admin.html'; return; }

  // Set UI
  const dist = DISTRICTS_DATA.find(d => d.district_id === currentUser.district_id);
  currentDistrict = dist;
  document.getElementById('sidebarDistrictName').textContent = dist ? dist.district_name : currentUser.user_id;
  document.getElementById('progressDistrictTitle').textContent = `${dist ? dist.district_name : ''} District – Data Entry`;
  document.getElementById('headerUser').textContent = currentUser.user_id;
  document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  // Load posts
  districtPosts = getPostsForDistrict(currentUser.district_id);

  await loadData();
});

// ============================================================
// NAVIGATION
// ============================================================
function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const titleMap = {
    'sec-entry': 'Data Entry',
    'sec-progress': 'Progress Dashboard',
    'sec-deptprogress': 'Department-wise Progress',
    'sec-export': 'Export Data',
    'sec-contact': 'Contact Us'
  };
  document.getElementById('headerTitle').textContent = titleMap[id] || '';

  // Render charts when progress section is shown
  if (id === 'sec-progress') renderProgressCharts();
  if (id === 'sec-deptprogress') renderDeptProgress();

  // Highlight active nav item
  const navMap = {
    'sec-entry': 0, 'sec-progress': 1, 'sec-deptprogress': 2,
    'sec-export': 3, 'sec-contact': 4
  };
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(n => n.classList.remove('active'));
  if (navMap[id] !== undefined) navItems[navMap[id]].classList.add('active');
}

// ============================================================
// LOAD DATA FROM GOOGLE SHEETS
// ============================================================
async function loadData() {
  showLoadingPopup('Loading data from Database...');
  try {
    const result = await getSheetData(currentUser.user_id);
    rowData = {};
    if (result && result.data && Array.isArray(result.data)) {
      result.data.forEach(row => {
        if (row.post_id) rowData[row.post_id] = row;
      });
    }
  } catch (e) {
    console.warn('Could not load from Database, working offline:', e);
  }
  hideLoadingPopup();
  renderTable();
  updateProgressHeader();
}

// ============================================================
// TABLE SORT
// ============================================================
function sortTable(col) {
  if (sortCol === col) {
    sortDir *= -1;
  } else {
    sortCol = col;
    sortDir = 1;
  }
  renderTable();
}

function getPostSortValue(post, col) {
  const saved = rowData[post.post_id] || {};
  const isVacant = saved.is_vacant === 'true';
  const isNoPost = saved.is_no_post === 'true';
  const isGenSaved = saved.general_saved === 'true';
  const isEISaved = saved.ei_saved === 'true' || isVacant || isNoPost;
  switch (col) {
    case 'sl':       return districtPosts.indexOf(post);
    case 'dept':     return (post.department_name || '').toLowerCase();
    case 'post':     return (post.post_name || '').toLowerCase();
    case 'name':     return (saved.officer_name || '').toLowerCase();
    case 'cfms':     return saved.cfms_id || '';
    case 'contact':  return saved.contact_no || '';
    case 'from_date':return saved.from_date || '';
    case 'native':   return saved.native_dist || '';
    case 'regfac':   return saved.reg_fac || '';
    case 'eff':      return parseFloat(saved.efficiency) || -1;
    case 'intg':     return parseFloat(saved.integrity) || -1;
    case 'status': {
      if (isGenSaved && isEISaved) return 0;
      if (isGenSaved) return 1;
      if (isVacant) return 2;
      if (isNoPost) return 3;
      return 4;
    }
    default: return '';
  }
}

// ============================================================
// RENDER TABLE
// ============================================================
function renderTable() {
  const tbody = document.getElementById('dataTableBody');
  tbody.innerHTML = '';

  // Sort a copy of districtPosts
  let posts = [...districtPosts];
  if (sortCol) {
    posts.sort((a, b) => {
      const va = getPostSortValue(a, sortCol);
      const vb = getPostSortValue(b, sortCol);
      if (va < vb) return -sortDir;
      if (va > vb) return sortDir;
      return 0;
    });
  }

  // Update sort indicator arrows
  document.querySelectorAll('.sort-ind').forEach(el => { el.textContent = ''; el.className = 'sort-ind'; });
  if (sortCol) {
    const ind = document.getElementById(`sort-${sortCol}`);
    if (ind) { ind.textContent = sortDir === 1 ? '▲' : '▼'; ind.className = 'sort-ind active'; }
  }

  posts.forEach((post, idx) => {
    const saved = rowData[post.post_id] || {};
    const isVacant = saved.is_vacant === 'true' || saved.is_vacant === true;
    const isNoPost = saved.is_no_post === 'true' || saved.is_no_post === true;
    const isGeneralSaved = saved.general_saved === 'true' || saved.general_saved === true;
    const isEISaved = saved.ei_saved === 'true' || saved.ei_saved === true || saved.is_vacant === 'true' || saved.is_vacant === true || saved.is_no_post === 'true' || saved.is_no_post === true;
    const isFullySaved = isGeneralSaved && isEISaved;

    const tr = document.createElement('tr');
    tr.id = `row-${post.post_id}`;
    tr.className = isFullySaved ? 'row-fully-saved' : (isGeneralSaved ? 'row-saved' : (isVacant ? 'row-vacant' : (isNoPost ? 'row-nopost' : '')));

    // Determine if general fields are editable
    const genDisabled = isGeneralSaved && !isVacant && !isNoPost ? 'disabled' : '';
    const eiDisabled = isEISaved ? 'disabled' : '';

    // Status badge
    let statusBadge = '';
    if (isFullySaved) statusBadge = '<span class="row-status-badge badge-full">✅ Fully Complete</span>';
    else if (isNoPost) statusBadge = '<span class="row-status-badge badge-nopost">🚫 No Such Post</span>';
    else if (isVacant) statusBadge = '<span class="row-status-badge badge-vacant">⭕ Vacant</span>';
    else if (isGeneralSaved) statusBadge = '<span class="row-status-badge badge-partial">⏳ Efficieny & Integrity Data Pending</span>';
    else statusBadge = '<span class="row-status-badge badge-pending">📝 Pending</span>';

    tr.innerHTML = `
      <td style="text-align:center; font-weight:700; color:var(--text-muted)">${idx + 1}</td>
      <td><span class="chip">${post.department_name}</span></td>
      <td style="font-weight:600; color:var(--primary)">${post.post_name}</td>

      <td>
        <div class="flag-checks">
          <label class="flag-check">
            <input type="checkbox" id="vacant-${post.post_id}" ${isVacant ? 'checked' : ''} ${isGeneralSaved && !isVacant ? 'disabled' : ''}
              onchange="handleVacantToggle('${post.post_id}', this.checked, 'vacant')"> Vacant
          </label>
          <label class="flag-check">
            <input type="checkbox" id="nopost-${post.post_id}" ${isNoPost ? 'checked' : ''} ${isGeneralSaved && !isNoPost ? 'disabled' : ''}
              onchange="handleVacantToggle('${post.post_id}', this.checked, 'nopost')"> No Such Post
          </label>
        </div>
        <input type="text" id="name-${post.post_id}" class="table-input" placeholder="Officer Name"
          value="${saved.officer_name || ''}" maxlength="100" ${(isVacant || isNoPost || genDisabled) ? 'disabled' : ''}
          oninput="onFieldChange('${post.post_id}')" style="margin-top:6px;" />
      </td>

      <td>
        <input type="text" id="cfms-${post.post_id}" class="table-input" placeholder="8-digit CFMS ID"
          value="${saved.cfms_id || ''}" maxlength="8" ${(isVacant || isNoPost || genDisabled) ? 'disabled' : ''}
          oninput="onFieldChange('${post.post_id}')" />
      </td>

      <td>
        <input type="text" id="contact-${post.post_id}" class="table-input" placeholder="10-digit Mobile"
          value="${saved.contact_no || ''}" maxlength="10" ${(isVacant || isNoPost || genDisabled) ? 'disabled' : ''}
          oninput="onFieldChange('${post.post_id}')" />
      </td>

      <td>
        <input type="date" id="from-date-${post.post_id}" class="table-input" style="min-width:130px"
          value="${saved.from_date || ''}" ${(isVacant || isNoPost || genDisabled) ? 'disabled' : ''}
          onchange="onFieldChange('${post.post_id}')" />
      </td>

      <td>
        <select id="native-${post.post_id}" class="table-select" ${(isVacant || isNoPost || genDisabled) ? 'disabled' : ''}
          onchange="onFieldChange('${post.post_id}')">
          <option value="">Select...</option>
          ${DISTRICTS_DATA.map(d => `<option value="${d.district_id}" ${saved.native_dist === d.district_id ? 'selected' : ''}>${d.district_name}</option>`).join('')}
          <option value="OTHER_STATE" ${saved.native_dist === 'OTHER_STATE' ? 'selected' : ''}>Other State</option>
        </select>
      </td>

      <td>
        <select id="regfac-${post.post_id}" class="table-select" ${(isVacant || isNoPost || genDisabled) ? 'disabled' : ''}
          onchange="onFieldChange('${post.post_id}')">
          <option value="">Select...</option>
          <option value="Regular" ${saved.reg_fac === 'Regular' ? 'selected' : ''}>Regular</option>
          <option value="FAC" ${saved.reg_fac === 'FAC' ? 'selected' : ''}>FAC</option>
        </select>
      </td>

      <!-- Efficiency -->
      <td>
        <div class="ei-section">
          <input type="number" id="eff-${post.post_id}" class="table-input ei-input" placeholder="1-10"
            min="1" max="10" value="${saved.efficiency || ''}" ${eiDisabled}
            oninput="onEIChange('${post.post_id}')" />
        </div>
      </td>

      <!-- Integrity -->
      <td>
        <div class="ei-section">
          <input type="number" id="intg-${post.post_id}" class="table-input ei-input" placeholder="1-10"
            min="1" max="10" value="${saved.integrity || ''}" ${eiDisabled}
            oninput="onEIChange('${post.post_id}')" />
        </div>
      </td>

      <td>${statusBadge}</td>

      <!-- Action Buttons -->
      <td>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <!-- General Save/Edit -->
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${!isGeneralSaved
              ? `<button id="saveGen-${post.post_id}" class="btn btn-sm btn-success" onclick="saveGeneral('${post.post_id}')" disabled>💾 Save General Data</button>`
              : `<button class="btn btn-sm btn-warning" onclick="editGeneral('${post.post_id}')">✏️ Edit General Data </button>`
            }
          </div>
          <!-- E&I Save/Edit -->
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${!isEISaved
              ? `<button id="saveEI-${post.post_id}" class="btn btn-sm btn-success" onclick="saveEI('${post.post_id}')" ${isGeneralSaved ? '' : 'disabled'} style="background:var(--accent3)">💾 Save Efficiency & Integrity Data</button>`
              : `<button class="btn btn-sm btn-warning" onclick="editEI('${post.post_id}')">✏️ Edit Efficiency & Integrity Data </button>`
            }
          </div>
        </div>
      </td>
    `;

    tbody.appendChild(tr);

    // Set initial save button state
    checkSaveButtonState(post.post_id);
    checkEISaveButtonState(post.post_id);
  });
}

// ============================================================
// VACANT / NO SUCH POST TOGGLE
// ============================================================
function handleVacantToggle(postId, checked, type) {
  const vacantChk = document.getElementById(`vacant-${postId}`);
  const nopostChk = document.getElementById(`nopost-${postId}`);
  const fields = ['name', 'cfms', 'contact', 'from-date', 'native', 'regfac'];

  // Only one can be checked
  if (type === 'vacant' && checked) { nopostChk.checked = false; }
  if (type === 'nopost' && checked) { vacantChk.checked = false; }

  const isVacant = vacantChk.checked;
  const isNoPost = nopostChk.checked;
  const shouldDisable = isVacant || isNoPost;

  fields.forEach(f => {
    const el = document.getElementById(`${f}-${postId}`);
    if (el) {
      el.disabled = shouldDisable;
      if (shouldDisable) el.value = '';
    }
  });

  // Enable save immediately if vacant or no post
  const saveBtn = document.getElementById(`saveGen-${postId}`);
  if (saveBtn) saveBtn.disabled = false;
}

// ============================================================
// FIELD CHANGE HANDLER
// ============================================================
function onFieldChange(postId) {
  checkSaveButtonState(postId);
}

function onEIChange(postId) {
  checkEISaveButtonState(postId);
}

function checkSaveButtonState(postId) {
  const saveBtn = document.getElementById(`saveGen-${postId}`);
  if (!saveBtn) return;

  const isVacant = document.getElementById(`vacant-${postId}`)?.checked;
  const isNoPost = document.getElementById(`nopost-${postId}`)?.checked;

  if (isVacant || isNoPost) {
    saveBtn.disabled = false;
    return;
  }

  // All required general fields must be filled
  const name = document.getElementById(`name-${postId}`)?.value.trim();
  const cfms = document.getElementById(`cfms-${postId}`)?.value.trim();
  const contact = document.getElementById(`contact-${postId}`)?.value.trim();
  const fromDate = document.getElementById(`from-date-${postId}`)?.value;
  const native = document.getElementById(`native-${postId}`)?.value;
  const regfac = document.getElementById(`regfac-${postId}`)?.value;

  saveBtn.disabled = !(name && cfms && contact && fromDate && native && regfac);
}

function checkEISaveButtonState(postId) {
  const saveBtn = document.getElementById(`saveEI-${postId}`);
  if (!saveBtn) return;
  const eff = document.getElementById(`eff-${postId}`)?.value;
  const intg = document.getElementById(`intg-${postId}`)?.value;
  saveBtn.disabled = !(eff && intg);
}

// ============================================================
// VALIDATE & SAVE GENERAL DATA
// ============================================================
async function saveGeneral(postId) {
  const isVacant = document.getElementById(`vacant-${postId}`)?.checked;
  const isNoPost = document.getElementById(`nopost-${postId}`)?.checked;

  let payload = {
    post_id: postId,
    district_id: currentUser.district_id,
    district_name: currentDistrict?.district_name || '',
    is_vacant: isVacant ? 'true' : 'false',
    is_no_post: isNoPost ? 'true' : 'false',
    general_saved: 'true',
    ei_saved: (isVacant || isNoPost) ? 'true' : (rowData[postId]?.ei_saved || 'false'),
    efficiency: rowData[postId]?.efficiency || '',
    integrity: rowData[postId]?.integrity || '',
    saved_at: new Date().toISOString()
  };

  if (!isVacant && !isNoPost) {
    const name = document.getElementById(`name-${postId}`)?.value.trim();
    const cfms = document.getElementById(`cfms-${postId}`)?.value.trim();
    const contact = document.getElementById(`contact-${postId}`)?.value.trim();
    const fromDate = document.getElementById(`from-date-${postId}`)?.value;
    const native = document.getElementById(`native-${postId}`)?.value;
    const regfac = document.getElementById(`regfac-${postId}`)?.value;

    // Validate
    const errors = [];
    if (!validateName(name)) errors.push('Officer Name should only contain letters and spaces.');
    if (!validateCFMSID(cfms)) errors.push('CFMS ID must be exactly 8 numeric digits.');
    if (!validateContact(contact)) errors.push('Contact No must be exactly 10 numeric digits.');
    if (errors.length) { showToast(errors[0], 'error', 4000); return; }

    const post = districtPosts.find(p => p.post_id === postId);
    payload = {
      ...payload,
      officer_name: name,
      cfms_id: cfms,
      contact_no: contact,
      from_date: fromDate,
      native_dist: native,
      reg_fac: regfac,
      department_name: post?.department_name || '',
      post_name: post?.post_name || '',
      dept_id: post?.dept_id || ''
    };
  } else {
    const post = districtPosts.find(p => p.post_id === postId);
    payload = {
      ...payload,
      officer_name: '',
      cfms_id: '',
      contact_no: '',
      from_date: '',
      native_dist: '',
      reg_fac: '',
      department_name: post?.department_name || '',
      post_name: post?.post_name || '',
      dept_id: post?.dept_id || ''
    };
  }

  showLoadingPopup('Saving to Database...');
  try {
    await saveRowToSheet(currentUser.user_id, payload);
    rowData[postId] = payload;
    showToast('General data saved successfully!', 'success');
  } catch (e) {
    showToast('Error saving data. Please try again.', 'error');
  }
  hideLoadingPopup();
  renderTable();
  updateProgressHeader();
}

// ============================================================
// SAVE E&I DATA
// ============================================================
async function saveEI(postId) {

 
  const eff = parseInt(document.getElementById(`eff-${postId}`)?.value);
  const intg = parseInt(document.getElementById(`intg-${postId}`)?.value);

  if (isNaN(eff) || eff < 1 || eff > 10) { showToast('Efficiency must be between 1 and 10', 'error'); return; }
  if (isNaN(intg) || intg < 1 || intg > 10) { showToast('Integrity must be between 1 and 10', 'error'); return; }

  const existing = rowData[postId] || {};
  const payload = {
    ...existing,
    post_id: postId,
    efficiency: eff.toString(),
    integrity: intg.toString(),
    ei_saved: 'true',
    ei_saved_at: new Date().toISOString(),
    saved_at: new Date().toISOString()
  };

  showLoadingPopup('Saving Efficiency & Integrity data...');
  try {
    await saveRowToSheet(currentUser.user_id, payload);
    rowData[postId] = payload;
    showToast('Efficiency & Integrity data saved!', 'success');
  } catch (e) {
    showToast('Error saving Efficiency & Integrity data. Please try again.', 'error');
  }
  hideLoadingPopup();
  renderTable();
  updateProgressHeader();
}

// ============================================================
// EDIT BUTTONS
// ============================================================
function editGeneral(postId) {
  if (rowData[postId]) {
    rowData[postId].general_saved = 'false';
  }
  renderTable();
  updateProgressHeader();
}

function editEI(postId) {
  if (rowData[postId]) {
    rowData[postId].ei_saved = 'false';
  }
  renderTable();
  updateProgressHeader();
}

// ============================================================
// PROGRESS HEADER UPDATE
// ============================================================
function updateProgressHeader() {
  const total = districtPosts.length;
  let genSaved = 0, eiSaved = 0;

  districtPosts.forEach(post => {
    const r = rowData[post.post_id];
    if (r && (r.general_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) genSaved++;
    if (r && (r.ei_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) eiSaved++;
  });

  const pending = total - genSaved;
  const genPct = total ? Math.round((genSaved / total) * 100) : 0;
  const eiPct = total ? Math.round((eiSaved / total) * 100) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statSaved').textContent = genSaved;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statEI').textContent = eiSaved;
  document.getElementById('barGeneral').style.width = genPct + '%';
  document.getElementById('barEI').style.width = eiPct + '%';
  document.getElementById('pctGeneral').textContent = genPct + '%';
  document.getElementById('pctEI').textContent = eiPct + '%';
}

// ============================================================
// CHARTS
// ============================================================
function renderProgressCharts() {
  const total = districtPosts.length;
  let genSaved = 0, eiSaved = 0;
  districtPosts.forEach(post => {
    const r = rowData[post.post_id];
    if (r && (r.general_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) genSaved++;
    if (r && (r.ei_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) eiSaved++;
  });

  // Doughnut
  const dCtx = document.getElementById('doughnutChart').getContext('2d');
  if (doughnutChart) doughnutChart.destroy();
  doughnutChart = new Chart(dCtx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [genSaved, total - genSaved],
        backgroundColor: ['#27ae60', '#e74c3c'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });

  // Dept Bar Chart
  const depts = {};
  districtPosts.forEach(post => {
    const dept = post.department_name;
    if (!depts[dept]) depts[dept] = { total: 0, saved: 0 };
    depts[dept].total++;
    const r = rowData[post.post_id];
    if (r && (r.general_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) depts[dept].saved++;
  });
  const bCtx = document.getElementById('deptBarChart').getContext('2d');
  if (deptBarChart) deptBarChart.destroy();
  deptBarChart = new Chart(bCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(depts).map(d => d.length > 18 ? d.substring(0, 16) + '..' : d),
      datasets: [
        { label: 'Saved', data: Object.values(depts).map(d => d.saved), backgroundColor: '#27ae60' },
        { label: 'Pending', data: Object.values(depts).map(d => d.total - d.saved), backgroundColor: '#e74c3c' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// ============================================================
// DEPT PROGRESS RENDER
// ============================================================
function renderDeptProgress() {
  const grid = document.getElementById('deptProgressGrid');
  const depts = {};
  districtPosts.forEach(post => {
    const dept = post.department_name;
    if (!depts[dept]) depts[dept] = { total: 0, saved: 0, eiSaved: 0, posts: [] };
    depts[dept].total++;
    const r = rowData[post.post_id];
    if (r && (r.general_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) depts[dept].saved++;
    if (r && (r.ei_saved === 'true' || r.is_vacant === 'true' || r.is_no_post === 'true')) depts[dept].eiSaved++;
    depts[dept].posts.push(post);
  });

  grid.innerHTML = Object.entries(depts).map(([dept, info]) => {
    const pct = Math.round((info.saved / info.total) * 100);
    return `
      <div class="dept-card">
        <div class="dept-name">${dept}</div>
        <div class="dept-stats">
          <div class="dept-stat"><div class="val" style="color:var(--primary)">${info.total}</div><div class="lbl">Total</div></div>
          <div class="dept-stat"><div class="val" style="color:var(--success)">${info.saved}</div><div class="lbl">Saved</div></div>
          <div class="dept-stat"><div class="val" style="color:var(--accent3)">${info.eiSaved}</div><div class="lbl">E&I Done</div></div>
        </div>
        <div class="progress-bar-track" style="height:8px; margin-top:8px;">
          <div class="progress-bar-fill general" style="width:${pct}%"></div>
        </div>
        <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">${pct}% complete</div>
      </div>
    `;
  }).join('');
}

// ============================================================
// EXPORT
// ============================================================
function exportJSON() {
  const records = districtPosts.map(post => ({
    ...post,
    ...(rowData[post.post_id] || { status: 'pending' })
  }));
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${currentUser.user_id}_officers_data.json`);
  showToast('JSON exported successfully!', 'success');
}

function exportCSV() {
  const headers = ['sl_no','department_name','post_name','officer_name','cfms_id','contact_no','from_date','native_dist','reg_fac','efficiency','integrity','is_vacant','is_no_post','general_saved','ei_saved'];
  const rows = [headers.join(',')];
  districtPosts.forEach((post, idx) => {
    const r = rowData[post.post_id] || {};
    const row = [
      idx + 1, post.department_name, post.post_name,
      r.officer_name || '', r.cfms_id || '', r.contact_no || '',
      r.from_date || '', r.native_dist || '', r.reg_fac || '',
      r.efficiency || '', r.integrity || '',
      r.is_vacant || 'false', r.is_no_post || 'false',
      r.general_saved || 'false', r.ei_saved || 'false'
    ].map(v => `"${v}"`);
    rows.push(row.join(','));
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  downloadBlob(blob, `${currentUser.user_id}_officers_data.csv`);
  showToast('CSV exported successfully!', 'success');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}
