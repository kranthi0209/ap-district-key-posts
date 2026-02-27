// ============================================================
// DATA.JS - JSON Data & Google Sheets Integration
// ============================================================

// ---- DISTRICTS JSON ----
const DISTRICTS_DATA = [
{ district_id: "D01", district_name: "Alluri Sitha Ramaraju" },
{ district_id: "D02", district_name: "Anakapalli" },
{ district_id: "D03", district_name: "Anantapuramu" },
{ district_id: "D04", district_name: "Annamayya" },
{ district_id: "D05", district_name: "Bapatla" },
{ district_id: "D06", district_name: "Chittoor" },
{ district_id: "D07", district_name: "East Godavari" },
{ district_id: "D08", district_name: "Eluru" },
{ district_id: "D09", district_name: "Guntur" },
{ district_id: "D10", district_name: "Kadapa" },
{ district_id: "D11", district_name: "Kakinada" },
{ district_id: "D12", district_name: "Dr BR Ambedkar Konaseema" },
{ district_id: "D13", district_name: "Krishna" },
{ district_id: "D14", district_name: "Kurnool" },
{ district_id: "D15", district_name: "Parvathipuram Manyam" },
{ district_id: "D16", district_name: "Markapuram" },
{ district_id: "D17", district_name: "Nandyal" },
{ district_id: "D18", district_name: "SPSR Nellore" },
{ district_id: "D19", district_name: "NTR" },
{ district_id: "D20", district_name: "Palnadu" },
{ district_id: "D21", district_name: "Polavaram" },
{ district_id: "D22", district_name: "Prakasam" },
{ district_id: "D23", district_name: "Srikakulam" },
{ district_id: "D24", district_name: "Sri Sathya Sai" },
{ district_id: "D25", district_name: "Tirupati" },
{ district_id: "D26", district_name: "Visakhapatnam" },
{ district_id: "D27", district_name: "Vizianagaram" },
{ district_id: "D28", district_name: "West Godavari" }

];

// ---- POSTS JSON (Sample - District wise Key Government Official Posts) ----
const POSTS_DATA = [
  // Common Posts across all districts
  { district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P101", post_name: "District Collector" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P102", post_name: "Joint Collector" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P103", post_name: "District Revenue Officer" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P104", post_name: "Assistant Director, Survey & Land Records" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P105", post_name: "DPM, Disaster Management" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P106", post_name: "Forest Settlement Officer" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P107", post_name: "SDC KRRC" },
{ district_id: "ALL", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P108", post_name: "Superintendent of Police" },
{ district_id: "ALL", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P109", post_name: "Addl Superintendent of Police" },
{ district_id: "ALL", dept_id: "DEP03", department_name: "Panchayat Raj", post_id: "P110", post_name: "Chief Executive Officer, Zilla Parishad" },
{ district_id: "ALL", dept_id: "DEP03", department_name: "Panchayat Raj", post_id: "P111", post_name: "District Panchayat Officer" },
{ district_id: "ALL", dept_id: "DEP03", department_name: "Panchayat Raj", post_id: "P112", post_name: "District Swarna Gramam & Swarna Wardu Officer " },
{ district_id: "ALL", dept_id: "DEP03", department_name: "Panchayat Raj", post_id: "P113", post_name: "Project Director, DRDA" },
{ district_id: "ALL", dept_id: "DEP03", department_name: "Panchayat Raj", post_id: "P114", post_name: "Project Director, DWMA" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P115", post_name: "District BC Welfare & Empowerment Officer" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P116", post_name: "District Minority Welfare & Empowerment Officer" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P117", post_name: "District SC Welfare & Enpowerment Officer" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P118", post_name: "District Tribal Welfare & Empowerment Officer" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P119", post_name: "District Women and Child Welfare & Empowerment Officer" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P120", post_name: "District Youth Welfare & Empowerment Officer" },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P121", post_name: "Executive Director, BC Corpn " },
{ district_id: "ALL", dept_id: "DEP04", department_name: "Welfare Dept", post_id: "P122", post_name: "Executive Director,SC Corpn" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P123", post_name: "District Agricultural Officer" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P124", post_name: "District Animal Husbandry Officer" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P125", post_name: "District Co-Operative Officer" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P126", post_name: "District Fisheries Officer" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P127", post_name: "District Horticulture Officer" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P128", post_name: "District Manager AP Markfed" },
{ district_id: "ALL", dept_id: "DEP05", department_name: "Agriculture, Animal Husbandry & Cooperation", post_id: "P129", post_name: "District Sericulture Officer" },
{ district_id: "ALL", dept_id: "DEP06", department_name: "Civil Supplies", post_id: "P130", post_name: "District Civil Supply Officer" },
{ district_id: "ALL", dept_id: "DEP06", department_name: "Civil Supplies", post_id: "P131", post_name: "District Manager, Civil Supplies Corporation" },
{ district_id: "ALL", dept_id: "DEP07", department_name: "Education", post_id: "P132", post_name: "District Educational Officer" },
{ district_id: "ALL", dept_id: "DEP07", department_name: "Education", post_id: "P133", post_name: "District Intermediate Education Officer" },
{ district_id: "ALL", dept_id: "DEP07", department_name: "Education", post_id: "P134", post_name: "Addl Project Co-ordinator, Samagra Siksha" },
{ district_id: "ALL", dept_id: "DEP07", department_name: "Education", post_id: "P135", post_name: "Deputy Director, Adult Education" },
{ district_id: "ALL", dept_id: "DEP08", department_name: "Energy", post_id: "P136", post_name: "Superintending Engineer, APTRANSCO" },
{ district_id: "ALL", dept_id: "DEP08", department_name: "Energy", post_id: "P137", post_name: "District Manager, NREDCAP" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P138", post_name: "District Engineer Officer PR Engineering" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P139", post_name: "District Public Health Engineer Officer" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P140", post_name: "District RWS Engineer" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P141", post_name: "District Water Resources Officer, Irrigation" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P142", post_name: "EE, APEWIDC" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P143", post_name: "EE, APMSIDC" },
{ district_id: "ALL", dept_id: "DEP09", department_name: "Engineering Depts", post_id: "P144", post_name: "Superintending Engineer, R&B" },
{ district_id: "ALL", dept_id: "DEP10", department_name: "Health", post_id: "P145", post_name: "District Malaria Officer" },
{ district_id: "ALL", dept_id: "DEP10", department_name: "Health", post_id: "P146", post_name: "District Medical & Health Officer" },
{ district_id: "ALL", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P147", post_name: "Commissioner Municipality/Corporation" },
{ district_id: "ALL", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P148", post_name: "Vice Chairman, Urban Development Authority" },
{ district_id: "ALL", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P149", post_name: "Project Director, MEPMA" },
{ district_id: "ALL", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P150", post_name: "Project Officer, TIDCO" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P151", post_name: "Assistant Commissioner, Endowments" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P152", post_name: "Assistant Director, Handlooms & Textiles" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P153", post_name: "District Economics & Statistics Officer" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P154", post_name: "District Employment Officer" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P155", post_name: "District Forest Officer(T)" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P156", post_name: "District Ground Water Officer" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P157", post_name: "District Labour Officer" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P158", post_name: "District Transport Officer" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P159", post_name: "District Treasury Officer" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P160", post_name: "General Manager, Industries" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P161", post_name: "Inspector of Factories" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P162", post_name: "Project Director Housing" },
{ district_id: "ALL", dept_id: "DEP12", department_name: "Other Departments", post_id: "P163", post_name: "Project Director, AP Micro Irrigation Project" },
{ district_id: "ALL", dept_id: "DEP13", department_name: "Revenue Generating Depts", post_id: "P164", post_name: "AC/DC Commercial Taxes" },
{ district_id: "ALL", dept_id: "DEP13", department_name: "Revenue Generating Depts", post_id: "P165", post_name: "DD/AD Mines" },
{ district_id: "ALL", dept_id: "DEP13", department_name: "Revenue Generating Depts", post_id: "P166", post_name: "District Prohibition & Excise Officer" },
{ district_id: "ALL", dept_id: "DEP13", department_name: "Revenue Generating Depts", post_id: "P167", post_name: "District Registrar" },
{ district_id: "ALL", dept_id: "DEP14", department_name: "Youth, Tourism, Sports & Culture", post_id: "P168", post_name: "CEO, Society for Youth Training & Employment" },
{ district_id: "ALL", dept_id: "DEP14", department_name: "Youth, Tourism, Sports & Culture", post_id: "P169", post_name: "District Sports Development Officer" },
{ district_id: "ALL", dept_id: "DEP14", department_name: "Youth, Tourism, Sports & Culture", post_id: "P170", post_name: "District Tourism Officer" },

  // District-specific posts
  { district_id: "D01", dept_id: "DEP01", department_name: "Revenue", post_id: "P171", post_name: "Revenue Divisional Officer, Paderu" },
{ district_id: "D02", dept_id: "DEP01", department_name: "Revenue", post_id: "P172", post_name: "Revenue Divisional Officer, Adduroad Junction" },
{ district_id: "D02", dept_id: "DEP01", department_name: "Revenue", post_id: "P173", post_name: "Revenue Divisional Officer, Anakapalli" },
{ district_id: "D02", dept_id: "DEP01", department_name: "Revenue", post_id: "P174", post_name: "Revenue Divisional Officer, Narsipatnam" },
{ district_id: "D03", dept_id: "DEP01", department_name: "Revenue", post_id: "P175", post_name: "Revenue Divisional Officer, Anantapuramu" },
{ district_id: "D03", dept_id: "DEP01", department_name: "Revenue", post_id: "P176", post_name: "Revenue Divisional Officer, Guntakallu" },
{ district_id: "D03", dept_id: "DEP01", department_name: "Revenue", post_id: "P177", post_name: "Revenue Divisional Officer, Kalyandurgam" },
{ district_id: "D04", dept_id: "DEP01", department_name: "Revenue", post_id: "P178", post_name: "Sub Collector, Madanapalle" },
{ district_id: "D04", dept_id: "DEP01", department_name: "Revenue", post_id: "P179", post_name: "Revenue Divisional Officer, Pileru" },
{ district_id: "D04", dept_id: "DEP01", department_name: "Revenue", post_id: "P180", post_name: "Revenue Divisional Officer, Rayachoti" },
{ district_id: "D05", dept_id: "DEP01", department_name: "Revenue", post_id: "P181", post_name: "Revenue Divisional Officer, Bapatla" },
{ district_id: "D05", dept_id: "DEP01", department_name: "Revenue", post_id: "P182", post_name: "Revenue Divisional Officer, Chirala" },
{ district_id: "D05", dept_id: "DEP01", department_name: "Revenue", post_id: "P183", post_name: "Revenue Divisional Officer, Repalle" },
{ district_id: "D06", dept_id: "DEP01", department_name: "Revenue", post_id: "P184", post_name: "Revenue Divisional Officer, Chittoor" },
{ district_id: "D06", dept_id: "DEP01", department_name: "Revenue", post_id: "P185", post_name: "Revenue Divisional Officer, Kuppam" },
{ district_id: "D06", dept_id: "DEP01", department_name: "Revenue", post_id: "P186", post_name: "Revenue Divisional Officer, Nagari" },
{ district_id: "D06", dept_id: "DEP01", department_name: "Revenue", post_id: "P187", post_name: "Revenue Divisional Officer, Palamaner" },
{ district_id: "D12", dept_id: "DEP01", department_name: "Revenue", post_id: "P188", post_name: "Revenue Divisional Officer, Amalapuram" },
{ district_id: "D12", dept_id: "DEP01", department_name: "Revenue", post_id: "P189", post_name: "Revenue Divisional Officer, Kothapeta" },
{ district_id: "D12", dept_id: "DEP01", department_name: "Revenue", post_id: "P190", post_name: "Revenue Divisional Officer, Ramachandrapuram" },
{ district_id: "D07", dept_id: "DEP01", department_name: "Revenue", post_id: "P191", post_name: "Revenue Divisional Officer, Kovvur" },
{ district_id: "D07", dept_id: "DEP01", department_name: "Revenue", post_id: "P192", post_name: "Revenue Divisional Officer, Rajahmundry" },
{ district_id: "D08", dept_id: "DEP01", department_name: "Revenue", post_id: "P193", post_name: "Revenue Divisional Officer, Eluru" },
{ district_id: "D08", dept_id: "DEP01", department_name: "Revenue", post_id: "P194", post_name: "Revenue Divisional Officer, Jangareddygudem" },
{ district_id: "D08", dept_id: "DEP01", department_name: "Revenue", post_id: "P195", post_name: "Sub Collector, Nuzividu" },
{ district_id: "D09", dept_id: "DEP01", department_name: "Revenue", post_id: "P196", post_name: "Revenue Divisional Officer, Guntur" },
{ district_id: "D09", dept_id: "DEP01", department_name: "Revenue", post_id: "P197", post_name: "Revenue Divisional Officer, Tenali" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P198", post_name: "Revenue Divisional Officer, Badvel" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P199", post_name: "Revenue Divisional Officer, Jammalamadugu" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P200", post_name: "Revenue Divisional Officer, Kadapa" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P201", post_name: "Revenue Divisional Officer, Pulivendula" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P202", post_name: "Sub Collector, Rajampeta" },
{ district_id: "D11", dept_id: "DEP01", department_name: "Revenue", post_id: "P203", post_name: "Revenue Divisional Officer, Kakinada" },
{ district_id: "D11", dept_id: "DEP01", department_name: "Revenue", post_id: "P204", post_name: "Revenue Divisional Officer, Peddapuram" },
{ district_id: "D13", dept_id: "DEP01", department_name: "Revenue", post_id: "P205", post_name: "Revenue Divisional Officer, Gudivada" },
{ district_id: "D13", dept_id: "DEP01", department_name: "Revenue", post_id: "P206", post_name: "Revenue Divisional Officer, Machilipatnam" },
{ district_id: "D13", dept_id: "DEP01", department_name: "Revenue", post_id: "P207", post_name: "Revenue Divisional Officer, Vuyyuru" },
{ district_id: "D14", dept_id: "DEP01", department_name: "Revenue", post_id: "P208", post_name: "Revenue Divisional Officer, Adoni" },
{ district_id: "D14", dept_id: "DEP01", department_name: "Revenue", post_id: "P209", post_name: "Revenue Divisional Officer, Kurnool" },
{ district_id: "D14", dept_id: "DEP01", department_name: "Revenue", post_id: "P210", post_name: "Revenue Divisional Officer, Pattikonda" },
{ district_id: "D16", dept_id: "DEP01", department_name: "Revenue", post_id: "P211", post_name: "Revenue Divisional Officer, Kanigiri" },
{ district_id: "D16", dept_id: "DEP01", department_name: "Revenue", post_id: "P212", post_name: "Revenue Divisional Officer, Markapur" },
{ district_id: "D17", dept_id: "DEP01", department_name: "Revenue", post_id: "P213", post_name: "Revenue Divisional Officer, Atmakur" },
{ district_id: "D17", dept_id: "DEP01", department_name: "Revenue", post_id: "P214", post_name: "Revenue Divisional Officer, Banaganapalle" },
{ district_id: "D17", dept_id: "DEP01", department_name: "Revenue", post_id: "P215", post_name: "Revenue Divisional Officer, Dhone" },
{ district_id: "D17", dept_id: "DEP01", department_name: "Revenue", post_id: "P216", post_name: "Revenue Divisional Officer, Nandyala" },
{ district_id: "D18", dept_id: "DEP01", department_name: "Revenue", post_id: "P217", post_name: "Revenue Divisional Officer, Atmakur" },
{ district_id: "D18", dept_id: "DEP01", department_name: "Revenue", post_id: "P218", post_name: "Revenue Divisional Officer, Gudur" },
{ district_id: "D18", dept_id: "DEP01", department_name: "Revenue", post_id: "P219", post_name: "Revenue Divisional Officer, Kavali" },
{ district_id: "D18", dept_id: "DEP01", department_name: "Revenue", post_id: "P220", post_name: "Revenue Divisional Officer, Nellore" },
{ district_id: "D19", dept_id: "DEP01", department_name: "Revenue", post_id: "P221", post_name: "Revenue Divisional Officer, Nandigama" },
{ district_id: "D19", dept_id: "DEP01", department_name: "Revenue", post_id: "P222", post_name: "Revenue Divisional Officer, Tiruvuru" },
{ district_id: "D19", dept_id: "DEP01", department_name: "Revenue", post_id: "P223", post_name: "Revenue Divisional Officer, Vijayawada" },
{ district_id: "D20", dept_id: "DEP01", department_name: "Revenue", post_id: "P224", post_name: "Revenue Divisional Officer, Gurazala" },
{ district_id: "D20", dept_id: "DEP01", department_name: "Revenue", post_id: "P225", post_name: "Revenue Divisional Officer, Narasaraopet" },
{ district_id: "D20", dept_id: "DEP01", department_name: "Revenue", post_id: "P226", post_name: "Revenue Divisional Officer, Sattenapalle" },
{ district_id: "D15", dept_id: "DEP01", department_name: "Revenue", post_id: "P227", post_name: "Sub Collector, Palakonda" },
{ district_id: "D15", dept_id: "DEP01", department_name: "Revenue", post_id: "P228", post_name: "Sub Collector, Parvathipuram" },
{ district_id: "D21", dept_id: "DEP01", department_name: "Revenue", post_id: "P229", post_name: "Revenue Divisional Officer, Chinturu" },
{ district_id: "D21", dept_id: "DEP01", department_name: "Revenue", post_id: "P230", post_name: "Sub Collector, Rampachoodavaram" },
{ district_id: "D22", dept_id: "DEP01", department_name: "Revenue", post_id: "P231", post_name: "Revenue Divisional Officer, Addanki" },
{ district_id: "D22", dept_id: "DEP01", department_name: "Revenue", post_id: "P232", post_name: "Sub Collector, Kandukur" },
{ district_id: "D22", dept_id: "DEP01", department_name: "Revenue", post_id: "P233", post_name: "Revenue Divisional Officer, Ongole" },
{ district_id: "D24", dept_id: "DEP01", department_name: "Revenue", post_id: "P234", post_name: "Revenue Divisional Officer, Dharmavaram" },
{ district_id: "D24", dept_id: "DEP01", department_name: "Revenue", post_id: "P235", post_name: "Revenue Divisional Officer, Kadiri" },
{ district_id: "D24", dept_id: "DEP01", department_name: "Revenue", post_id: "P236", post_name: "Revenue Divisional Officer, Madakasira" },
{ district_id: "D24", dept_id: "DEP01", department_name: "Revenue", post_id: "P237", post_name: "Revenue Divisional Officer, Penukonda" },
{ district_id: "D24", dept_id: "DEP01", department_name: "Revenue", post_id: "P238", post_name: "Revenue Divisional Officer, Puttaparthi" },
{ district_id: "D23", dept_id: "DEP01", department_name: "Revenue", post_id: "P239", post_name: "Revenue Divisional Officer, Palasa" },
{ district_id: "D23", dept_id: "DEP01", department_name: "Revenue", post_id: "P240", post_name: "Revenue Divisional Officer, Srikakulam" },
{ district_id: "D23", dept_id: "DEP01", department_name: "Revenue", post_id: "P241", post_name: "Revenue Divisional Officer, Tekkali" },
{ district_id: "D25", dept_id: "DEP01", department_name: "Revenue", post_id: "P242", post_name: "Revenue Divisional Officer, Srikalahasti" },
{ district_id: "D25", dept_id: "DEP01", department_name: "Revenue", post_id: "P243", post_name: "Revenue Divisional Officer, Sulurupeta" },
{ district_id: "D25", dept_id: "DEP01", department_name: "Revenue", post_id: "P244", post_name: "Revenue Divisional Officer, Tirupati" },
{ district_id: "D26", dept_id: "DEP01", department_name: "Revenue", post_id: "P245", post_name: "Revenue Divisional Officer, Bheemunipatnam" },
{ district_id: "D26", dept_id: "DEP01", department_name: "Revenue", post_id: "P246", post_name: "Revenue Divisional Officer, Visakhapatnam" },
{ district_id: "D27", dept_id: "DEP01", department_name: "Revenue", post_id: "P247", post_name: "Revenue Divisional Officer, Bobbili" },
{ district_id: "D27", dept_id: "DEP01", department_name: "Revenue", post_id: "P248", post_name: "Revenue Divisional Officer, Cheepurupalli" },
{ district_id: "D27", dept_id: "DEP01", department_name: "Revenue", post_id: "P249", post_name: "Revenue Divisional Officer, Vizianagaram" },
{ district_id: "D28", dept_id: "DEP01", department_name: "Revenue", post_id: "P250", post_name: "Revenue Divisional Officer, Bhimavaram" },
{ district_id: "D28", dept_id: "DEP01", department_name: "Revenue", post_id: "P251", post_name: "Revenue Divisional Officer, Narasapuram" },
{ district_id: "D28", dept_id: "DEP01", department_name: "Revenue", post_id: "P252", post_name: "Revenue Divisional Officer, Tadepalligudem" }


];

// ---- CREDENTIALS JSON ----
const CREDENTIALS_DATA = [
{ district_id: "D01", user_id: "DM_101", password: "DKP@101" },
{ district_id: "D02", user_id: "DM_102", password: "DKP@102" },
{ district_id: "D03", user_id: "DM_103", password: "DKP@103" },
{ district_id: "D04", user_id: "DM_104", password: "DKP@104" },
{ district_id: "D05", user_id: "DM_105", password: "DKP@105" },
{ district_id: "D06", user_id: "DM_106", password: "DKP@106" },
{ district_id: "D07", user_id: "DM_107", password: "DKP@107" },
{ district_id: "D08", user_id: "DM_108", password: "DKP@108" },
{ district_id: "D09", user_id: "DM_109", password: "DKP@109" },
{ district_id: "D10", user_id: "DM_110", password: "DKP@110" },
{ district_id: "D11", user_id: "DM_111", password: "DKP@111" },
{ district_id: "D12", user_id: "DM_112", password: "DKP@112" },
{ district_id: "D13", user_id: "DM_113", password: "DKP@113" },
{ district_id: "D14", user_id: "DM_114", password: "DKP@114" },
{ district_id: "D15", user_id: "DM_115", password: "DKP@115" },
{ district_id: "D16", user_id: "DM_116", password: "DKP@116" },
{ district_id: "D17", user_id: "DM_117", password: "DKP@117" },
{ district_id: "D18", user_id: "DM_118", password: "DKP@118" },
{ district_id: "D19", user_id: "DM_119", password: "DKP@119" },
{ district_id: "D20", user_id: "DM_120", password: "DKP@120" },
{ district_id: "D21", user_id: "DM_121", password: "DKP@121" },
{ district_id: "D22", user_id: "DM_122", password: "DKP@122" },
{ district_id: "D23", user_id: "DM_123", password: "DKP@123" },
{ district_id: "D24", user_id: "DM_124", password: "DKP@124" },
{ district_id: "D25", user_id: "DM_125", password: "DKP@125" },
{ district_id: "D26", user_id: "DM_126", password: "DKP@126" },
{ district_id: "D27", user_id: "DM_127", password: "DKP@127" },
{ district_id: "D28", user_id: "DM_128", password: "DKP@128" },

  // Admin credentials
  { district_id: "ADMIN", user_id: "ADMIN", password: "Admin@AP2026" }
];

// ---- GOOGLE APPS SCRIPT WEB APP URL ----
// IMPORTANT: Replace this with your deployed Apps Script Web App URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8hUNLBqYi_3CHjcviIkIYe0ycvKnfUYkhsc9iqHW66Z6q9KkNyc9uqbAp9g0mupWM/exec";

// ============================================================
// Helper: Get posts for a district (common + district-specific)
// ============================================================
function getPostsForDistrict(districtId) {
  return POSTS_DATA.filter(p => p.district_id === "ALL" || p.district_id === districtId)
    .map((p, idx) => ({ ...p, sl_no: idx + 1 }));
}

// ============================================================
// Google Sheets API calls via Apps Script
// ============================================================

function showLoadingPopup(message = "Loading data, please wait...") {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.querySelector(".loading-message").textContent = message;
    overlay.style.display = "flex";
  }
}

function hideLoadingPopup() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.style.display = "none";
}

async function saveRowToSheet(sheetName, rowData) {
  const payload = {
    action: "saveRow",
    sheet: sheetName,
    data: rowData
  };
  const resp = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return resp.json();
}

async function getSheetData(sheetName) {
  const url = `${APPS_SCRIPT_URL}?action=getSheet&sheet=${encodeURIComponent(sheetName)}`;
  const resp = await fetch(url);
  return resp.json();
}

async function getAllDistrictsSummary() {
  const url = `${APPS_SCRIPT_URL}?action=getSummary`;
  const resp = await fetch(url);
  return resp.json();
}

// Parallel fetch for all districts (Admin dashboard)
async function fetchAllDistrictsParallel() {
  const promises = DISTRICTS_DATA.map(d => {
    const url = `${APPS_SCRIPT_URL}?action=getSheet&sheet=${encodeURIComponent(d.user_id || d.district_id)}`;
    return fetch(url).then(r => r.json()).then(data => ({ districtId: d.district_id, data })).catch(() => ({ districtId: d.district_id, data: [] }));
  });
  return Promise.all(promises);
}

// ============================================================
// Auth helpers
// ============================================================
function authenticate(userId, password) {
  const cred = CREDENTIALS_DATA.find(c => c.user_id === userId.toUpperCase() && c.password === password);
  return cred || null;
}

function getDistrictByUserId(userId) {
  const cred = CREDENTIALS_DATA.find(c => c.user_id === userId.toUpperCase());
  if (!cred) return null;
  return DISTRICTS_DATA.find(d => d.district_id === cred.district_id) || null;
}

// ============================================================
// Validation helpers
// ============================================================
function validateName(name) {
  return /^[A-Za-z\s.]+$/.test(name.trim());
}
function validateCFMSID(id) {
  return /^\d{8}$/.test(id.trim());
}
function validateContact(no) {
  return /^\d{10}$/.test(no.trim());
}
