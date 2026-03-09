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
  
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P102", post_name: "Joint Collector" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P103", post_name: "District Revenue Officer" },
{ district_id: "D01", dept_id: "DEP15", department_name: "ITDA", post_id: "P390" , post_name: "PO ITDA, Paderu"},
{ district_id: "D21", dept_id: "DEP15", department_name: "ITDA", post_id: "P391" , post_name: "PO ITDA, Rampachodavaram "},
{ district_id: "D15", dept_id: "DEP15", department_name: "ITDA", post_id: "P392" , post_name: "PO ITDA, Parvathipuram"},
{ district_id: "D23", dept_id: "DEP15", department_name: "ITDA", post_id: "P393" , post_name: "PO ITDA, Seethampeta "},
{ district_id: "D28", dept_id: "DEP15", department_name: "ITDA", post_id: "P394" , post_name: "PO ITDA, Kota Rama Chandrapuram "},
{ district_id: "D04", dept_id: "DEP01", department_name: "Revenue", post_id: "P178", post_name: "Sub Collector, Madanapalle" },
{ district_id: "D08", dept_id: "DEP01", department_name: "Revenue", post_id: "P195", post_name: "Sub Collector, Nuzividu" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P202", post_name: "Sub Collector, Rajampeta" },
{ district_id: "D15", dept_id: "DEP01", department_name: "Revenue", post_id: "P227", post_name: "Sub Collector, Palakonda" },
{ district_id: "D15", dept_id: "DEP01", department_name: "Revenue", post_id: "P228", post_name: "Sub Collector, Parvathipuram" },
{ district_id: "D21", dept_id: "DEP01", department_name: "Revenue", post_id: "P230", post_name: "Sub Collector, Rampachoodavaram" },
{ district_id: "D22", dept_id: "DEP01", department_name: "Revenue", post_id: "P232", post_name: "Sub Collector, Kandukur" },
{ district_id: "D01", dept_id: "DEP01", department_name: "Revenue", post_id: "P171", post_name: "Revenue Divisional Officer, Paderu" },
{ district_id: "D02", dept_id: "DEP01", department_name: "Revenue", post_id: "P172", post_name: "Revenue Divisional Officer, Adduroad Junction" },
{ district_id: "D02", dept_id: "DEP01", department_name: "Revenue", post_id: "P173", post_name: "Revenue Divisional Officer, Anakapalli" },
{ district_id: "D02", dept_id: "DEP01", department_name: "Revenue", post_id: "P174", post_name: "Revenue Divisional Officer, Narsipatnam" },
{ district_id: "D03", dept_id: "DEP01", department_name: "Revenue", post_id: "P175", post_name: "Revenue Divisional Officer, Anantapuramu" },
{ district_id: "D03", dept_id: "DEP01", department_name: "Revenue", post_id: "P176", post_name: "Revenue Divisional Officer, Guntakallu" },
{ district_id: "D03", dept_id: "DEP01", department_name: "Revenue", post_id: "P177", post_name: "Revenue Divisional Officer, Kalyandurgam" },
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
{ district_id: "D09", dept_id: "DEP01", department_name: "Revenue", post_id: "P196", post_name: "Revenue Divisional Officer, Guntur" },
{ district_id: "D09", dept_id: "DEP01", department_name: "Revenue", post_id: "P197", post_name: "Revenue Divisional Officer, Tenali" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P198", post_name: "Revenue Divisional Officer, Badvel" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P199", post_name: "Revenue Divisional Officer, Jammalamadugu" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P200", post_name: "Revenue Divisional Officer, Kadapa" },
{ district_id: "D10", dept_id: "DEP01", department_name: "Revenue", post_id: "P201", post_name: "Revenue Divisional Officer, Pulivendula" },
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
{ district_id: "D21", dept_id: "DEP01", department_name: "Revenue", post_id: "P229", post_name: "Revenue Divisional Officer, Chinturu" },
{ district_id: "D22", dept_id: "DEP01", department_name: "Revenue", post_id: "P231", post_name: "Revenue Divisional Officer, Addanki" },
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
{ district_id: "D28", dept_id: "DEP01", department_name: "Revenue", post_id: "P252", post_name: "Revenue Divisional Officer, Tadepalligudem" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P104", post_name: "Assistant Director, Survey & Land Records" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P105", post_name: "DPM, Disaster Management" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P106", post_name: "Forest Settlement Officer" },
{ district_id: "ALL", dept_id: "DEP01", department_name: "Revenue", post_id: "P107", post_name: "SDC KRRC" },
{ district_id: "ALL", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P108", post_name: "Superintendent of Police" },
{ district_id: "ALL", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P109", post_name: "Addl Superintendent of Police" },
{ district_id: "D01", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P395", post_name: "Dy.S.P, Paderu" },
{ district_id: "D21", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P396", post_name: "Dy.S.P, Rampachodavaram" },
{ district_id: "D02", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P397", post_name: "Dy.S.P, Anakapalli" },
{ district_id: "D02", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P398", post_name: "Dy.S.P, Narsipatnam" },
{ district_id: "D02", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P399", post_name: "Dy.S.P, Parawada" },
{ district_id: "D03", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P400", post_name: "Dy.S.P, Anantapur" },
{ district_id: "D03", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P401", post_name: "Dy.S.P, Gooty" },
{ district_id: "D03", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P402", post_name: "Dy.S.P, Kalyandurg" },
{ district_id: "D04", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P403", post_name: "Dy.S.P, Madanapalle" },
{ district_id: "D04", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P404", post_name: "Dy.S.P, Rayachoti" },
{ district_id: "D04", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P405", post_name: "Dy.S.P, Rajampet" },
{ district_id: "D05", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P406", post_name: "Dy.S.P, Bapatla" },
{ district_id: "D05", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P407", post_name: "Dy.S.P, Chirala" },
{ district_id: "D05", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P408", post_name: "Dy.S.P, Repalle" },
{ district_id: "D06", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P409", post_name: "Dy.S.P, Chittoor" },
{ district_id: "D06", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P410", post_name: "Dy.S.P, Palamaner" },
{ district_id: "D06", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P411", post_name: "Dy.S.P, Punganur" },
{ district_id: "D07", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P412", post_name: "Dy.S.P, Rajahmundry" },
{ district_id: "D07", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P413", post_name: "Dy.S.P, Kovvur" },
{ district_id: "D07", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P414", post_name: "Dy.S.P, Kadiyam" },
{ district_id: "D08", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P415", post_name: "Dy.S.P, Eluru" },
{ district_id: "D08", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P416", post_name: "Dy.S.P, Jangareddygudem" },
{ district_id: "D08", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P417", post_name: "Dy.S.P, Nuzvid" },
{ district_id: "D09", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P418", post_name: "Dy.S.P, Guntur" },
{ district_id: "D09", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P419", post_name: "Dy.S.P, Tenali" },
{ district_id: "D09", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P420", post_name: "Dy.S.P, Mangalagiri" },
{ district_id: "D10", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P421", post_name: "Dy.S.P, Kadapa" },
{ district_id: "D10", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P422", post_name: "Dy.S.P, Proddatur" },
{ district_id: "D10", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P423", post_name: "Dy.S.P, Jammalamadugu" },
{ district_id: "D11", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P424", post_name: "Dy.S.P, Kakinada" },
{ district_id: "D11", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P425", post_name: "Dy.S.P, Peddapuram" },
{ district_id: "D11", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P426", post_name: "Dy.S.P, Tuni" },
{ district_id: "D12", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P427", post_name: "Dy.S.P, Amalapuram" },
{ district_id: "D12", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P428", post_name: "Dy.S.P, Ramachandrapuram" },
{ district_id: "D13", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P429", post_name: "Dy.S.P, Machilipatnam" },
{ district_id: "D13", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P430", post_name: "Dy.S.P, Gudivada" },
{ district_id: "D13", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P431", post_name: "Dy.S.P, Avanigadda" },
{ district_id: "D14", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P432", post_name: "Dy.S.P, Kurnool" },
{ district_id: "D14", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P433", post_name: "Dy.S.P, Adoni" },
{ district_id: "D14", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P434", post_name: "Dy.S.P, Pattikonda" },
{ district_id: "D15", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P435", post_name: "Dy.S.P, Parvathipuram" },
{ district_id: "D15", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P436", post_name: "Dy.S.P, Salur" },
{ district_id: "D18", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P437", post_name: "Dy.S.P, Nellore" },
{ district_id: "D18", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P438", post_name: "Dy.S.P, Kavali" },
{ district_id: "D18", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P439", post_name: "Dy.S.P, Gudur" },
{ district_id: "D19", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P440", post_name: "Dy.S.P, Tiruvuru" },
{ district_id: "D19", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P441", post_name: "Dy.S.P, Jaggaiahpet" },
{ district_id: "D19", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P442", post_name: "Dy.S.P, Nandigama" },
{ district_id: "D20", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P443", post_name: "Dy.S.P, Narasaraopet" },
{ district_id: "D20", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P444", post_name: "Dy.S.P, Sattenapalli" },
{ district_id: "D20", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P445", post_name: "Dy.S.P, Gurazala" },
{ district_id: "D23", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P446", post_name: "Dy.S.P, Srikakulam" },
{ district_id: "D23", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P447", post_name: "Dy.S.P, Tekkali" },
{ district_id: "D23", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P448", post_name: "Dy.S.P, Palasa" },
{ district_id: "D24", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P449", post_name: "Dy.S.P, Puttaparthi" },
{ district_id: "D24", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P450", post_name: "Dy.S.P, Dharmavaram" },
{ district_id: "D25", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P451", post_name: "Dy.S.P, Tirupati" },
{ district_id: "D25", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P452", post_name: "Dy.S.P, Srikalahasti" },
{ district_id: "D26", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P453", post_name: "Dy.S.P, Bheemunipatnam" },
{ district_id: "D26", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P454", post_name: "Dy.S.P, Gajuwaka" },
{ district_id: "D26", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P455", post_name: "Dy.S.P, Pendurthi" },
{ district_id: "D27", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P456", post_name: "Dy.S.P, Vizianagaram" },
{ district_id: "D27", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P457", post_name: "Dy.S.P, Bobbili" },
{ district_id: "D27", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P458", post_name: "Dy.S.P, Cheepurupalli" },
{ district_id: "D28", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P459", post_name: "Dy.S.P, Bhimavaram" },
{ district_id: "D28", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P460", post_name: "Dy.S.P, Tadepalligudem" },
{ district_id: "D28", dept_id: "DEP02", department_name: "Home (Law & Order)", post_id: "P461", post_name: "Dy.S.P, Narsapur" },
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
{ district_id: "D02", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P253" , post_name: "Municipal Commissioner, Narsipatnam Municipality "},
{ district_id: "D02", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P254" , post_name: "Municipal Commissioner, Yelamanchili Municipality "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P255" , post_name: "Municipal Commissioner, Anantapur Municipal Corporation "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P256" , post_name: "Municipal Commissioner, Gooty Municipality "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P257" , post_name: "Municipal Commissioner, Guntakal Municipality "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P258" , post_name: "Municipal Commissioner, Kalyanadurgam Municipality "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P259" , post_name: "Municipal Commissioner, Pamidi Municipality "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P260" , post_name: "Municipal Commissioner, Rayadurg Municipality "},
{ district_id: "D03", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P261" , post_name: "Municipal Commissioner, Tadipatri Municipality "},
{ district_id: "D04", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P262" , post_name: "Municipal Commissioner, Madanapalle Municipality "},
{ district_id: "D04", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P263" , post_name: "Municipal Commissioner, Rajampet Municipality "},
{ district_id: "D04", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P264" , post_name: "Municipal Commissioner, Rayachoty Municipality "},
{ district_id: "D04", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P265" , post_name: "Municipal Commissioner, B.Kothakota Municipality "},
{ district_id: "D04", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P266" , post_name: "Vice Chairman, Annamayya Urban Development Authority "},
{ district_id: "D05", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P267" , post_name: "Municipal Commissioner, Bapatla Municipality "},
{ district_id: "D05", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P268" , post_name: "Municipal Commissioner, Chirala Municipality "},
{ district_id: "D05", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P269" , post_name: "Municipal Commissioner, Repalle Municipality "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P270" , post_name: "Municipal Commissioner, Chittoor Municipal Corporation "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P271" , post_name: "Municipal Commissioner, Nagari Municipality "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P272" , post_name: "Municipal Commissioner, Palamaner Municipality "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P273" , post_name: "Municipal Commissioner, Punganur Municipality "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P274" , post_name: "Municipal Commissioner, Kuppam Municipality "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P275" , post_name: "Vice Chairman, Chittoor Urban Development Authority "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P276" , post_name: "Vice Chairman, Palamaner Kuppam Madanapalle Urban Development Authority "},
{ district_id: "D06", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P277" , post_name: "Municipal Commissioner, Kuppam Area Development Authority "},
{ district_id: "D07", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P278" , post_name: "Municipal Commissioner, Kovvur Municipality "},
{ district_id: "D07", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P279" , post_name: "Municipal Commissioner, Mandapet Municipality "},
{ district_id: "D07", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P280" , post_name: "Municipal Commissioner, Nidadavole Municipality "},
{ district_id: "D07", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P281" , post_name: "Municipal Commissioner, Rajamahendravaram Municipal Corporation "},
{ district_id: "D07", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P282" , post_name: "Vice Chairman, Rajamahendravaram Urban Development Authority "},
{ district_id: "D08", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P283" , post_name: "Municipal Commissioner, Eluru Municipal Corporation "},
{ district_id: "D08", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P284" , post_name: "Municipal Commissioner, Jangareddygudem Municipality "},
{ district_id: "D08", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P285" , post_name: "Municipal Commissioner, Nuzividu Municipality "},
{ district_id: "D08", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P286" , post_name: "Municipal Commissioner, Chintalapudi Municipality "},
{ district_id: "D08", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P287" , post_name: "Vice Chairman,Eluru Urban Development Authority (EUDA) "},
{ district_id: "D09", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P288" , post_name: "Municipal Commissioner, Guntur Municipal Corporation "},
{ district_id: "D09", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P289" , post_name: "Municipal Commissioner, Mangalagiri Municipality "},
{ district_id: "D09", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P290" , post_name: "Municipal Commissioner, Ponnur Municipality "},
{ district_id: "D09", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P291" , post_name: "Municipal Commissioner, Tadepalli Municipality "},
{ district_id: "D09", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P292" , post_name: "Municipal Commissioner, Tenali Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P293" , post_name: "Municipal Commissioner, Budwel Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P294" , post_name: "Municipal Commissioner, Jammalamadugu Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P295" , post_name: "Municipal Commissioner, Kadapa Municipal Corporation "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P296" , post_name: "Municipal Commissioner, Mydukur Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P297" , post_name: "Municipal Commissioner, Pulivendula Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P298" , post_name: "Municipal Commissioner, Proddatur Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P299" , post_name: "Municipal Commissioner, Yerraguntla Municipality "},
{ district_id: "D10", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P300" , post_name: "Municipal Commissioner, Kamalapuram Nagar Panchayat "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P301" , post_name: "Municipal Commissioner, Gollaprolu Municipality "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P302" , post_name: "Municipal Commissioner, Kakinada Municipal Corporation "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P303" , post_name: "Municipal Commissioner, Peddapuram Municipality "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P304" , post_name: "Municipal Commissioner, Pithapuram Municipality "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P305" , post_name: "Municipal Commissioner, Samalkot Municipality "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P306" , post_name: "Municipal Commissioner, Tuni Municipality "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P307" , post_name: "Municipal Commissioner, Yeleswaram Municipality "},
{ district_id: "D11", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P308" , post_name: "Vice Chairman,Kakinada Urban Development Authority "},
{ district_id: "D12", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P309" , post_name: "Municipal Commissioner, Amalapuram Municipality "},
{ district_id: "D12", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P310" , post_name: "Municipal Commissioner, Mummidivaram Municipality "},
{ district_id: "D12", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P311" , post_name: "Municipal Commissioner, Ramachandrapuram Municipality "},
{ district_id: "D13", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P312" , post_name: "Municipal Commissioner, Gudivada Municipality "},
{ district_id: "D13", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P313" , post_name: "Municipal Commissioner, Machilipatnam Municipality "},
{ district_id: "D13", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P314" , post_name: "Municipal Commissioner, Pedana Municipality "},
{ district_id: "D13", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P315" , post_name: "Municipal Commissioner, Vuyyuru Municipality "},
{ district_id: "D13", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P316" , post_name: "Vice Chairman, Machilipatnam Urban Development Authority "},
{ district_id: "D14", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P317" , post_name: "Municipal Commissioner, Adoni Municipality "},
{ district_id: "D14", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P318" , post_name: "Municipal Commissioner, Gudur Kurnool Municipality "},
{ district_id: "D14", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P319" , post_name: "Municipal Commissioner, Kurnool Municipal Corporation "},
{ district_id: "D14", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P320" , post_name: "Municipal Commissioner, Yemmiganur Municipality "},
{ district_id: "D14", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P321" , post_name: "Vice Chairman,Kurnool Urban Development Authority "},
{ district_id: "D15", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P322" , post_name: "Municipal Commissioner, Palakonda Municipality "},
{ district_id: "D15", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P323" , post_name: "Municipal Commissioner, Parvathipuram Municipality "},
{ district_id: "D15", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P324" , post_name: "Municipal Commissioner, Saluru Municipality "},
{ district_id: "D17", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P325" , post_name: "Municipal Commissioner, Allagadda Municipality "},
{ district_id: "D17", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P326" , post_name: "Municipal Commissioner, Atmakur Kurnool Municipality "},
{ district_id: "D17", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P327" , post_name: "Municipal Commissioner, Dhone Municipality "},
{ district_id: "D17", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P328" , post_name: "Municipal Commissioner, Nandikotkur Municipality "},
{ district_id: "D17", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P329" , post_name: "Municipal Commissioner, Nandyal Municipality "},
{ district_id: "D18", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P330" , post_name: "Municipal Commissioner, Atmakur Nellore Municipality "},
{ district_id: "D18", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P331" , post_name: "Municipal Commissioner, Gudur Nellore Municipality "},
{ district_id: "D18", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P332" , post_name: "Municipal Commissioner, Kavali Municipality "},
{ district_id: "D18", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P333" , post_name: "Municipal Commissioner, Nellore Municipal Corporation "},
{ district_id: "D18", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P334" , post_name: "Municipal Commissioner, Alluru Municipality "},
{ district_id: "D18", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P335" , post_name: "Vice Chairman, Nellore Urban Development Authority "},
{ district_id: "D19", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P336" , post_name: "Municipal Commissioner, Jaggaiahpet Municipality "},
{ district_id: "D19", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P337" , post_name: "Municipal Commissioner, Nandigama Municipality "},
{ district_id: "D19", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P338" , post_name: "Municipal Commissioner, Tiruvuru Municipality "},
{ district_id: "D19", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P339" , post_name: "Municipal Commissioner, Vijayawada Municipal Corporation "},
{ district_id: "D19", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P340" , post_name: "Municipal Commissioner, YSR Tadigadapa Municipality "},
{ district_id: "D19", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P341" , post_name: "Municipal Commissioner, Kondapalli Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P342" , post_name: "Municipal Commissioner, Chilakaluripet Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P343" , post_name: "Municipal Commissioner, Macherla Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P344" , post_name: "Municipal Commissioner, Narasaraopet Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P345" , post_name: "Municipal Commissioner, Piduguralla Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P346" , post_name: "Municipal Commissioner, Sattenapalle Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P347" , post_name: "Municipal Commissioner, Vinukonda Municipality "},
{ district_id: "D20", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P348" , post_name: "Municipal Commissioner, Dachepalli Nagar Panchayat "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P349" , post_name: "Municipal Commissioner, Addanki Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P350" , post_name: "Municipal Commissioner, Cheemakurthy Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P351" , post_name: "Municipal Commissioner, Giddalur Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P352" , post_name: "Municipal Commissioner, Kanigiri Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P353" , post_name: "Municipal Commissioner, Kandukur Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P354" , post_name: "Municipal Commissioner, Markapur Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P355" , post_name: "Municipal Commissioner, Ongole Municipal Corporation "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P356" , post_name: "Municipal Commissioner, Podili Municipality "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P357" , post_name: "Municipal Commissioner, Darsi Nagar Panchayat "},
{ district_id: "D22", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P358" , post_name: "Vice Chairman, Ongole Urban Development Authority "},
{ district_id: "D23", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P359" , post_name: "Municipal Commissioner, Amudalavalasa Municipality "},
{ district_id: "D23", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P360" , post_name: "Municipal Commissioner, Ichapuram Municipality "},
{ district_id: "D23", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P361" , post_name: "Municipal Commissioner, Palasakasibugga Municipality "},
{ district_id: "D23", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P362" , post_name: "Municipal Commissioner, Rajam Municipality "},
{ district_id: "D23", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P363" , post_name: "Municipal Commissioner, Srikakulam Municipal Corporation "},
{ district_id: "D23", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P364" , post_name: "Vice Chairman, Srikakulam Urban Development Authority "},
{ district_id: "D24", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P365" , post_name: "Municipal Commissioner, Dharmavaram Municipality "},
{ district_id: "D24", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P366" , post_name: "Municipal Commissioner, Hindupur Municipality "},
{ district_id: "D24", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P367" , post_name: "Municipal Commissioner, Kadiri Municipality "},
{ district_id: "D24", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P368" , post_name: "Municipal Commissioner, Madakasira Municipality "},
{ district_id: "D24", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P369" , post_name: "Municipal Commissioner, Puttaparthy Municipality "},
{ district_id: "D24", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P370" , post_name: "Vice Chairman, Anantapur Hindupur Urban Development Authority "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P371" , post_name: "Municipal Commissioner, Naidupet Municipality "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P372" , post_name: "Municipal Commissioner, Puttur Municipality "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P373" , post_name: "Municipal Commissioner, Srikalahasti Municipality "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P374" , post_name: "Municipal Commissioner, Sullurpeta Municipality "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P375" , post_name: "Municipal Commissioner, Tirupati Municipal Corporation "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P376" , post_name: "Municipal Commissioner, Venkatagiri Municipality "},
{ district_id: "D25", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P377" , post_name: "Vice Chairman, Tirupati Urban Development Authority "},
{ district_id: "D26", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P378" , post_name: "Municipal Commissioner, Greater Visakhapatnam Municipal Corporation "},
{ district_id: "D26", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P379" , post_name: "Vice Chairman, Visakhapatnam Urban Development Authority "},
{ district_id: "D27", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P380" , post_name: "Municipal Commissioner, Bobbili Municipality "},
{ district_id: "D27", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P381" , post_name: "Municipal Commissioner, Nellimarla Municipality "},
{ district_id: "D27", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P382" , post_name: "Municipal Commissioner, Vijayanagaram Municipality "},
{ district_id: "D27", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P383" , post_name: "Vice Chairman, Bobbili Urban Development Authority "},
{ district_id: "D28", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P384" , post_name: "Municipal Commissioner, Bhimavaram Municipality "},
{ district_id: "D28", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P385" , post_name: "Municipal Commissioner, Narasapur Municipality "},
{ district_id: "D28", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P386" , post_name: "Municipal Commissioner, Palakol Municipality "},
{ district_id: "D28", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P387" , post_name: "Municipal Commissioner, Tadepalligudem Municipality "},
{ district_id: "D28", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P388" , post_name: "Municipal Commissioner, Tanuku Municipality "},
{ district_id: "D28", dept_id: "DEP11", department_name: "Municipal Administration", post_id: "P389" , post_name: "Municipal Commissioner, Akiveedu Nagar Panchayat "},
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
{ district_id: "ALL", dept_id: "DEP14", department_name: "Youth, Tourism, Sports & Culture", post_id: "P170", post_name: "District Tourism Officer" }

  // District-specific posts
  


];

// ---- CREDENTIALS JSON ----
const CREDENTIALS_DATA = [
{ district_id: "D01", user_id: "DM_ASR_101", password: "ASR@101" },
{ district_id: "D02", user_id: "DM_AKP_102", password: "AKP@102" },
{ district_id: "D03", user_id: "DM_ANP_103", password: "ANP@103" },
{ district_id: "D04", user_id: "DM_ANM_104", password: "ANM@104" },
{ district_id: "D05", user_id: "DM_BPT_105", password: "BPT@105" },
{ district_id: "D06", user_id: "DM_CTR_106", password: "CTR@106" },
{ district_id: "D07", user_id: "DM_EGD_107", password: "EGD@107" },
{ district_id: "D08", user_id: "DM_ELR_108", password: "ELR@108" },
{ district_id: "D09", user_id: "DM_GNT_109", password: "GNT@109" },
{ district_id: "D10", user_id: "DM_KDP_110", password: "KDP@110" },
{ district_id: "D11", user_id: "DM_KKD_111", password: "KKD@111" },
{ district_id: "D12", user_id: "DM_KNS_112", password: "KNS@112" },
{ district_id: "D13", user_id: "DM_KRS_113", password: "KRS@113" },
{ district_id: "D14", user_id: "DM_KNL_114", password: "KNL@114" },
{ district_id: "D15", user_id: "DM_PVM_115", password: "PVM@115" },
{ district_id: "D16", user_id: "DM_MKP_116", password: "MKP@116" },
{ district_id: "D17", user_id: "DM_NDL_117", password: "NDL@117" },
{ district_id: "D18", user_id: "DM_NLR_118", password: "NLR@118" },
{ district_id: "D19", user_id: "DM_NTR_119", password: "NTR@119" },
{ district_id: "D20", user_id: "DM_PLN_120", password: "PLN@120" },
{ district_id: "D21", user_id: "DM_PLV_121", password: "PLV@121" },
{ district_id: "D22", user_id: "DM_PKM_122", password: "PKM@122" },
{ district_id: "D23", user_id: "DM_SKL_123", password: "SKL@123" },
{ district_id: "D24", user_id: "DM_SSS_124", password: "SSS@124" },
{ district_id: "D25", user_id: "DM_TPT_125", password: "TPT@125" },
{ district_id: "D26", user_id: "DM_VSK_126", password: "VSK@126" },
{ district_id: "D27", user_id: "DM_VZM_127", password: "VZM@127" },
{ district_id: "D28", user_id: "DM_WGD_128", password: "WGD@128" },

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
