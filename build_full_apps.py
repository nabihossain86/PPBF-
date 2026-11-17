import json
import base64
import os

print("Assembling generator...")

# Load seed data
with open('seed_data.json', 'r') as f:
    seed_data = json.load(f)

with open('logo_base64.txt', 'r') as f:
    logo_b64 = f.read().strip()

print(f"Loaded {len(seed_data['investments']['list'])} seed investments and logo.")
