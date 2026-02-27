# 📋 AP Officers Portal – Setup Guide

## Files Provided
| File | Purpose |
|---|---|
| `index.html` | Login page (entry point) |
| `dashboard.html` | District Collector dashboard |
| `admin.html` | Admin dashboard |
| `style.css` | All styles (shared) |
| `data.js` | JSON data + Google Sheets API calls |
| `auth.js` | Authentication logic |
| `district.js` | District dashboard logic |
| `admin.js` | Admin dashboard logic |
| `analytics.js` | Charts and reports |
| `Code.gs` | Google Apps Script backend |

---

## ✅ Step-by-Step Setup

### STEP 1: Create Your Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it: **AP Officers Portal Data**
3. Copy the **Spreadsheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/`**`1ABC...XYZ`**`/edit`
   - The bold part is your Spreadsheet ID

---

### STEP 2: Set Up Google Apps Script
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete the default code
3. Paste the entire contents of `Code.gs`
4. Replace `YOUR_GOOGLE_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
5. Click **Save** (💾 icon)

---

### STEP 3: Create All 28 District Sheets
1. In Apps Script editor, find the `setupSheets` function
2. Click the **Run** button ▶️ (make sure `setupSheets` is selected in the dropdown)
3. Grant permissions when prompted (click "Allow")
4. This creates all 28 district sheets + `_SUMMARY` sheet automatically

---

### STEP 4: Deploy as Web App
1. Click **Deploy → New Deployment**
2. Click the gear icon ⚙️ next to "Type" and select **Web app**
3. Set:
   - **Description**: AP Officers Portal API
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone *(or "Anyone with Google account" for extra security)*
4. Click **Deploy**
5. **Copy the Web App URL** – it looks like:
   `https://script.google.com/macros/s/AKfycby.../exec`

---

### STEP 5: Connect Your Frontend
1. Open `data.js` in a text editor
2. Find this line near the top:
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```
3. Replace with your actual Web App URL from Step 4

---

### STEP 6: Host the Website
**Option A – Google Sites (Free, Easiest)**
1. Go to [sites.google.com](https://sites.google.com) → New Site
2. Embed each HTML page using the "Embed" feature
3. Or use the "Pages" feature to link your files

**Option B – Any Web Hosting**
- Upload all 9 files to any web host:
  - `index.html`, `dashboard.html`, `admin.html`
  - `style.css`, `data.js`, `auth.js`, `district.js`, `admin.js`, `analytics.js`
- All files must be in the **same folder**
- Open `index.html` in browser to start

**Option C – GitHub Pages (Free)**
1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages → Enable from main branch
4. Your site is live at `https://yourusername.github.io/reponame`

---

## 🔐 Login Credentials

### District Logins
| District | User ID | Password |
|---|---|---|
| Srikakulam | SRIKAKULAM | Srk@2024 |
| Vizianagaram | VIZIANAGARAM | Vzm@2024 |
| Visakhapatnam | VISAKHAPATNAM | Vsk@2024 |
| East Godavari | EASTGODAVARI | Egg@2024 |
| West Godavari | WESTGODAVARI | Wgg@2024 |
| Krishna | KRISHNA | Krs@2024 |
| Guntur | GUNTUR | Gnt@2024 |
| Prakasam | PRAKASAM | Prk@2024 |
| Nellore | NELLORE | Nel@2024 |
| Kurnool | KURNOOL | Krl@2024 |
| Kadapa | KADAPA | Kdp@2024 |
| Anantapur | ANANTAPUR | Ant@2024 |
| Chittoor | CHITTOOR | Ctr@2024 |
| Alluri Sitharama Raju | ALLURI | Alr@2024 |
| Anakapalli | ANAKAPALLI | Akp@2024 |
| Annamayya | ANNAMAYYA | Anm@2024 |
| Bapatla | BAPATLA | Bpt@2024 |
| Eluru | ELURU | Elr@2024 |
| Konaseema | KONASEEMA | Kns@2024 |
| Nandyal | NANDYAL | Ndy@2024 |
| NTR | NTR | Ntr@2024 |
| Palnadu | PALNADU | Pln@2024 |
| Parvathipuram Manyam | PARVATHIPURAM | Pvt@2024 |
| Sri Sathya Sai | SRISATHYASAI | Sss@2024 |
| Sri Balaji (Tirupati) | TIRUPATI | Tpt@2024 |
| Kakinada | KAKINADA | Kkd@2024 |
| Manyam | MANYAM | Mym@2024 |
| YSR Kadapa | YSRKADAPA | Ysr@2024 |

### Admin Login
| User ID | Password |
|---|---|
| ADMIN | Admin@AP2024 |

> **Important**: Change passwords in `data.js` → `CREDENTIALS_DATA` array before deploying in production.

---

## 📁 Customizing Your JSON Data

### Adding/Editing Posts
In `data.js`, find `POSTS_DATA` array. Each post has:
```javascript
{ 
  district_id: "ALL",        // "ALL" = common to all districts, or specific "D01", "D02" etc.
  dept_id: "DEP01", 
  department_name: "General Administration", 
  post_id: "P001",           // Must be unique
  post_name: "District Collector" 
}
```

### Adding Districts
Update `DISTRICTS_DATA` array with new district entries.

---

## ⚙️ Re-deploying After Code Changes
When you update `Code.gs`:
1. Go to **Deploy → Manage Deployments**
2. Click **Edit** (pencil icon) on your deployment
3. Change version to **"New version"**
4. Click **Deploy**
5. **The URL stays the same** – no need to update `data.js`

---

## 🛠 Troubleshooting

| Problem | Solution |
|---|---|
| "Error loading data" | Check your APPS_SCRIPT_URL in data.js |
| "Permission denied" in Apps Script | Re-run `setupSheets` and grant permissions |
| Sheets not getting created | Run `setupSheets` from the Apps Script editor |
| Data not saving | Check if Web App is deployed with "Anyone" access |
| CORS errors | Make sure Apps Script is deployed as Web App (not as API executable) |
| Slow admin dashboard | The `_SUMMARY` sheet auto-caches data; first load may be slow |

---

## 🔒 Security Recommendations
1. Change all default passwords in `data.js` before production use
2. Consider using "Anyone with Google account" instead of "Anyone" in Web App access
3. Add additional server-side validation in `Code.gs` if needed
4. Regularly backup the Google Sheet data

---

## 📞 Support Contacts (as configured)
- **D Srinivasan** – OSD to Spl CS to HCM | 📞 123456
- **Kranthi Kumar** – PS to Spl CS to HCM | 📞 456789  
- **Wilson** – PA to Spl CS to HCM | 📞 8795565
