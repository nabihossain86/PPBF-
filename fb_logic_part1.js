
// PPBF Facebook-Style Web App Logic
// Fully Functional Single-Page Hash Routing & LocalStorage State

const FB_SEED_DATA = {
  "info": {
    "name_bn": "\u09aa\u09b0\u09be\u09a8\u09bf\u09af\u09bc\u09be \u09aa\u09be\u09a1\u09bc\u09be \u09ac\u09bf\u099c\u09a8\u09c7\u09b8 \u09ab\u09cb\u09b0\u09be\u09ae",
    "name_en": "PARANIA PARA BUSINESS FORUM",
    "bismillah": "\u09ac\u09bf\u09b8\u09ae\u09bf\u09b2\u09cd\u09b2\u09be\u09b9\u09bf\u09b0 \u09b0\u09be\u09b9\u09ae\u09be\u09a8\u09bf\u09b0 \u09b0\u09be\u09b9\u09c0\u09ae",
    "established": "01/10/2022",
    "reg_note": "A Community Savings and Investment Cooperative",
    "address": "P.M. Khali, Cox's Bazar, Bangladesh",
    "email": "ppbf2023@gmail.com",
    "phone": "+880 1812-345678",
    "president": "Alhaj Mohammad Harun",
    "secretary": "Md. Nurul Absar",
    "finance_secretary": "Nabi Hossain"
  },
  "members": [
    {
      "id": "M-01",
      "name": "Alhaj Mohammad Harun",
      "name_bn": "\u0986\u09b2\u09b9\u09be\u099c\u09cd\u09ac \u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u09b9\u09be\u09b0\u09c1\u09a8",
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
      "name_bn": "\u09ae\u09cb\u0983 \u09a8\u09c1\u09b0\u09c1\u09b2 \u0986\u09ac\u099b\u09be\u09b0",
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
      "name_bn": "\u09a8\u09ac\u09c0 \u09b9\u09cb\u09b8\u09c7\u09a8",
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
      "name_bn": "\u09ae\u09be\u09b8\u09cd\u099f\u09be\u09b0 \u0986\u09ac\u09cd\u09a6\u09c1\u09b2 \u09b9\u09be\u0995\u09bf\u09ae",
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
      "name_bn": "\u09a6\u09bf\u09a6\u09be\u09b0\u09c1\u09b2 \u0986\u09b2\u09ae",
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
      "name_bn": "\u09ab\u09b0\u09bf\u09a6\u09c1\u09b2 \u0986\u09b2\u09ae",
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
      "name_bn": "\u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u0987\u09b2\u09bf\u09af\u09bc\u09be\u09b8",
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
      "name_bn": "\u0995\u09be\u09ae\u09be\u09b2 \u09b9\u09cb\u09b8\u09c7\u09a8",
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
      "name_bn": "\u099c\u09be\u09b9\u09be\u0999\u09cd\u0997\u09c0\u09b0 \u0986\u09b2\u09ae",
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
      "name_bn": "\u0986\u09ac\u09cd\u09a6\u09c1\u09b2 \u0997\u09ab\u09c1\u09b0",
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
      "name_bn": "\u09ae\u09bf\u099c\u09be\u09a8\u09c1\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
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
      "name_bn": "\u09b6\u09ab\u09bf\u0989\u09b2 \u0986\u09b2\u09ae",
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
  ],
  "investments": {
    "list": [
      {
        "no": "01",
        "receiver": "Md. Nurul Islam",
        "receiver_bn": "\u09ae\u09cb\u0983 \u09a8\u09c1\u09b0\u09c1\u09b2 \u0987\u09b8\u09b2\u09be\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "size": "Big Easy Bike",
        "total": 205000,
        "received": 180000,
        "forum_invested": 180000,
        "security": 25000,
        "profit": 25000,
        "due": 0,
        "installments": 18,
        "issue_date": "2022-11-01",
        "end_date": "2024-04-30",
        "status": "COMPLETED",
        "remarks": "Fully settled with all profit cleared on time"
      },
      {
        "no": "02 & 03",
        "receiver": "Abul Kalam",
        "receiver_bn": "\u0986\u09ac\u09c1\u09b2 \u0995\u09be\u09b2\u09be\u09ae",
        "type": "Tomtom Mini & Solar Hub",
        "size": "Combined Unit",
        "total": 240000,
        "received": 157500,
        "forum_invested": 210000,
        "security": 30000,
        "profit": 30000,
        "due": 52500,
        "installments": 20,
        "issue_date": "2023-01-10",
        "end_date": "2024-08-30",
        "status": "RUNNING",
        "remarks": "Joint investment for vehicle + solar charging battery"
      },
      {
        "no": "04",
        "receiver": "Mohammad Elias",
        "receiver_bn": "\u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u0987\u09b2\u09bf\u09af\u09bc\u09be\u09b8",
        "type": "Tomtom Big (6-Seater)",
        "size": "Battery Auto",
        "total": 195000,
        "received": 170000,
        "forum_invested": 170000,
        "security": 25000,
        "profit": 25000,
        "due": 0,
        "installments": 18,
        "issue_date": "2023-02-05",
        "end_date": "2024-07-31",
        "status": "COMPLETED",
        "remarks": "Completed successfully in July 2024"
      },
      {
        "no": "05",
        "receiver": "Kamal Hossain",
        "receiver_bn": "\u0995\u09be\u09ae\u09be\u09b2 \u09b9\u09cb\u09b8\u09c7\u09a8",
        "type": "Grocery Store Stock",
        "size": "P.M. Khali Bazar",
        "total": 150000,
        "received": 130000,
        "forum_invested": 130000,
        "security": 20000,
        "profit": 20000,
        "due": 0,
        "installments": 15,
        "issue_date": "2023-03-01",
        "end_date": "2024-05-31",
        "status": "COMPLETED",
        "remarks": "Shop expansion inventory, complete profit realized"
      },
      {
        "no": "06",
        "receiver": "Jahangir Alam",
        "receiver_bn": "\u099c\u09be\u09b9\u09be\u0999\u09cd\u0997\u09c0\u09b0 \u0986\u09b2\u09ae",
        "type": "Fish Hatchery & Culture",
        "size": "Salt/Sweet Pond",
        "total": 280000,
        "received": 192000,
        "forum_invested": 240000,
        "security": 40000,
        "profit": 40000,
        "due": 48000,
        "installments": 20,
        "issue_date": "2023-04-15",
        "end_date": "2024-12-31",
        "status": "RUNNING",
        "remarks": "Fingerling culture seasonal harvest underway"
      },
      {
        "no": "07",
        "receiver": "Abdul Gafur",
        "receiver_bn": "\u0986\u09ac\u09cd\u09a6\u09c1\u09b2 \u0997\u09ab\u09c1\u09b0",
        "type": "Tomtom Big (6-Seater)",
        "size": "Easy Bike",
        "total": 200000,
        "received": 145950,
        "forum_invested": 175000,
        "security": 25000,
        "profit": 25000,
        "due": 29050,
        "installments": 18,
        "issue_date": "2023-05-01",
        "end_date": "2024-10-31",
        "status": "RUNNING",
        "remarks": "Active route: Cox's Bazar Link Road to P.M. Khali"
      },
      {
        "no": "08",
        "receiver": "Mizanur Rahman",
        "receiver_bn": "\u09ae\u09bf\u099c\u09be\u09a8\u09c1\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
        "type": "Poultry & Layer Farm",
        "size": "Shed #2",
        "total": 160000,
        "received": 140000,
        "forum_invested": 140000,
        "security": 20000,
        "profit": 20000,
        "due": 0,
        "installments": 16,
        "issue_date": "2023-06-10",
        "end_date": "2024-09-30",
        "status": "COMPLETED",
        "remarks": "Final installment received with certificate issued"
      },
      {
        "no": "09",
        "receiver": "Shafiul Alam",
        "receiver_bn": "\u09b6\u09ab\u09bf\u0989\u09b2 \u0986\u09b2\u09ae",
        "type": "Tomtom Mini (4-Seater)",
        "size": "Mini Auto",
        "total": 145000,
        "received": 125000,
        "forum_invested": 125000,
        "security": 20000,
        "profit": 20000,
        "due": 0,
        "installments": 14,
        "issue_date": "2023-07-01",
        "end_date": "2024-08-31",
        "status": "COMPLETED",
        "remarks": "Successfully completed ahead of schedule"
      },
      {
        "no": "10",
        "receiver": "Kabir Ahmad",
        "receiver_bn": "\u0995\u09ac\u09c0\u09b0 \u0986\u09b9\u09ae\u09a6",
        "type": "Auto Rickshaw CNG",
        "size": "4-Stroke CNG",
        "total": 320000,
        "received": 163380,
        "forum_invested": 280000,
        "security": 40000,
        "profit": 40000,
        "due": 116620,
        "installments": 24,
        "issue_date": "2023-08-01",
        "end_date": "2025-07-31",
        "status": "RUNNING",
        "remarks": "Route permit Cox's Bazar Sadar municipal zone"
      },
      {
        "no": "11",
        "receiver": "Faridul Alam",
        "receiver_bn": "\u09ab\u09b0\u09bf\u09a6\u09c1\u09b2 \u0986\u09b2\u09ae",
        "type": "Betel Leaf & Areca Nut",
        "size": "Paan Baroj 2 Bigha",
        "total": 130000,
        "received": 115000,
        "forum_invested": 115000,
        "security": 15000,
        "profit": 15000,
        "due": 0,
        "installments": 12,
        "issue_date": "2023-09-01",
        "end_date": "2024-08-31",
        "status": "COMPLETED",
        "remarks": "Crop harvest season closed, full payment cleared"
      },
      {
        "no": "12",
        "receiver": "Didarul Islam",
        "receiver_bn": "\u09a6\u09bf\u09a6\u09be\u09b0\u09c1\u09b2 \u0987\u09b8\u09b2\u09be\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "size": "Battery Auto",
        "total": 190000,
        "received": 110040,
        "forum_invested": 165000,
        "security": 25000,
        "profit": 25000,
        "due": 54960,
        "installments": 18,
        "issue_date": "2023-10-01",
        "end_date": "2025-03-31",
        "status": "RUNNING",
        "remarks": "Regular monthly collection on schedule"
      },
      {
        "no": "13",
        "receiver": "Anwar Hossain",
        "receiver_bn": "\u0986\u09a8\u09cb\u09af\u09bc\u09be\u09b0 \u09b9\u09cb\u09b8\u09c7\u09a8",
        "type": "Battery Charging Hub",
        "size": "Transformer & Racks",
        "total": 220000,
        "received": 116160,
        "forum_invested": 190000,
        "security": 30000,
        "profit": 30000,
        "due": 73840,
        "installments": 18,
        "issue_date": "2023-11-01",
        "end_date": "2025-04-30",
        "status": "RUNNING",
        "remarks": "Supplying power to 10 community tomtom vehicles"
      },
      {
        "no": "14",
        "receiver": "Mohammad Yunus",
        "receiver_bn": "\u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u0987\u0989\u09a8\u09c1\u09b8",
        "type": "Rural Pharmacy",
        "size": "Medicine Stock",
        "total": 175000,
        "received": 100000,
        "forum_invested": 150000,
        "security": 25000,
        "profit": 25000,
        "due": 50000,
        "installments": 15,
        "issue_date": "2023-12-01",
        "end_date": "2025-02-28",
        "status": "RUNNING",
        "remarks": "P.M. Khali Medical corner stock replenished"
      },
      {
        "no": "15",
        "receiver": "Rashid Ahmad",
        "receiver_bn": "\u09b0\u09b6\u09bf\u09a6 \u0986\u09b9\u09ae\u09a6",
        "type": "Tailoring & Fabrics",
        "size": "3 Juki Machines",
        "total": 120000,
        "received": 78750,
        "forum_invested": 105000,
        "security": 15000,
        "profit": 15000,
        "due": 26250,
        "installments": 12,
        "issue_date": "2024-01-01",
        "end_date": "2024-12-31",
        "status": "RUNNING",
        "remarks": "Eid festival order fulfillment delivered"
      },
      {
        "no": "16",
        "receiver": "Enamul Haque",
        "receiver_bn": "\u098f\u09a8\u09be\u09ae\u09c1\u09b2 \u09b9\u0995",
        "type": "Tomtom Big (6-Seater)",
        "size": "Easy Bike",
        "total": 205000,
        "received": 80000,
        "forum_invested": 180000,
        "security": 25000,
        "profit": 25000,
        "due": 100000,
        "installments": 18,
        "issue_date": "2024-02-01",
        "end_date": "2025-07-31",
        "status": "RUNNING",
        "remarks": "New chassis vehicle operating daily"
      },
      {
        "no": "17",
        "receiver": "Sirajul Mostafa",
        "receiver_bn": "\u09b8\u09bf\u09b0\u09be\u099c\u09c1\u09b2 \u09ae\u09cb\u09b8\u09cd\u09a4\u09ab\u09be",
        "type": "Salt Refining & Transport",
        "size": "Salt Depot",
        "total": 260000,
        "received": 78750,
        "forum_invested": 225000,
        "security": 35000,
        "profit": 35000,
        "due": 146250,
        "installments": 20,
        "issue_date": "2024-03-01",
        "end_date": "2025-10-31",
        "status": "RUNNING",
        "remarks": "Raw salt processing unit Cox's Bazar channel"
      },
      {
        "no": "18",
        "receiver": "Jasim Uddin",
        "receiver_bn": "\u099c\u09b8\u09bf\u09ae \u0989\u09a6\u09cd\u09a6\u09bf\u09a8",
        "type": "Vegetable Farming Project",
        "size": "Winter Crops",
        "total": 140000,
        "received": 60060,
        "forum_invested": 120000,
        "security": 20000,
        "profit": 20000,
        "due": 59940,
        "installments": 14,
        "issue_date": "2024-03-15",
        "end_date": "2025-05-15",
        "status": "RUNNING",
        "remarks": "Seasonal tomato & chili supply to Cox's Bazar"
      },
      {
        "no": "19",
        "receiver": "Nur Mohammad",
        "receiver_bn": "\u09a8\u09c1\u09b0 \u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6",
        "type": "Tomtom Mini (4-Seater)",
        "size": "Mini Auto",
        "total": 150000,
        "received": 52020,
        "forum_invested": 130000,
        "security": 20000,
        "profit": 20000,
        "due": 77980,
        "installments": 15,
        "issue_date": "2024-04-01",
        "end_date": "2025-06-30",
        "status": "RUNNING",
        "remarks": "Operating on P.M. Khali - Jhilongja feeder road"
      },
      {
        "no": "20",
        "receiver": "Sayed Alam",
        "receiver_bn": "\u09b8\u09c8\u09af\u09bc\u09a6 \u0986\u09b2\u09ae",
        "type": "Mini Cargo Van",
        "size": "Goods Carrier",
        "total": 310000,
        "received": 73680,
        "forum_invested": 270000,
        "security": 40000,
        "profit": 40000,
        "due": 196320,
        "installments": 22,
        "issue_date": "2024-04-15",
        "end_date": "2026-02-15",
        "status": "RUNNING",
        "remarks": "Carrying local fish & produce to Cox's Bazar city"
      },
      {
        "no": "21",
        "receiver": "Azizur Rahman",
        "receiver_bn": "\u0986\u099c\u09bf\u099c\u09c1\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
        "type": "Bakery & Confectionery",
        "size": "Electric Oven Hub",
        "total": 185000,
        "received": 50000,
        "forum_invested": 160000,
        "security": 25000,
        "profit": 25000,
        "due": 110000,
        "installments": 16,
        "issue_date": "2024-05-01",
        "end_date": "2025-08-31",
        "status": "RUNNING",
        "remarks": "Local village snack production expanding"
      },
      {
        "no": "22",
        "receiver": "Monjur Alam",
        "receiver_bn": "\u09ae\u099e\u09cd\u099c\u09c1\u09b0 \u0986\u09b2\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "size": "Easy Bike",
        "total": 200000,
        "received": 38920,
        "forum_invested": 175000,
        "security": 25000,
        "profit": 25000,
        "due": 136080,
        "installments": 18,
        "issue_date": "2024-06-01",
        "end_date": "2025-11-30",
        "status": "RUNNING",
        "remarks": "Battery pack under warranty, regular payments"
      },
      {
        "no": "23",
        "receiver": "Ziaur Rahman",
        "receiver_bn": "\u099c\u09bf\u09af\u09bc\u09be\u0989\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
        "type": "Electronics & Mobile Servicing",
        "size": "Tools & Spares",
        "total": 135000,
        "received": 38360,
        "forum_invested": 115000,
        "security": 20000,
        "profit": 20000,
        "due": 76640,
        "installments": 12,
        "issue_date": "2024-06-15",
        "end_date": "2025-06-15",
        "status": "RUNNING",
        "remarks": "Modern diagnostic equipment added to shop"
      },
      {
        "no": "24",
        "receiver": "Mostak Ahmad",
        "receiver_bn": "\u09ae\u09cb\u09b8\u09cd\u09a4\u09be\u0995 \u0986\u09b9\u09ae\u09a6",
        "type": "Dairy & Cow Fattening",
        "size": "Friesian Breed 3 Cows",
        "total": 250000,
        "received": 32250,
        "forum_invested": 215000,
        "security": 35000,
        "profit": 35000,
        "due": 182750,
        "installments": 20,
        "issue_date": "2024-07-01",
        "end_date": "2026-02-28",
        "status": "RUNNING",
        "remarks": "Daily milk yield 25 litres to local sweet shops"
      },
      {
        "no": "25",
        "receiver": "Shah Alam",
        "receiver_bn": "\u09b6\u09be\u09b9 \u0986\u09b2\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "size": "Easy Bike",
        "total": 210000,
        "received": 20000,
        "forum_invested": 180000,
        "security": 30000,
        "profit": 30000,
        "due": 160000,
        "installments": 18,
        "issue_date": "2024-08-01",
        "end_date": "2026-01-31",
        "status": "RUNNING",
        "remarks": "Latest investment sanctioned by executive council"
      }
    ],
    "forms": {
      "01": {
        "no": "01",
        "receiver": "Md. Nurul Islam",
        "receiver_bn": "\u09ae\u09cb\u0983 \u09a8\u09c1\u09b0\u09c1\u09b2 \u0987\u09b8\u09b2\u09be\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01819-876543",
        "issue_date": "2022-11-01",
        "end_date": "2024-04-30",
        "total": 205000,
        "forum_invested": 180000,
        "security": 25000,
        "profit": 25000,
        "installments": 18,
        "guarantor_name": "Alhaj Faridul Alam",
        "guarantor_mobile": "01812-334455",
        "guarantor_relation": "Village Elder / Uncle",
        "photo_key": "rec_01",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "COMPLETED",
        "remarks": "Fully settled with all profit cleared on time",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "2024-04-10",
            "description": "Monthly Installment #16",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "2024-05-10",
            "description": "Monthly Installment #17",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "2024-06-10",
            "description": "Monthly Installment #18",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "02 & 03": {
        "no": "02 & 03",
        "receiver": "Abul Kalam",
        "receiver_bn": "\u0986\u09ac\u09c1\u09b2 \u0995\u09be\u09b2\u09be\u09ae",
        "type": "Tomtom Mini & Solar Hub",
        "mobile": "01825-998877",
        "issue_date": "2023-01-10",
        "end_date": "2024-08-30",
        "total": 240000,
        "forum_invested": 210000,
        "security": 30000,
        "profit": 30000,
        "installments": 20,
        "guarantor_name": "Jahangir Kashem",
        "guarantor_mobile": "01814-556677",
        "guarantor_relation": "Brother-in-law",
        "photo_key": "rec_02_03",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Joint investment for vehicle + solar charging battery",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 10500,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "Installment Month 19",
            "received_date": "",
            "description": "Installment #19 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "Installment Month 20",
            "received_date": "",
            "description": "Installment #20 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "04": {
        "no": "04",
        "receiver": "Mohammad Elias",
        "receiver_bn": "\u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u0987\u09b2\u09bf\u09af\u09bc\u09be\u09b8",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01831-223344",
        "issue_date": "2023-02-05",
        "end_date": "2024-07-31",
        "total": 195000,
        "forum_invested": 170000,
        "security": 25000,
        "profit": 25000,
        "installments": 18,
        "guarantor_name": "Md. Rashid",
        "guarantor_mobile": "01817-667788",
        "guarantor_relation": "Cousin",
        "photo_key": "rec_04",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "COMPLETED",
        "remarks": "Completed successfully in July 2024",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "2024-04-10",
            "description": "Monthly Installment #16",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "2024-05-10",
            "description": "Monthly Installment #17",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "2024-06-10",
            "description": "Monthly Installment #18",
            "paid_amount": 9444,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "05": {
        "no": "05",
        "receiver": "Kamal Hossain",
        "receiver_bn": "\u0995\u09be\u09ae\u09be\u09b2 \u09b9\u09cb\u09b8\u09c7\u09a8",
        "type": "Grocery Store Stock",
        "mobile": "01844-332211",
        "issue_date": "2023-03-01",
        "end_date": "2024-05-31",
        "total": 150000,
        "forum_invested": 130000,
        "security": 20000,
        "profit": 20000,
        "installments": 15,
        "guarantor_name": "Master Abdul Hakim",
        "guarantor_mobile": "01818-990011",
        "guarantor_relation": "Local Teacher",
        "photo_key": "rec_05",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "COMPLETED",
        "remarks": "Shop expansion inventory, complete profit realized",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 8667,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "06": {
        "no": "06",
        "receiver": "Jahangir Alam",
        "receiver_bn": "\u099c\u09be\u09b9\u09be\u0999\u09cd\u0997\u09c0\u09b0 \u0986\u09b2\u09ae",
        "type": "Fish Hatchery & Culture",
        "mobile": "01855-443322",
        "issue_date": "2023-04-15",
        "end_date": "2024-12-31",
        "total": 280000,
        "forum_invested": 240000,
        "security": 40000,
        "profit": 40000,
        "installments": 20,
        "guarantor_name": "Nurul Huda",
        "guarantor_mobile": "01819-112233",
        "guarantor_relation": "Paternal Uncle",
        "photo_key": "rec_06",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Fingerling culture seasonal harvest underway",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "2024-04-10",
            "description": "Monthly Installment #16",
            "paid_amount": 12000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "Installment Month 19",
            "received_date": "",
            "description": "Installment #19 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "Installment Month 20",
            "received_date": "",
            "description": "Installment #20 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "07": {
        "no": "07",
        "receiver": "Abdul Gafur",
        "receiver_bn": "\u0986\u09ac\u09cd\u09a6\u09c1\u09b2 \u0997\u09ab\u09c1\u09b0",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01866-554433",
        "issue_date": "2023-05-01",
        "end_date": "2024-10-31",
        "total": 200000,
        "forum_invested": 175000,
        "security": 25000,
        "profit": 25000,
        "installments": 18,
        "guarantor_name": "Osman Gani",
        "guarantor_mobile": "01815-445566",
        "guarantor_relation": "Elder Brother",
        "photo_key": "rec_07",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Active route: Cox's Bazar Link Road to P.M. Khali",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "08": {
        "no": "08",
        "receiver": "Mizanur Rahman",
        "receiver_bn": "\u09ae\u09bf\u099c\u09be\u09a8\u09c1\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
        "type": "Poultry & Layer Farm",
        "mobile": "01877-665544",
        "issue_date": "2023-06-10",
        "end_date": "2024-09-30",
        "total": 160000,
        "forum_invested": 140000,
        "security": 20000,
        "profit": 20000,
        "installments": 16,
        "guarantor_name": "Nurul Amin",
        "guarantor_mobile": "01816-778899",
        "guarantor_relation": "Neighbor",
        "photo_key": "rec_08",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "COMPLETED",
        "remarks": "Final installment received with certificate issued",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "2024-03-10",
            "description": "Monthly Installment #15",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "2024-04-10",
            "description": "Monthly Installment #16",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "09": {
        "no": "09",
        "receiver": "Shafiul Alam",
        "receiver_bn": "\u09b6\u09ab\u09bf\u0989\u09b2 \u0986\u09b2\u09ae",
        "type": "Tomtom Mini (4-Seater)",
        "mobile": "01888-776655",
        "issue_date": "2023-07-01",
        "end_date": "2024-08-31",
        "total": 145000,
        "forum_invested": 125000,
        "security": 20000,
        "profit": 20000,
        "installments": 14,
        "guarantor_name": "Abul Bashar",
        "guarantor_mobile": "01811-223344",
        "guarantor_relation": "Brother",
        "photo_key": "rec_09",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "COMPLETED",
        "remarks": "Successfully completed ahead of schedule",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 8929,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "10": {
        "no": "10",
        "receiver": "Kabir Ahmad",
        "receiver_bn": "\u0995\u09ac\u09c0\u09b0 \u0986\u09b9\u09ae\u09a6",
        "type": "Auto Rickshaw CNG",
        "mobile": "01899-887766",
        "issue_date": "2023-08-01",
        "end_date": "2025-07-31",
        "total": 320000,
        "forum_invested": 280000,
        "security": 40000,
        "profit": 40000,
        "installments": 24,
        "guarantor_name": "Haji Delowar",
        "guarantor_mobile": "01813-998877",
        "guarantor_relation": "Father-in-law",
        "photo_key": "rec_10",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Route permit Cox's Bazar Sadar municipal zone",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "2024-01-10",
            "description": "Monthly Installment #13",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "2024-02-10",
            "description": "Monthly Installment #14",
            "paid_amount": 11670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "Installment Month 19",
            "received_date": "",
            "description": "Installment #19 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "Installment Month 20",
            "received_date": "",
            "description": "Installment #20 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "Installment Month 21",
            "received_date": "",
            "description": "Installment #21 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "Installment Month 22",
            "received_date": "",
            "description": "Installment #22 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "Installment Month 23",
            "received_date": "",
            "description": "Installment #23 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "Installment Month 24",
            "received_date": "",
            "description": "Installment #24 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "11": {
        "no": "11",
        "receiver": "Faridul Alam",
        "receiver_bn": "\u09ab\u09b0\u09bf\u09a6\u09c1\u09b2 \u0986\u09b2\u09ae",
        "type": "Betel Leaf & Areca Nut",
        "mobile": "01812-445566",
        "issue_date": "2023-09-01",
        "end_date": "2024-08-31",
        "total": 130000,
        "forum_invested": 115000,
        "security": 15000,
        "profit": 15000,
        "installments": 12,
        "guarantor_name": "Shamsul Alam",
        "guarantor_mobile": "01821-334455",
        "guarantor_relation": "Brother",
        "photo_key": "rec_11",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "COMPLETED",
        "remarks": "Crop harvest season closed, full payment cleared",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 9583,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "12": {
        "no": "12",
        "receiver": "Didarul Islam",
        "receiver_bn": "\u09a6\u09bf\u09a6\u09be\u09b0\u09c1\u09b2 \u0987\u09b8\u09b2\u09be\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01823-556677",
        "issue_date": "2023-10-01",
        "end_date": "2025-03-31",
        "total": 190000,
        "forum_invested": 165000,
        "security": 25000,
        "profit": 25000,
        "installments": 18,
        "guarantor_name": "Nurul Haque",
        "guarantor_mobile": "01832-445566",
        "guarantor_relation": "Maternal Uncle",
        "photo_key": "rec_12",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Regular monthly collection on schedule",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "2024-12-10",
            "description": "Monthly Installment #12",
            "paid_amount": 9170,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "13": {
        "no": "13",
        "receiver": "Anwar Hossain",
        "receiver_bn": "\u0986\u09a8\u09cb\u09af\u09bc\u09be\u09b0 \u09b9\u09cb\u09b8\u09c7\u09a8",
        "type": "Battery Charging Hub",
        "mobile": "01834-667788",
        "issue_date": "2023-11-01",
        "end_date": "2025-04-30",
        "total": 220000,
        "forum_invested": 190000,
        "security": 30000,
        "profit": 30000,
        "installments": 18,
        "guarantor_name": "Khorshed Alam",
        "guarantor_mobile": "01843-556677",
        "guarantor_relation": "Elder Brother",
        "photo_key": "rec_13",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Supplying power to 10 community tomtom vehicles",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "2023-11-10",
            "description": "Monthly Installment #11",
            "paid_amount": 10560,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "14": {
        "no": "14",
        "receiver": "Mohammad Yunus",
        "receiver_bn": "\u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6 \u0987\u0989\u09a8\u09c1\u09b8",
        "type": "Rural Pharmacy",
        "mobile": "01845-778899",
        "issue_date": "2023-12-01",
        "end_date": "2025-02-28",
        "total": 175000,
        "forum_invested": 150000,
        "security": 25000,
        "profit": 25000,
        "installments": 15,
        "guarantor_name": "Dr. Fazlul Karim",
        "guarantor_mobile": "01854-667788",
        "guarantor_relation": "Community Elder",
        "photo_key": "rec_14",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "P.M. Khali Medical corner stock replenished",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "2023-10-10",
            "description": "Monthly Installment #10",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "15": {
        "no": "15",
        "receiver": "Rashid Ahmad",
        "receiver_bn": "\u09b0\u09b6\u09bf\u09a6 \u0986\u09b9\u09ae\u09a6",
        "type": "Tailoring & Fabrics",
        "mobile": "01856-889900",
        "issue_date": "2024-01-01",
        "end_date": "2024-12-31",
        "total": 120000,
        "forum_invested": 105000,
        "security": 15000,
        "profit": 15000,
        "installments": 12,
        "guarantor_name": "Sirajul Islam",
        "guarantor_mobile": "01865-778899",
        "guarantor_relation": "Brother-in-law",
        "photo_key": "rec_15",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Eid festival order fulfillment delivered",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "2023-09-10",
            "description": "Monthly Installment #9",
            "paid_amount": 8750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "16": {
        "no": "16",
        "receiver": "Enamul Haque",
        "receiver_bn": "\u098f\u09a8\u09be\u09ae\u09c1\u09b2 \u09b9\u0995",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01867-990011",
        "issue_date": "2024-02-01",
        "end_date": "2025-07-31",
        "total": 205000,
        "forum_invested": 180000,
        "security": 25000,
        "profit": 25000,
        "installments": 18,
        "guarantor_name": "Alhaj Babul Mia",
        "guarantor_mobile": "01876-889900",
        "guarantor_relation": "Cousin",
        "photo_key": "rec_16",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "New chassis vehicle operating daily",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "2023-08-10",
            "description": "Monthly Installment #8",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "17": {
        "no": "17",
        "receiver": "Sirajul Mostafa",
        "receiver_bn": "\u09b8\u09bf\u09b0\u09be\u099c\u09c1\u09b2 \u09ae\u09cb\u09b8\u09cd\u09a4\u09ab\u09be",
        "type": "Salt Refining & Transport",
        "mobile": "01878-001122",
        "issue_date": "2024-03-01",
        "end_date": "2025-10-31",
        "total": 260000,
        "forum_invested": 225000,
        "security": 35000,
        "profit": 35000,
        "installments": 20,
        "guarantor_name": "Mustafizur Rahman",
        "guarantor_mobile": "01887-990011",
        "guarantor_relation": "Partner",
        "photo_key": "rec_17",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Raw salt processing unit Cox's Bazar channel",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 11250,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "Installment Month 19",
            "received_date": "",
            "description": "Installment #19 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "Installment Month 20",
            "received_date": "",
            "description": "Installment #20 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "18": {
        "no": "18",
        "receiver": "Jasim Uddin",
        "receiver_bn": "\u099c\u09b8\u09bf\u09ae \u0989\u09a6\u09cd\u09a6\u09bf\u09a8",
        "type": "Vegetable Farming Project",
        "mobile": "01889-112233",
        "issue_date": "2024-03-15",
        "end_date": "2025-05-15",
        "total": 140000,
        "forum_invested": 120000,
        "security": 20000,
        "profit": 20000,
        "installments": 14,
        "guarantor_name": "Nurul Amin",
        "guarantor_mobile": "01898-001122",
        "guarantor_relation": "Uncle",
        "photo_key": "rec_18",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Seasonal tomato & chili supply to Cox's Bazar",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "2023-07-10",
            "description": "Monthly Installment #7",
            "paid_amount": 8580,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "19": {
        "no": "19",
        "receiver": "Nur Mohammad",
        "receiver_bn": "\u09a8\u09c1\u09b0 \u09ae\u09cb\u09b9\u09be\u09ae\u09cd\u09ae\u09a6",
        "type": "Tomtom Mini (4-Seater)",
        "mobile": "01890-223344",
        "issue_date": "2024-04-01",
        "end_date": "2025-06-30",
        "total": 150000,
        "forum_invested": 130000,
        "security": 20000,
        "profit": 20000,
        "installments": 15,
        "guarantor_name": "Golam Mostafa",
        "guarantor_mobile": "01812-556677",
        "guarantor_relation": "Brother",
        "photo_key": "rec_19",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Operating on P.M. Khali - Jhilongja feeder road",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 8670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 8670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 8670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 8670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 8670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 8670,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "20": {
        "no": "20",
        "receiver": "Sayed Alam",
        "receiver_bn": "\u09b8\u09c8\u09af\u09bc\u09a6 \u0986\u09b2\u09ae",
        "type": "Mini Cargo Van",
        "mobile": "01814-334455",
        "issue_date": "2024-04-15",
        "end_date": "2026-02-15",
        "total": 310000,
        "forum_invested": 270000,
        "security": 40000,
        "profit": 40000,
        "installments": 22,
        "guarantor_name": "Nurul Islam",
        "guarantor_mobile": "01823-667788",
        "guarantor_relation": "Elder Cousin",
        "photo_key": "rec_20",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Carrying local fish & produce to Cox's Bazar city",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 12280,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 12280,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 12280,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 12280,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 12280,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "2023-06-10",
            "description": "Monthly Installment #6",
            "paid_amount": 12280,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "Installment Month 19",
            "received_date": "",
            "description": "Installment #19 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "Installment Month 20",
            "received_date": "",
            "description": "Installment #20 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "Installment Month 21",
            "received_date": "",
            "description": "Installment #21 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "Installment Month 22",
            "received_date": "",
            "description": "Installment #22 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "21": {
        "no": "21",
        "receiver": "Azizur Rahman",
        "receiver_bn": "\u0986\u099c\u09bf\u099c\u09c1\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
        "type": "Bakery & Confectionery",
        "mobile": "01825-445566",
        "issue_date": "2024-05-01",
        "end_date": "2025-08-31",
        "total": 185000,
        "forum_invested": 160000,
        "security": 25000,
        "profit": 25000,
        "installments": 16,
        "guarantor_name": "Abdul Karim",
        "guarantor_mobile": "01834-778899",
        "guarantor_relation": "Uncle",
        "photo_key": "rec_21",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Local village snack production expanding",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "2023-05-10",
            "description": "Monthly Installment #5",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "",
            "description": "Installment #6 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "22": {
        "no": "22",
        "receiver": "Monjur Alam",
        "receiver_bn": "\u09ae\u099e\u09cd\u099c\u09c1\u09b0 \u0986\u09b2\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01836-556677",
        "issue_date": "2024-06-01",
        "end_date": "2025-11-30",
        "total": 200000,
        "forum_invested": 175000,
        "security": 25000,
        "profit": 25000,
        "installments": 18,
        "guarantor_name": "Master Jalal Ahmad",
        "guarantor_mobile": "01845-889900",
        "guarantor_relation": "School Master",
        "photo_key": "rec_22",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Battery pack under warranty, regular payments",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 9730,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "",
            "description": "Installment #5 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "",
            "description": "Installment #6 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "23": {
        "no": "23",
        "receiver": "Ziaur Rahman",
        "receiver_bn": "\u099c\u09bf\u09af\u09bc\u09be\u0989\u09b0 \u09b0\u09b9\u09ae\u09be\u09a8",
        "type": "Electronics & Mobile Servicing",
        "mobile": "01847-667788",
        "issue_date": "2024-06-15",
        "end_date": "2025-06-15",
        "total": 135000,
        "forum_invested": 115000,
        "security": 20000,
        "profit": 20000,
        "installments": 12,
        "guarantor_name": "Didarul Alam",
        "guarantor_mobile": "01856-990011",
        "guarantor_relation": "Brother",
        "photo_key": "rec_23",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Modern diagnostic equipment added to shop",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 9590,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 9590,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 9590,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "2023-04-10",
            "description": "Monthly Installment #4",
            "paid_amount": 9590,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "",
            "description": "Installment #5 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "",
            "description": "Installment #6 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "24": {
        "no": "24",
        "receiver": "Mostak Ahmad",
        "receiver_bn": "\u09ae\u09cb\u09b8\u09cd\u09a4\u09be\u0995 \u0986\u09b9\u09ae\u09a6",
        "type": "Dairy & Cow Fattening",
        "mobile": "01858-778899",
        "issue_date": "2024-07-01",
        "end_date": "2026-02-28",
        "total": 250000,
        "forum_invested": 215000,
        "security": 35000,
        "profit": 35000,
        "installments": 20,
        "guarantor_name": "Alhaj Nurul Huda",
        "guarantor_mobile": "01867-001122",
        "guarantor_relation": "Village Elder",
        "photo_key": "rec_24",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Daily milk yield 25 litres to local sweet shops",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "2023-03-10",
            "description": "Monthly Installment #3",
            "paid_amount": 10750,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "",
            "description": "Installment #4 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "",
            "description": "Installment #5 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "",
            "description": "Installment #6 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "Installment Month 19",
            "received_date": "",
            "description": "Installment #19 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "Installment Month 20",
            "received_date": "",
            "description": "Installment #20 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      },
      "25": {
        "no": "25",
        "receiver": "Shah Alam",
        "receiver_bn": "\u09b6\u09be\u09b9 \u0986\u09b2\u09ae",
        "type": "Tomtom Big (6-Seater)",
        "mobile": "01869-889900",
        "issue_date": "2024-08-01",
        "end_date": "2026-01-31",
        "total": 210000,
        "forum_invested": 180000,
        "security": 30000,
        "profit": 30000,
        "installments": 18,
        "guarantor_name": "Kalam Ullah",
        "guarantor_mobile": "01878-112233",
        "guarantor_relation": "Cousin",
        "photo_key": "rec_25",
        "date": "2026-10-31",
        "finance_secretary": "Nabi Hossain",
        "secretary": "Md. Nurul Absar",
        "president": "Alhaj Mohammad Harun",
        "status": "RUNNING",
        "remarks": "Latest investment sanctioned by executive council",
        "rows": [
          {
            "no": 1,
            "month": "Installment Month 1",
            "received_date": "2023-01-10",
            "description": "Monthly Installment #1",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 2,
            "month": "Installment Month 2",
            "received_date": "2023-02-10",
            "description": "Monthly Installment #2",
            "paid_amount": 10000,
            "receiver_sign": "Signed",
            "remarks": "Received by Cashier"
          },
          {
            "no": 3,
            "month": "Installment Month 3",
            "received_date": "",
            "description": "Installment #3 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 4,
            "month": "Installment Month 4",
            "received_date": "",
            "description": "Installment #4 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 5,
            "month": "Installment Month 5",
            "received_date": "",
            "description": "Installment #5 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 6,
            "month": "Installment Month 6",
            "received_date": "",
            "description": "Installment #6 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 7,
            "month": "Installment Month 7",
            "received_date": "",
            "description": "Installment #7 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 8,
            "month": "Installment Month 8",
            "received_date": "",
            "description": "Installment #8 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 9,
            "month": "Installment Month 9",
            "received_date": "",
            "description": "Installment #9 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 10,
            "month": "Installment Month 10",
            "received_date": "",
            "description": "Installment #10 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 11,
            "month": "Installment Month 11",
            "received_date": "",
            "description": "Installment #11 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 12,
            "month": "Installment Month 12",
            "received_date": "",
            "description": "Installment #12 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 13,
            "month": "Installment Month 13",
            "received_date": "",
            "description": "Installment #13 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 14,
            "month": "Installment Month 14",
            "received_date": "",
            "description": "Installment #14 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 15,
            "month": "Installment Month 15",
            "received_date": "",
            "description": "Installment #15 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 16,
            "month": "Installment Month 16",
            "received_date": "",
            "description": "Installment #16 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 17,
            "month": "Installment Month 17",
            "received_date": "",
            "description": "Installment #17 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 18,
            "month": "Installment Month 18",
            "received_date": "",
            "description": "Installment #18 (Scheduled)",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 19,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 20,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 21,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 22,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 23,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          },
          {
            "no": 24,
            "month": "",
            "received_date": "",
            "description": "",
            "paid_amount": 0,
            "receiver_sign": "",
            "remarks": ""
          }
        ]
      }
    }
  },
  "assets": [
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
  ],
  "finance": {
    "capital_fund": 1125000,
    "general_reserve": 380000,
    "welfare_fund": 145000,
    "total_disbursed": 4725000,
    "total_recovered": 3485000,
    "realized_profit": 585000,
    "operational_expenses": 142000,
    "monthly_collections": [
      {
        "month": "May 2024",
        "savings": 45000,
        "investment_recovered": 195000,
        "profit": 28500,
        "expense": 8500
      },
      {
        "month": "Jun 2024",
        "savings": 46500,
        "investment_recovered": 210000,
        "profit": 31000,
        "expense": 9200
      },
      {
        "month": "Jul 2024",
        "savings": 48000,
        "investment_recovered": 225000,
        "profit": 33500,
        "expense": 9800
      },
      {
        "month": "Aug 2024",
        "savings": 49500,
        "investment_recovered": 240000,
        "profit": 36000,
        "expense": 10500
      },
      {
        "month": "Sep 2024",
        "savings": 51000,
        "investment_recovered": 255000,
        "profit": 38500,
        "expense": 11200
      },
      {
        "month": "Oct 2024",
        "savings": 52500,
        "investment_recovered": 270000,
        "profit": 41000,
        "expense": 12000
      }
    ]
  },
  "media": [
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
  ],
  "posts": [
    {
      "id": "post-01",
      "author": "Alhaj Mohammad Harun",
      "author_role": "President, PPBF",
      "author_avatar": "H",
      "time": "2 hours ago",
      "content_bn": "\u0986\u09b2\u09b9\u09be\u09ae\u09a6\u09c1\u09b2\u09bf\u09b2\u09cd\u09b2\u09be\u09b9, \u09aa\u09b0\u09be\u09a8\u09bf\u09af\u09bc\u09be \u09aa\u09be\u09a1\u09bc\u09be \u09ac\u09bf\u099c\u09a8\u09c7\u09b8 \u09ab\u09cb\u09b0\u09be\u09ae\u09c7\u09b0 \u0986\u0993\u09a4\u09be\u09af\u09bc \u09e7\u09ae \u09ac\u09cd\u09af\u09be\u099a\u09c7\u09b0 \u099f\u09ae\u099f\u09ae \u09ac\u09bf\u09a8\u09bf\u09af\u09bc\u09cb\u0997\u09c7\u09b0 \u09b8\u0995\u09b2 \u0995\u09bf\u09b8\u09cd\u09a4\u09bf \u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u0986\u09a6\u09be\u09af\u09bc \u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964 \u09b8\u09a6\u09b8\u09cd\u09af\u09a6\u09c7\u09b0 \u0986\u09ae\u09be\u09a8\u09a4 \u09b6\u09a4\u09ad\u09be\u0997 \u09b8\u09c1\u09b0\u0995\u09cd\u09b7\u09bf\u09a4\u0964",
      "content_en": "Alhamdulillah, all installments for Batch #1 Tomtom vehicle financing (Investment #01 & #04) have been fully settled on time. All forum returns and security deposits have been processed transparently.",
      "inv_ref": "01",
      "likes": 28,
      "reactions": {
        "like": 18,
        "love": 7,
        "care": 3
      },
      "user_reacted": "like",
      "comments": [
        {
          "author": "Md. Nurul Absar",
          "text": "\u09ae\u09be\u09b6\u09be\u0986\u09b2\u09cd\u09b2\u09be\u09b9, \u099a\u09ae\u09ce\u0995\u09be\u09b0 \u0989\u09a6\u09cd\u09af\u09cb\u0997\u0964 \u09ab\u09cb\u09b0\u09be\u09ae \u098f\u0997\u09bf\u09af\u09bc\u09c7 \u09af\u09be\u0995\u0964",
          "time": "1h ago"
        },
        {
          "author": "Nabi Hossain",
          "text": "\u09b8\u0995\u09b2 \u09b9\u09bf\u09b8\u09be\u09ac \u0985\u09a1\u09bf\u099f \u09b0\u09bf\u09aa\u09cb\u09b0\u09cd\u099f\u09c7 \u09aa\u09cd\u09b0\u09b8\u09cd\u09a4\u09c1\u09a4 \u09b0\u09be\u0996\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964",
          "time": "45m ago"
        }
      ]
    },
    {
      "id": "post-02",
      "author": "Nabi Hossain",
      "author_role": "Finance Secretary",
      "author_avatar": "N",
      "time": "5 hours ago",
      "content_bn": "\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09e8\u09e6\u09e8\u09ea \u09ae\u09be\u09b8\u09c7\u09b0 \u09b8\u099e\u09cd\u099a\u09af\u09bc \u0993 \u0995\u09bf\u09b8\u09cd\u09a4\u09bf \u0986\u09a6\u09be\u09af\u09bc \u09ac\u09bf\u09ac\u09b0\u09a3\u09c0 \u09aa\u09cd\u09b0\u09b8\u09cd\u09a4\u09c1\u09a4\u0964 \u09b8\u0995\u09b2 \u09b8\u09ae\u09cd\u09ae\u09be\u09a8\u09bf\u09a4 \u09b8\u09a6\u09b8\u09cd\u09af\u0995\u09c7 \u09a8\u09bf\u09b0\u09cd\u09a7\u09be\u09b0\u09bf\u09a4 \u09b8\u09ae\u09af\u09bc\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b8\u099e\u09cd\u099a\u09af\u09bc \u099c\u09ae\u09be \u09a6\u09c7\u0993\u09af\u09bc\u09be\u09b0 \u0985\u09a8\u09c1\u09b0\u09cb\u09a7 \u0995\u09b0\u09be \u09b9\u099a\u09cd\u099b\u09c7\u0964",
      "content_en": "Monthly Savings and Installment Collection Statement for October 2024 is now published. Cumulative savings crossed \u09f3 1,050,000 milestone with 100% member participation.",
      "inv_ref": "02 & 03",
      "likes": 34,
      "reactions": {
        "like": 22,
        "love": 10,
        "care": 2
      },
      "user_reacted": null,
      "comments": [
        {
          "author": "Master Abdul Hakim",
          "text": "\u0985\u09ad\u09bf\u09a8\u09a8\u09cd\u09a6\u09a8 \u0995\u09be\u09b0\u09cd\u09af\u09a8\u09bf\u09b0\u09cd\u09ac\u09be\u09b9\u09c0 \u0995\u09ae\u09bf\u099f\u09bf\u0995\u09c7\u0964",
          "time": "3h ago"
        }
      ]
    },
    {
      "id": "post-03",
      "author": "Md. Nurul Absar",
      "author_role": "General Secretary",
      "author_avatar": "A",
      "time": "1 day ago",
      "content_bn": "\u09aa\u09bf.\u098f\u09ae.\u0996\u09be\u09b2\u09c0 \u0987\u0989\u09a8\u09bf\u09af\u09bc\u09a8\u09c7 \u09aa\u09b0\u09bf\u09ac\u09c7\u09b6\u09ac\u09be\u09a8\u09cd\u09a7\u09ac \u09e7\u09eb\u09e6\u09e6 \u0993\u09af\u09bc\u09be\u099f \u09b8\u09cc\u09b0 \u09ac\u09bf\u09a6\u09cd\u09af\u09c1\u09ce \u09ac\u09cd\u09af\u09be\u099f\u09be\u09b0\u09bf \u099a\u09be\u09b0\u09cd\u099c\u09bf\u0982 \u09b9\u09be\u09ac \u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u099a\u09be\u09b2\u09c1 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u09e7\u09e6\u099f\u09bf \u099f\u09ae\u099f\u09ae \u0997\u09be\u09a1\u09bc\u09bf \u098f\u0996\u09be\u09a8 \u09a5\u09c7\u0995\u09c7 \u09ac\u09bf\u09a6\u09cd\u09af\u09c1\u09ce \u09b8\u09c7\u09ac\u09be \u0997\u09cd\u09b0\u09b9\u09a3 \u0995\u09b0\u099b\u09c7\u0964",
      "content_en": "Cooperative Solar Charging Station (1500W Inverter + Heavy Battery Bank) in South Parania Para is operational. Supplying green charging energy to 10 community transport vehicles.",
      "inv_ref": "13",
      "likes": 42,
      "reactions": {
        "like": 25,
        "love": 14,
        "care": 3
      },
      "user_reacted": "love",
      "comments": [
        {
          "author": "Anwar Hossain",
          "text": "\u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u099a\u09be\u09b0\u09cd\u099c\u09bf\u0982 \u09b8\u09cd\u099f\u09c7\u09b6\u09a8 \u0996\u09c1\u09ac \u09ad\u09be\u09b2\u09cb \u099a\u09b2\u099b\u09c7\u0964",
          "time": "20h ago"
        },
        {
          "author": "Didarul Alam",
          "text": "\u09ac\u09bf\u09a6\u09cd\u09af\u09c1\u09ce \u09ac\u09bf\u09ad\u09cd\u09b0\u09be\u099f\u09c7\u0993 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb \u09b8\u09ae\u09cd\u09ad\u09ac \u09b9\u099a\u09cd\u099b\u09c7\u0964",
          "time": "18h ago"
        }
      ]
    }
  ],
  "stories": [
    {
      "id": "story-01",
      "author": "PPBF Official",
      "title": "Vehicle Batch #1",
      "sub": "Handover Ceremony",
      "badge": "Vehicles",
      "color": "linear-gradient(180deg, #1877F2 0%, #0B2545 100%)",
      "content": "Official handover of 6-seater Tomtom Easy Bikes to local drivers under Shariah Mudarabah investment terms."
    },
    {
      "id": "story-02",
      "author": "Green Energy",
      "title": "Solar Hub",
      "sub": "1500W Live Depot",
      "badge": "Solar",
      "color": "linear-gradient(180deg, #0e9f5c 0%, #07192f 100%)",
      "content": "Community Solar Hub operational in P.M. Khali. Powering sustainable battery mobility."
    },
    {
      "id": "story-03",
      "author": "Fishery Project",
      "title": "Fish Culture",
      "sub": "Harvest Season",
      "badge": "Agro",
      "color": "linear-gradient(180deg, #0284c7 0%, #0B2545 100%)",
      "content": "P.M. Khali fingerling culture harvest progressing with strong seasonal market demand."
    },
    {
      "id": "story-04",
      "author": "Executive Council",
      "title": "AGM 2024",
      "sub": "Audit & Review",
      "badge": "Meeting",
      "color": "linear-gradient(180deg, #b8893a 0%, #0B2545 100%)",
      "content": "Annual General Meeting reviewing fiscal year audit records and member equity allocations."
    },
    {
      "id": "story-05",
      "author": "Savings Desk",
      "title": "\u09f3 10 Lakh+",
      "sub": "Savings Milestone",
      "badge": "Finance",
      "color": "linear-gradient(180deg, #e11d48 0%, #0B2545 100%)",
      "content": "Cumulative member savings crossed \u09f3 1,050,000 in Islami Bank Bangladesh cooperative reserve."
    }
  ],
  "notifications": [
    {
      "id": "notif-01",
      "title": "Investment #01 Settled",
      "body": "Md. Nurul Islam cleared final installment #18. Investment successfully COMPLETED.",
      "time": "15m ago",
      "read": false,
      "link": "#/inv/01",
      "icon": "cash"
    },
    {
      "id": "notif-02",
      "title": "Installment Received",
      "body": "Abul Kalam submitted installment #15 for Combined Tomtom & Solar Unit.",
      "time": "2h ago",
      "read": false,
      "link": "#/inv/02%20%26%2003",
      "icon": "check"
    },
    {
      "id": "notif-03",
      "title": "Executive Audit Ready",
      "body": "Annual Cooperative Audit & Portfolio Report generated by Finance Secretary.",
      "time": "5h ago",
      "read": true,
      "link": "#/report",
      "icon": "file"
    },
    {
      "id": "notif-04",
      "title": "Monthly Savings Notice",
      "body": "October 2024 monthly share collection register is now open.",
      "time": "1d ago",
      "read": true,
      "link": "#/members",
      "icon": "users"
    }
  ]
};
let PPBF_DATA = null;
let PPBF_PHOTOS = {};
let EDIT_PASSWORD = "ppbf2023";
let CURRENT_ACTIVE_TAB = "home";

// Initialize Data Store
function initData() {
  try {
    const saved = localStorage.getItem('ppbf_data_fb_v1');
    if (saved) {
      PPBF_DATA = JSON.parse(saved);
    } else {
      PPBF_DATA = JSON.parse(JSON.stringify(FB_SEED_DATA));
      saveData();
    }
  } catch (e) {
    console.error("Storage read error, using seed", e);
    PPBF_DATA = JSON.parse(JSON.stringify(FB_SEED_DATA));
  }

  try {
    const savedPhotos = localStorage.getItem('ppbf_photos_fb_v1');
    if (savedPhotos) {
      PPBF_PHOTOS = JSON.parse(savedPhotos);
    }
  } catch (e) {
    console.error("Photo storage read error", e);
  }

  syncInvestments();
}

function saveData() {
  if (!PPBF_DATA) return;
  try {
    localStorage.setItem('ppbf_data_fb_v1', JSON.stringify(PPBF_DATA));
  } catch (e) {
    console.error("Storage save failed", e);
  }
}

function savePhoto(key, dataUrl) {
  PPBF_PHOTOS[key] = dataUrl;
  try {
    localStorage.setItem('ppbf_photos_fb_v1', JSON.stringify(PPBF_PHOTOS));
  } catch (e) {
    console.error("Photo save failed", e);
  }
}

function deletePhoto(key) {
  delete PPBF_PHOTOS[key];
  try {
    localStorage.setItem('ppbf_photos_fb_v1', JSON.stringify(PPBF_PHOTOS));
  } catch (e) {
    console.error("Photo delete failed", e);
  }
}

function getPhoto(key) {
  return PPBF_PHOTOS[key] || null;
}

function normalizeDate(dStr) {
  if (!dStr) return "";
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatTaka(val) {
  const num = parseFloat(val) || 0;
  return '৳ ' + num.toLocaleString('en-US');
}

// Sync Rules: Master Form -> Followed by List Record
function syncInvestments() {
  if (!PPBF_DATA || !PPBF_DATA.investments) return;
  const forms = PPBF_DATA.investments.forms || {};
  let list = PPBF_DATA.investments.list || [];

  for (const [no, form] of Object.entries(forms)) {
    form.issue_date = normalizeDate(form.issue_date);
    form.end_date = normalizeDate(form.end_date);
    if (!form.date) form.date = new Date().toISOString().split('T')[0];

    if (!form.rows || !Array.isArray(form.rows)) form.rows = [];
    while (form.rows.length < 24) {
      form.rows.push({
        no: form.rows.length + 1,
        month: "",
        received_date: "",
        description: "",
        paid_amount: 0,
        receiver_sign: "",
        remarks: ""
      });
    }

    let totalReceived = 0;
    form.rows.forEach(r => {
      const amt = parseFloat(r.paid_amount) || 0;
      if (amt > 0) totalReceived += amt;
      if (r.received_date) r.received_date = normalizeDate(r.received_date);
    });

    const totalAmt = parseFloat(form.total) || 0;
    const secAmt = parseFloat(form.security) || 0;
    
    let dueAmt = (form.status === "COMPLETED") ? 0 : Math.max(0, totalAmt - secAmt - totalReceived);

    let item = list.find(l => String(l.no) === String(no));
    if (!item) {
      item = { no: no };
      list.push(item);
    }
    item.receiver = form.receiver;
    item.receiver_bn = form.receiver_bn || "";
    item.type = form.type;
    item.size = item.size || form.type;
    item.total = totalAmt;
    item.received = totalReceived;
    item.forum_invested = parseFloat(form.forum_invested) || (totalAmt - secAmt);
    item.security = secAmt;
    item.profit = parseFloat(form.profit) || 0;
    item.due = dueAmt;
    item.installments = parseInt(form.installments) || 18;
    item.issue_date = form.issue_date;
    item.end_date = form.end_date;
    item.status = form.status || "RUNNING";
    item.remarks = form.remarks || "";
    item.guarantor_name = form.guarantor_name;
    item.guarantor_mobile = form.guarantor_mobile;
  }

  PPBF_DATA.investments.list = list;
  saveData();
}

// Mode Management
function isEditMode() {
  return sessionStorage.getItem('ppbf_edit_mode') === 'true';
}

function toggleEditMode() {
  if (isEditMode()) {
    sessionStorage.setItem('ppbf_edit_mode', 'false');
    showToast("Switched to View-Only mode.");
    renderRoute();
  } else {
    openPasswordModal();
  }
}

function openPasswordModal() {
  const existing = document.getElementById('pw-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'pw-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--fb-text-primary);">Unlock Management Edit Mode</h3>
        <button class="fb-icon-btn" style="width:32px;height:32px;" onclick="document.getElementById('pw-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 13.5px; color: var(--fb-text-secondary); margin-bottom: 14px;">
          Enter management passkey to unlock inline editing. Changes will save automatically.
        </p>
        <div style="margin-bottom: 12px;">
          <input type="password" id="pw-input" placeholder="Enter passkey (default: ppbf2023)" 
            style="width: 100%; padding: 10px 14px; border: 1px solid var(--fb-border); border-radius: 8px; font-size: 14px;" 
            onkeydown="if(event.key==='Enter') submitPassword()" />
          <span style="font-size: 11.5px; color: var(--fb-blue); display: block; margin-top: 6px;">Passkey: <strong>ppbf2023</strong></span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="fb-action-btn" style="max-width:100px;" onclick="document.getElementById('pw-modal').remove()">Cancel</button>
        <button class="fb-action-btn" style="background:var(--fb-blue);color:#fff;max-width:140px;font-weight:700;" onclick="submitPassword()">Unlock</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {
    const inp = document.getElementById('pw-input');
    if (inp) inp.focus();
  }, 50);
}

function submitPassword() {
  const inp = document.getElementById('pw-input');
  if (inp && inp.value.trim() === EDIT_PASSWORD) {
    sessionStorage.setItem('ppbf_edit_mode', 'true');
    const modal = document.getElementById('pw-modal');
    if (modal) modal.remove();
    showToast("Edit Mode unlocked. All fields are editable.");
    renderRoute();
  } else {
    alert("Incorrect password. Default is 'ppbf2023'.");
  }
}

function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'no-print';
    container.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = 'background:rgba(11,37,69,0.92);color:#fff;padding:10px 20px;border-radius:9999px;font-size:13.5px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;gap:8px;backdrop-filter:blur(4px);';
  toast.innerHTML = `<span>✓</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function autoScaleA4() {
  const wrappers = document.querySelectorAll('.a4-screen-wrapper');
  wrappers.forEach(w => {
    const frame = w.querySelector('.a4-page-frame');
    if (!frame) return;
    const availWidth = w.clientWidth - 20;
    if (availWidth < 794) {
      const scale = Math.max(0.35, availWidth / 794);
      frame.style.transform = `scale(${scale})`;
      frame.style.transformOrigin = 'top center';
      w.style.height = `${Math.round(1122 * scale + 24)}px`;
    } else {
      frame.style.transform = 'none';
      w.style.height = 'auto';
    }
  });
}
window.addEventListener('resize', autoScaleA4);

// Functional Reactions (Like / Love / Care)
function togglePostReaction(postId) {
  const post = PPBF_DATA.posts.find(p => p.id === postId);
  if (!post) return;
  if (!post.user_reacted) {
    post.user_reacted = 'like';
    post.likes = (post.likes || 0) + 1;
    post.reactions.like = (post.reactions.like || 0) + 1;
  } else if (post.user_reacted === 'like') {
    post.user_reacted = 'love';
    post.reactions.like = Math.max(0, post.reactions.like - 1);
    post.reactions.love = (post.reactions.love || 0) + 1;
  } else {
    post.user_reacted = null;
    post.likes = Math.max(0, post.likes - 1);
    post.reactions.love = Math.max(0, post.reactions.love - 1);
  }
  saveData();
  renderRoute();
}

// Functional Comments
function addPostComment(postId, inputElem) {
  const text = inputElem.value.trim();
  if (!text) return;
  const post = PPBF_DATA.posts.find(p => p.id === postId);
  if (!post) return;
  if (!post.comments) post.comments = [];
  post.comments.push({
    author: "Nabi Hossain",
    text: text,
    time: "Just now"
  });
  inputElem.value = "";
  saveData();
  renderRoute();
  showToast("Comment posted.");
}

// Functional Post Creation
function openCreatePostModal() {
  const existing = document.getElementById('post-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'post-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--fb-text-primary);">Create Forum Post</h3>
        <button class="fb-icon-btn" style="width:32px;height:32px;" onclick="document.getElementById('post-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div class="fb-user-avatar" style="width:36px;height:36px;font-size:13px;">N</div>
          <div>
            <div style="font-weight:700;font-size:14px;">Nabi Hossain</div>
            <div style="font-size:11.5px;color:var(--fb-text-secondary);">Finance Secretary • Public</div>
          </div>
        </div>
        <textarea id="new-post-text" placeholder="What's on your mind? Share an investment update, member notice, or forum news..." 
          style="width:100%;height:100px;border:none;outline:none;font-size:15px;resize:none;font-family:inherit;"></textarea>
        
        <div style="margin-top:10px;border:1px solid var(--fb-border-light);border-radius:8px;padding:10px;">
          <label style="font-size:12px;font-weight:700;color:var(--navy);display:block;margin-bottom:6px;">Link Investment Form (Optional)</label>
          <select id="new-post-inv" style="width:100%;padding:6px 10px;border:1px solid var(--fb-border);border-radius:6px;font-size:13px;">
            <option value="">None (General Forum Notice)</option>
            ${PPBF_DATA.investments.list.map(i => `<option value="${i.no}">#${i.no} - ${i.receiver} (${i.type})</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="fb-action-btn" style="background:var(--fb-blue);color:#fff;font-weight:700;width:100%;padding:10px;border-radius:6px;" onclick="submitNewPost()">
          Post to Forum
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function submitNewPost() {
  const text = document.getElementById('new-post-text').value.trim();
  const invRef = document.getElementById('new-post-inv').value;
  if (!text) {
    alert("Please write something to share.");
    return;
  }
  const newPost = {
    id: "post-" + Date.now(),
    author: "Nabi Hossain",
    author_role: "Finance Secretary, PPBF",
    author_avatar: "N",
    time: "Just now",
    content_bn: text,
    content_en: text,
    inv_ref: invRef || null,
    likes: 1,
    reactions: {"like": 1, "love": 0, "care": 0},
    user_reacted: "like",
    comments: []
  };
  PPBF_DATA.posts.unshift(newPost);
  saveData();
  document.getElementById('post-modal').remove();
  showToast("Post shared to news feed.");
  renderRoute();
}

// Functional Story Viewer
function openStoryModal(storyId) {
  const story = PPBF_DATA.stories.find(s => s.id === storyId);
  if (!story) return;

  const existing = document.getElementById('story-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'story-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div style="max-width:380px;width:100%;height:580px;background:${story.color};border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,0.5);display:flex;flex-direction:column;justify-content:space-between;padding:16px;color:#fff;position:relative;overflow:hidden;">
      <!-- Progress Bar at Top -->
      <div style="width:100%;height:3px;background:rgba(255,255,255,0.3);border-radius:2px;overflow:hidden;">
        <div style="width:100%;height:100%;background:#ffffff;animation:storyProg 6s linear;"></div>
      </div>
      
      <!-- Top Author Row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="fb-story-avatar" style="width:34px;height:34px;border-color:#fff;">${story.author.charAt(0)}</div>
          <div>
            <div style="font-weight:700;font-size:13.5px;">${story.author}</div>
            <div style="font-size:11px;opacity:0.8;">${story.sub}</div>
          </div>
        </div>
        <button onclick="document.getElementById('story-modal').remove()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
      </div>

      <!-- Center Content -->
      <div style="text-align:center;padding:20px 10px;">
        <div style="font-size:28px;font-weight:800;font-family:'Cormorant Garamond',serif;margin-bottom:12px;">${story.title}</div>
        <div style="background:rgba(255,255,255,0.18);padding:14px;border-radius:12px;font-size:14px;line-height:1.5;backdrop-filter:blur(4px);">
          ${story.content}
        </div>
      </div>

      <!-- Bottom Reaction Strip -->
      <div style="display:flex;gap:8px;">
        <input type="text" placeholder="Reply to story..." style="flex:1;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);border-radius:9999px;padding:8px 14px;color:#fff;outline:none;" />
        <button class="fb-icon-btn" style="background:rgba(255,255,255,0.25);color:#fff;" onclick="showToast('Story liked! ❤️')">❤️</button>
        <button class="fb-icon-btn" style="background:rgba(255,255,255,0.25);color:#fff;" onclick="showToast('Story liked! 👍')">👍</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Functional Notification Click
function clickNotification(notifId, link) {
  const notif = PPBF_DATA.notifications.find(n => n.id === notifId);
  if (notif) notif.read = true;
  saveData();
  window.location.hash = link;
}

function exportDataJSON() {
  const fullBackup = {
    data: PPBF_DATA,
    photos: PPBF_PHOTOS,
    exported_at: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PPBF_Facebook_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Database JSON exported.");
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.data) {
        PPBF_DATA = parsed.data;
        if (parsed.photos) PPBF_PHOTOS = parsed.photos;
      } else {
        PPBF_DATA = parsed;
      }
      saveData();
      syncInvestments();
      showToast("Data restored from JSON.");
      renderRoute();
    } catch (err) {
      alert("Invalid JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

function resetToSeed() {
  if (confirm("Reset all forum data and investments to factory seed?")) {
    PPBF_DATA = JSON.parse(JSON.stringify(FB_SEED_DATA));
    PPBF_PHOTOS = {};
    saveData();
    localStorage.removeItem('ppbf_photos_fb_v1');
    syncInvestments();
    showToast("Restored factory seed.");
    renderRoute();
  }
}

function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'PPBF - Parania Para Business Forum',
      text: 'Cooperative savings, vehicle financing & A4 statements for Parania Para Business Forum.',
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast("Forum link copied to clipboard!");
  }
}

function updateFormField(invNo, field, val) {
  if (!PPBF_DATA.investments.forms[invNo]) return;
  PPBF_DATA.investments.forms[invNo][field] = val;
  syncInvestments();
  showToast("Saved.");
}

function updateRowField(invNo, rowIndex, field, val) {
  if (!PPBF_DATA.investments.forms[invNo]) return;
  const row = PPBF_DATA.investments.forms[invNo].rows[rowIndex];
  if (!row) return;
  if (field === 'paid_amount') {
    row[field] = parseFloat(val) || 0;
  } else {
    row[field] = val;
  }
  syncInvestments();
  renderRoute();
  showToast("Installment updated.");
}

function handlePhotoUpload(key, inputElem) {
  const file = inputElem.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    savePhoto(key, e.target.result);
    showToast("Photo updated.");
    renderRoute();
  };
  reader.readAsDataURL(file);
}

function removePhoto(key) {
  if (confirm("Delete this photo?")) {
    deletePhoto(key);
    showToast("Photo deleted.");
    renderRoute();
  }
}
