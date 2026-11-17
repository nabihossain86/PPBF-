#!/usr/bin/env python3
import json
import os

print("Starting generation of PPBF Desktop and Mobile applications...")

# 1. Load the base64 logo
with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

# 2. Prepare seed data
import build_files
INVESTMENTS_DATA = build_files.INVESTMENTS_DATA

MEMBERS_DATA = [
    {
        "id": "M-01",
        "name": "Alhaj Mohammad Harun",
        "name_bn": "আলহাজ্ব মোহাম্মদ হারুন",
        "mobile": "01812-112233",
        "nid": "197522145600001",
        "join_date": "2022-10-01",
        "designation": "President",
        "monthly_share": 3000,
        "total_savings": 145000,
        "shares": 10,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali, Cox's Bazar",
        "photo_key": "mem_01"
    },
    {
        "id": "M-02",
        "name": "Md. Nurul Absar",
        "name_bn": "মোঃ নুরুল আবছার",
        "mobile": "01813-223344",
        "nid": "198222145600002",
        "join_date": "2022-10-01",
        "designation": "General Secretary",
        "monthly_share": 2500,
        "total_savings": 122000,
        "shares": 8,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali, Cox's Bazar",
        "photo_key": "mem_02"
    },
    {
        "id": "M-03",
        "name": "Nabi Hossain",
        "name_bn": "নবী হোসেন",
        "mobile": "01814-334455",
        "nid": "198622145600003",
        "join_date": "2022-10-01",
        "designation": "Finance Secretary",
        "monthly_share": 2500,
        "total_savings": 125000,
        "shares": 8,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali, Cox's Bazar",
        "photo_key": "mem_03"
    },
    {
        "id": "M-04",
        "name": "Master Abdul Hakim",
        "name_bn": "মাস্টার আব্দুল হাকিম",
        "mobile": "01815-445566",
        "nid": "197822145600004",
        "join_date": "2022-10-01",
        "designation": "Vice President",
        "monthly_share": 2000,
        "total_savings": 98000,
        "shares": 6,
        "status": "ACTIVE",
        "address": "South Parania Para, P.M. Khali",
        "photo_key": "mem_04"
    },
    {
        "id": "M-05",
        "name": "Didarul Alam",
        "name_bn": "দিদারুল আলম",
        "mobile": "01816-556677",
        "nid": "198922145600005",
        "join_date": "2022-11-15",
        "designation": "Organizing Secretary",
        "monthly_share": 2000,
        "total_savings": 92000,
        "shares": 6,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali, Cox's Bazar",
        "photo_key": "mem_05"
    },
    {
        "id": "M-06",
        "name": "Faridul Alam",
        "name_bn": "ফরিদুল আলম",
        "mobile": "01817-667788",
        "nid": "198422145600006",
        "join_date": "2022-12-01",
        "designation": "Executive Member",
        "monthly_share": 1500,
        "total_savings": 72000,
        "shares": 5,
        "status": "ACTIVE",
        "address": "East Parania Para, P.M. Khali",
        "photo_key": "mem_06"
    },
    {
        "id": "M-07",
        "name": "Mohammad Elias",
        "name_bn": "মোহাম্মদ ইলিয়াস",
        "mobile": "01818-778899",
        "nid": "199122145600007",
        "join_date": "2023-01-05",
        "designation": "General Member",
        "monthly_share": 1500,
        "total_savings": 66000,
        "shares": 4,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali, Cox's Bazar",
        "photo_key": "mem_07"
    },
    {
        "id": "M-08",
        "name": "Kamal Hossain",
        "name_bn": "কামাল হোসেন",
        "mobile": "01819-889900",
        "nid": "198722145600008",
        "join_date": "2023-01-15",
        "designation": "General Member",
        "monthly_share": 1500,
        "total_savings": 64500,
        "shares": 4,
        "status": "ACTIVE",
        "address": "Bazar Road, P.M. Khali, Cox's Bazar",
        "photo_key": "mem_08"
    },
    {
        "id": "M-09",
        "name": "Jahangir Alam",
        "name_bn": "জাহাঙ্গীর আলম",
        "mobile": "01820-990011",
        "nid": "198322145600009",
        "join_date": "2023-02-01",
        "designation": "General Member",
        "monthly_share": 1500,
        "total_savings": 63000,
        "shares": 4,
        "status": "ACTIVE",
        "address": "Ghulzar Para, P.M. Khali",
        "photo_key": "mem_09"
    },
    {
        "id": "M-10",
        "name": "Abdul Gafur",
        "name_bn": "আব্দুল গফুর",
        "mobile": "01821-001122",
        "nid": "199322145600010",
        "join_date": "2023-03-01",
        "designation": "General Member",
        "monthly_share": 1500,
        "total_savings": 60000,
        "shares": 4,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali",
        "photo_key": "mem_10"
    },
    {
        "id": "M-11",
        "name": "Mizanur Rahman",
        "name_bn": "মিজানুর রহমান",
        "mobile": "01822-112233",
        "nid": "199022145600011",
        "join_date": "2023-04-01",
        "designation": "General Member",
        "monthly_share": 1500,
        "total_savings": 57000,
        "shares": 4,
        "status": "ACTIVE",
        "address": "North Parania Para, P.M. Khali",
        "photo_key": "mem_11"
    },
    {
        "id": "M-12",
        "name": "Shafiul Alam",
        "name_bn": "শফিউল আলম",
        "mobile": "01823-223344",
        "nid": "198522145600012",
        "join_date": "2023-05-01",
        "designation": "General Member",
        "monthly_share": 1500,
        "total_savings": 54000,
        "shares": 4,
        "status": "ACTIVE",
        "address": "Parania Para, P.M. Khali",
        "photo_key": "mem_12"
    }
]

ASSETS_DATA = [
    {
        "id": "AST-01",
        "name": "Office Computer & Multi-Function Laser Printer",
        "category": "Office Equipment",
        "purchase_date": "2022-11-10",
        "cost": 65000,
        "current_val": 52000,
        "location": "PPBF Head Office, P.M. Khali",
        "status": "OPERATIONAL"
    },
    {
        "id": "AST-02",
        "name": "Cooperative Office Space & Furnishings",
        "category": "Fixtures & Leasehold",
        "purchase_date": "2022-10-01",
        "cost": 150000,
        "current_val": 140000,
        "location": "P.M. Khali Union Council Road",
        "status": "ACTIVE"
    },
    {
        "id": "AST-03",
        "name": "Community Solar Inverter & Battery Bank (1500W)",
        "category": "Power & Energy",
        "purchase_date": "2023-01-20",
        "cost": 125000,
        "current_val": 110000,
        "location": "Solar Hub, South Parania Para",
        "status": "OPERATIONAL"
    },
    {
        "id": "AST-04",
        "name": "Tomtom Charging Hub Distribution Panel",
        "category": "Machinery & Equipment",
        "purchase_date": "2023-04-12",
        "cost": 85000,
        "current_val": 76000,
        "location": "Electric Vehicle Depot, P.M. Khali",
        "status": "OPERATIONAL"
    },
    {
        "id": "AST-05",
        "name": "Cooperative Emergency Relief Fund (Liquid Bank Deposit)",
        "category": "Current Reserve",
        "purchase_date": "2022-10-01",
        "cost": 250000,
        "current_val": 285000,
        "location": "Islami Bank Bangladesh, Cox's Bazar",
        "status": "LIQUID"
    },
    {
        "id": "AST-06",
        "name": "Cooperative Land Advance (Proposed Permanent Office)",
        "category": "Real Estate / Land",
        "purchase_date": "2023-11-05",
        "cost": 450000,
        "current_val": 500000,
        "location": "Parania Para Main Road Junction",
        "status": "HELD"
    }
]

FINANCE_DATA = {
    "capital_fund": 1125000,
    "general_reserve": 380000,
    "welfare_fund": 145000,
    "total_disbursed": 4725000,
    "total_recovered": 3485000,
    "realized_profit": 585000,
    "operational_expenses": 142000,
    "monthly_collections": [
        {"month": "May 2024", "savings": 45000, "investment_recovered": 195000, "profit": 28500, "expense": 8500},
        {"month": "Jun 2024", "savings": 46500, "investment_recovered": 210000, "profit": 31000, "expense": 9200},
        {"month": "Jul 2024", "savings": 48000, "investment_recovered": 225000, "profit": 33500, "expense": 9800},
        {"month": "Aug 2024", "savings": 49500, "investment_recovered": 240000, "profit": 36000, "expense": 10500},
        {"month": "Sep 2024", "savings": 51000, "investment_recovered": 255000, "profit": 38500, "expense": 11200},
        {"month": "Oct 2024", "savings": 52500, "investment_recovered": 270000, "profit": 41000, "expense": 12000}
    ]
}

MEDIA_DATA = [
    {
        "id": "MED-01",
        "title": "Annual General Meeting (AGM 2023)",
        "category": "Meetings",
        "date": "2023-10-01",
        "description": "Executive committee and general members reviewing first-year cooperative audit report and dividend approval.",
        "icon": "bi-people-fill",
        "tag": "Governance"
    },
    {
        "id": "MED-02",
        "title": "Batch #1 Tomtom Vehicle Handover Ceremony",
        "category": "Vehicle Handover",
        "date": "2022-11-05",
        "description": "Handing over keys to Md. Nurul Islam and inaugural drivers at P.M. Khali Union office premises.",
        "icon": "bi-truck",
        "tag": "Investments"
    },
    {
        "id": "MED-03",
        "title": "Community Solar Charging Hub Inauguration",
        "category": "Community Projects",
        "date": "2023-01-25",
        "description": "Opening the 1500W cooperative solar charging bank for green electric transport.",
        "icon": "bi-sun-fill",
        "tag": "Green Energy"
    },
    {
        "id": "MED-04",
        "title": "P.M. Khali Fish Hatchery Project Inspection",
        "category": "Community Projects",
        "date": "2023-05-18",
        "description": "Field visit by President Alhaj Mohammad Harun and Secretary to inspect fingerling pond cultivation.",
        "icon": "bi-water",
        "tag": "Agro & Fishery"
    },
    {
        "id": "MED-05",
        "title": "Cooperative Office Renovation & Digital Desk",
        "category": "Cooperative Office",
        "date": "2023-09-12",
        "description": "Setting up the computerized registry desk for real-time ledger records and passbook printing.",
        "icon": "bi-building",
        "tag": "Office"
    },
    {
        "id": "MED-06",
        "title": "Winter Vegetable Harvesting & Wholesale Distribution",
        "category": "Community Projects",
        "date": "2024-03-20",
        "description": "Successful seasonal tomato and green chili bulk distribution to Cox's Bazar central bazaar.",
        "icon": "bi-flower1",
        "tag": "Agriculture"
    }
]

COOP_INFO = {
    "name_bn": "পরানিয়া পাড়া বিজনেস ফোরাম",
    "name_en": "PARANIA PARA BUSINESS FORUM",
    "bismillah": "বিসমিল্লাহির রাহমানির রাহীম",
    "established": "01/10/2022",
    "reg_note": "A Community Savings and Investment Cooperative",
    "address": "P.M. Khali, Cox's Bazar, Bangladesh",
    "email": "ppbf2023@gmail.com",
    "phone": "+880 1812-345678",
    "president": "Alhaj Mohammad Harun",
    "secretary": "Md. Nurul Absar",
    "finance_secretary": "Nabi Hossain"
}

FULL_SEED_DATA = {
    "info": COOP_INFO,
    "members": MEMBERS_DATA,
    "investments": INVESTMENTS_DATA,
    "assets": ASSETS_DATA,
    "finance": FINANCE_DATA,
    "media": MEDIA_DATA
}

with open('seed_data.json', 'w') as f:
    json.dump(FULL_SEED_DATA, f, indent=2)


