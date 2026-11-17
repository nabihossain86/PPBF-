import json
import os
import shutil

print("Creating Facebook UI generator for PPBF...")

with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

with open('seed_data.json', 'r') as f:
    SEED_DATA = json.load(f)

# Add sample feed posts, stories, and notifications to seed data
INITIAL_POSTS = [
    {
        "id": "post-01",
        "author": "Alhaj Mohammad Harun",
        "author_role": "President, PPBF",
        "author_avatar": "H",
        "time": "2 hours ago",
        "content_bn": "আলহামদুলিল্লাহ, পরানিয়া পাড়া বিজনেস ফোরামের আওতায় ১ম ব্যাচের টমটম বিনিয়োগের সকল কিস্তি সফলভাবে আদায় সম্পন্ন হয়েছে। সদস্যদের আমানত শতভাগ সুরক্ষিত।",
        "content_en": "Alhamdulillah, all installments for Batch #1 Tomtom vehicle financing (Investment #01 & #04) have been fully settled on time. All forum returns and security deposits have been processed transparently.",
        "inv_ref": "01",
        "likes": 28,
        "reactions": {"like": 18, "love": 7, "care": 3},
        "user_reacted": "like",
        "comments": [
            {"author": "Md. Nurul Absar", "text": "মাশাআল্লাহ, চমৎকার উদ্যোগ। ফোরাম এগিয়ে যাক।", "time": "1h ago"},
            {"author": "Nabi Hossain", "text": "সকল হিসাব অডিট রিপোর্টে প্রস্তুত রাখা হয়েছে।", "time": "45m ago"}
        ]
    },
    {
        "id": "post-02",
        "author": "Nabi Hossain",
        "author_role": "Finance Secretary",
        "author_avatar": "N",
        "time": "5 hours ago",
        "content_bn": "অক্টোবর ২০২৪ মাসের সঞ্চয় ও কিস্তি আদায় বিবরণী প্রস্তুত। সকল সম্মানিত সদস্যকে নির্ধারিত সময়ের মধ্যে সঞ্চয় জমা দেওয়ার অনুরোধ করা হচ্ছে।",
        "content_en": "Monthly Savings and Installment Collection Statement for October 2024 is now published. Cumulative savings crossed ৳ 1,050,000 milestone with 100% member participation.",
        "inv_ref": "02 & 03",
        "likes": 34,
        "reactions": {"like": 22, "love": 10, "care": 2},
        "user_reacted": None,
        "comments": [
            {"author": "Master Abdul Hakim", "text": "অভিনন্দন কার্যনির্বাহী কমিটিকে।", "time": "3h ago"}
        ]
    },
    {
        "id": "post-03",
        "author": "Md. Nurul Absar",
        "author_role": "General Secretary",
        "author_avatar": "A",
        "time": "1 day ago",
        "content_bn": "পি.এম.খালী ইউনিয়নে পরিবেশবান্ধব ১৫০০ ওয়াট সৌর বিদ্যুৎ ব্যাটারি চার্জিং হাব সফলভাবে চালু হয়েছে। স্থানীয় ১০টি টমটম গাড়ি এখান থেকে বিদ্যুৎ সেবা গ্রহণ করছে।",
        "content_en": "Cooperative Solar Charging Station (1500W Inverter + Heavy Battery Bank) in South Parania Para is operational. Supplying green charging energy to 10 community transport vehicles.",
        "inv_ref": "13",
        "likes": 42,
        "reactions": {"like": 25, "love": 14, "care": 3},
        "user_reacted": "love",
        "comments": [
            {"author": "Anwar Hossain", "text": "আমাদের চার্জিং স্টেশন খুব ভালো চলছে।", "time": "20h ago"},
            {"author": "Didarul Alam", "text": "বিদ্যুৎ বিভ্রাটেও গাড়ি চালানো সম্ভব হচ্ছে।", "time": "18h ago"}
        ]
    }
]

INITIAL_STORIES = [
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
        "title": "৳ 10 Lakh+",
        "sub": "Savings Milestone",
        "badge": "Finance",
        "color": "linear-gradient(180deg, #e11d48 0%, #0B2545 100%)",
        "content": "Cumulative member savings crossed ৳ 1,050,000 in Islami Bank Bangladesh cooperative reserve."
    }
]

INITIAL_NOTIFICATIONS = [
    {
        "id": "notif-01",
        "title": "Investment #01 Settled",
        "body": "Md. Nurul Islam cleared final installment #18. Investment successfully COMPLETED.",
        "time": "15m ago",
        "read": False,
        "link": "#/inv/01",
        "icon": "cash"
    },
    {
        "id": "notif-02",
        "title": "Installment Received",
        "body": "Abul Kalam submitted installment #15 for Combined Tomtom & Solar Unit.",
        "time": "2h ago",
        "read": False,
        "link": "#/inv/02%20%26%2003",
        "icon": "check"
    },
    {
        "id": "notif-03",
        "title": "Executive Audit Ready",
        "body": "Annual Cooperative Audit & Portfolio Report generated by Finance Secretary.",
        "time": "5h ago",
        "read": True,
        "link": "#/report",
        "icon": "file"
    },
    {
        "id": "notif-04",
        "title": "Monthly Savings Notice",
        "body": "October 2024 monthly share collection register is now open.",
        "time": "1d ago",
        "read": True,
        "link": "#/members",
        "icon": "users"
    }
]

SEED_DATA["posts"] = INITIAL_POSTS
SEED_DATA["stories"] = INITIAL_STORIES
SEED_DATA["notifications"] = INITIAL_NOTIFICATIONS

with open('seed_data_fb.json', 'w') as f:
    json.dump(SEED_DATA, f, indent=2)


