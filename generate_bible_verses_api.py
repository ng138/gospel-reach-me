#!/usr/bin/env python3
"""
API-driven Bible verse generator.
Fetches 500 unique random verses per translation using scripture.api.bible.
"""

import os
import json
import requests
import time
import re
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("BIBLE_API_KEY")
if not API_KEY:
    raise RuntimeError("Please set BIBLE_API_KEY in your environment (.env)")

# Map translation codes to Scripture API Bible IDs
# Replace the placeholder IDs with your actual Bible IDs from https://scripture.api.bible/v1/bibles
translation_ids = {
    "fr_lsg": os.getenv("BIBLE_ID_FR_LSG"),
    "fr_bds": os.getenv("BIBLE_ID_FR_BDS"),
    "it_cei": os.getenv("BIBLE_ID_IT_CEI"),
    "it_nr94": os.getenv("BIBLE_ID_IT_NR94"),
    "es_rvr60": os.getenv("BIBLE_ID_ES_RVR60"),
    "es_nvi": os.getenv("BIBLE_ID_ES_NVI"),
    "de_elb": os.getenv("BIBLE_ID_DE_ELB"),
    "de_luth2017": os.getenv("BIBLE_ID_DE_LUTH2017"),
}

headers = {
    "api-key": API_KEY,
    "Accept": "application/json"
}

def fetch_random_verses(key, bible_id, total=500):
    verses = []
    seen = set()
    url = f"https://api.scripture.api.bible/v1/bibles/{bible_id}/passages/random"
    params = {
        "include-verse-numbers": "false",
        "include-first-verse-numbers": "false",
        "include-footnotes": "false",
        "include-headings": "false"
    }
    while len(verses) < total:
        resp = requests.get(url, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json().get("data", {})
        reference = data.get("reference", "")
        content_html = data.get("content", "")
        text = re.sub("<[^<]+?>", "", content_html).strip()
        if not reference or not text or reference in seen:
            continue
        seen.add(reference)
        verses.append({
            "index": f"{len(verses)+1:03d}",
            "verse_content": text,
            "reference": reference
        })
        time.sleep(0.1)
    return verses

def main():
    output_dir = os.path.join("worker", "src", "data", "bible_verses")
    os.makedirs(output_dir, exist_ok=True)

    for key, bible_id in translation_ids.items():
        if not bible_id:
            print(f"Skipping {key}: missing Bible ID in environment.")
            continue
        print(f"Fetching 500 verses for {key}...")
        verses = fetch_random_verses(key, bible_id)
        filename = os.path.join(output_dir, f"bible_verses_{key}.json")
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(verses, f, ensure_ascii=False, indent=2)
        print(f"Wrote {len(verses)} verses to {filename}")

if __name__ == "__main__":
    main()
