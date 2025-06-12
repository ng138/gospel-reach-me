#!/usr/bin/env python3
"""
Script to fix Unicode escape sequences in the NIV Bible verses file.
"""

import json
import re

# Load the existing NIV verses file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_niv.json', 'r') as f:
    verses = json.load(f)

# Fix Unicode escape sequences in verse content
for verse in verses:
    # Replace \u2014 (em dash) with actual em dash character
    verse["verse_content"] = verse["verse_content"].replace("\\u2014", "—")
    
    # Convert any other escaped Unicode characters
    if "\\u" in verse["verse_content"]:
        # This will properly decode any Unicode escape sequences
        verse["verse_content"] = verse["verse_content"].encode().decode('unicode_escape')

# Write the updated verses back to the file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_niv.json', 'w', encoding='utf-8') as f:
    json.dump(verses, f, indent=2, ensure_ascii=False)

print("Successfully fixed Unicode escape sequences in NIV Bible verses.")
