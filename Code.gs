// ============================================================
// CODE.GS - Google Apps Script Backend
// AP Officers Data Collection Portal
// ============================================================
// HOW TO DEPLOY:
// 1. Open script.google.com → New Project → Paste this code
// 2. Replace SPREADSHEET_ID below with your Google Sheet ID
// 3. Click Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone (or "Anyone with Google account" for security)
// 4. Copy the Web App URL and paste into data.js APPS_SCRIPT_URL
// ============================================================

const SPREADSHEET_ID = "YOUR_GOOGLE_SPREADSHEET_ID_HERE";

// Column headers for each sheet row (ORDER MATTERS)
const COLUMNS = [
  "post_id", "district_id", "district_name", "dept_id", "department_name",
  "post_name", "officer_name", "cfms_id", "contact_no", "from_date",
  "native_dist", "reg_fac", "efficiency", "integrity",
  "is_vacant", "is_no_post", "general_saved", "ei_saved",
  "saved_at", "ei_saved_at", "saved_by"
];

// ============================================================
// CORS Helper
// ============================================================
function corsResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// GET Handler
// ============================================================
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === "getSheet") {
      const sheetName = e.parameter.sheet;
      const data = getSheetData_(sheetName);
      return corsResponse({ success: true, data });
    }

    if (action === "getSummary") {
      const summaries = getAllSummaries_();
      return corsResponse({ success: true, summaries });
    }

    return corsResponse({ success: false, error: "Unknown action" });

  } catch (err) {
    return corsResponse({ success: false, error: err.toString() });
  }
}

// ============================================================
// POST Handler
// ============================================================
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === "saveRow") {
      const result = saveRow_(payload.sheet, payload.data);
      // Update summary sheet after save
      updateSummarySheet_(payload.data.district_id, payload.sheet);
      return corsResponse({ success: true, result });
    }

    return corsResponse({ success: false, error: "Unknown action" });

  } catch (err) {
    return corsResponse({ success: false, error: err.toString() });
  }
}

// ============================================================
// Get all rows from a sheet
// ============================================================
function getSheetData_(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const data = sheet.getRange(2, 1, lastRow - 1, COLUMNS.length).getValues();
  return data
    .filter(row => row[0]) // filter empty rows
    .map(row => {
      const obj = {};
      COLUMNS.forEach((col, i) => { obj[col] = row[i] ? row[i].toString() : ""; });
      return obj;
    });
}

// ============================================================
// Save or update a row (identified by post_id)
// ============================================================
function saveRow_(sheetName, rowData) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Write header
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    sheet.getRange(1, 1, 1, COLUMNS.length).setBackground("#1a3a6b");
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontColor("#ffffff");
    sheet.freezeRows(1);
  }

  // Add timestamp
  rowData.saved_at = rowData.saved_at || new Date().toISOString();

  // Build row values in column order
  const rowValues = COLUMNS.map(col => rowData[col] || "");

  // Find existing row for this post_id
  const lastRow = sheet.getLastRow();
  let foundRow = -1;

  if (lastRow >= 2) {
    const postIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const idx = postIds.indexOf(rowData.post_id);
    if (idx !== -1) foundRow = idx + 2;
  }

  if (foundRow !== -1) {
    // Update existing row
    sheet.getRange(foundRow, 1, 1, COLUMNS.length).setValues([rowValues]);
  } else {
    // Append new row
    sheet.appendRow(rowValues);
  }

  // Apply conditional formatting for status
  applyRowFormatting_(sheet, rowData, foundRow !== -1 ? foundRow : sheet.getLastRow());

  return { updated: foundRow !== -1, row: foundRow !== -1 ? foundRow : sheet.getLastRow() };
}

// ============================================================
// Apply row formatting based on status
// ============================================================
function applyRowFormatting_(sheet, rowData, rowNum) {
  const range = sheet.getRange(rowNum, 1, 1, COLUMNS.length);
  if (rowData.is_vacant === "true") {
    range.setBackground("#fff9e6");
  } else if (rowData.is_no_post === "true") {
    range.setBackground("#fef0f0");
  } else if (rowData.ei_saved === "true" && rowData.general_saved === "true") {
    range.setBackground("#e8f8f0");
  } else if (rowData.general_saved === "true") {
    range.setBackground("#f0fff4");
  } else {
    range.setBackground("#ffffff");
  }
}

// ============================================================
// Summary Sheet for fast admin dashboard loading
// ============================================================
function updateSummarySheet_(districtId, sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let summary = ss.getSheetByName("_SUMMARY");

  if (!summary) {
    summary = ss.insertSheet("_SUMMARY");
    summary.getRange(1, 1, 1, 6).setValues([["district_id", "sheet_name", "total", "gen_saved", "ei_saved", "updated_at"]]);
    summary.getRange(1, 1, 1, 6).setFontWeight("bold");
    summary.getRange(1, 1, 1, 6).setBackground("#1a3a6b");
    summary.getRange(1, 1, 1, 6).setFontColor("#ffffff");
  }

  // Recompute stats for this district
  const data = getSheetData_(sheetName);
  const total = data.length; // This won't be accurate without post list, use data.length
  const genSaved = data.filter(r => r.general_saved === "true" || r.is_vacant === "true" || r.is_no_post === "true").length;
  const eiSaved = data.filter(r => r.ei_saved === "true").length;

  const lastRow = summary.getLastRow();
  let foundRow = -1;
  if (lastRow >= 2) {
    const ids = summary.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const idx = ids.indexOf(districtId);
    if (idx !== -1) foundRow = idx + 2;
  }

  const rowValues = [districtId, sheetName, total, genSaved, eiSaved, new Date().toISOString()];
  if (foundRow !== -1) {
    summary.getRange(foundRow, 1, 1, 6).setValues([rowValues]);
  } else {
    summary.appendRow(rowValues);
  }
}

// ============================================================
// Get all summaries for admin dashboard
// ============================================================
function getAllSummaries_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const summary = ss.getSheetByName("_SUMMARY");
  if (!summary) return [];

  const lastRow = summary.getLastRow();
  if (lastRow < 2) return [];

  const data = summary.getRange(2, 1, lastRow - 1, 6).getValues();
  return data.filter(r => r[0]).map(row => ({
    district_id: row[0],
    sheet_name: row[1],
    total: row[2],
    gen_saved: row[3],
    ei_saved: row[4],
    updated_at: row[5]
  }));
}

// ============================================================
// SETUP: Create all 28 district sheets + summary sheet
// Run this ONCE manually from Apps Script editor
// ============================================================
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const districtSheets = [
    "SRIKAKULAM","VIZIANAGARAM","VISAKHAPATNAM","EASTGODAVARI","WESTGODAVARI",
    "KRISHNA","GUNTUR","PRAKASAM","NELLORE","KURNOOL","KADAPA","ANANTAPUR",
    "CHITTOOR","ALLURI","ANAKAPALLI","ANNAMAYYA","BAPATLA","ELURU","KONASEEMA",
    "NANDYAL","NTR","PALNADU","PARVATHIPURAM","SRISATHYASAI","TIRUPATI",
    "KAKINADA","MANYAM","YSRKADAPA"
  ];

  districtSheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
      sheet.getRange(1, 1, 1, COLUMNS.length).setBackground("#1a3a6b");
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontColor("#ffffff");
      sheet.freezeRows(1);
      sheet.setColumnWidths(1, COLUMNS.length, 150);
      Logger.log("Created sheet: " + name);
    }
  });

  // Create summary sheet
  let summary = ss.getSheetByName("_SUMMARY");
  if (!summary) {
    summary = ss.insertSheet("_SUMMARY");
    summary.getRange(1, 1, 1, 6).setValues([["district_id", "sheet_name", "total", "gen_saved", "ei_saved", "updated_at"]]);
    summary.getRange(1, 1, 1, 6).setFontWeight("bold");
    summary.getRange(1, 1, 1, 6).setBackground("#1a3a6b");
    summary.getRange(1, 1, 1, 6).setFontColor("#ffffff");
  }

  Logger.log("Setup complete! All sheets created.");
}
