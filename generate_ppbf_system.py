import json
import base64
import os

print("Building PPBF Complete System...")

# Load seed data & logo
with open('seed_data.json', 'r') as f:
    seed_data_json = f.read()

with open('logo_base64.txt', 'r') as f:
    logo_b64 = f.read().strip()

print(f"Seed data size: {len(seed_data_json)} bytes")
print(f"Logo b64 size: {len(logo_b64)} bytes")

