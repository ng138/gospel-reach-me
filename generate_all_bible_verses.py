import json
import os

# Define inspirational verses for each translation (add 20-30 unique entries per list)
verses_data = {
    "de_elb": [
        {"verse_content": "Alles vermag ich durch den, der mich stark macht.", "reference": "Philipper 4,13"},
        {"verse_content": "Denn so sehr hat Gott die Welt geliebt, dass er seinen eingeborenen Sohn gab, damit jeder, der an ihn glaubt, nicht verloren geht, sondern ewiges Leben hat.", "reference": "Johannes 3,16"},
        {"verse_content": "Der HERR ist mein Hirte, mir wird nichts mangeln.", "reference": "Psalm 23,1"},
        {"verse_content": "Fürchte dich nicht, denn ich bin mit dir; sei nicht ängstlich, denn ich bin dein Gott. Ich stärke dich, ich helfe dir auch, ich halte dich durch die rechte Hand meiner Gerechtigkeit.", "reference": "Jesaja 41,10"},
        {"verse_content": "Befiehl dem HERRN deine Wege und vertraue auf ihn, so wird er handeln.", "reference": "Psalm 37,5"},
        {"verse_content": "Der Herr, dein Gott, ist in deiner Mitte, ein Held, der rettet.", "reference": "Zefanja 3,17"},
        {"verse_content": "Ich bin das Licht der Welt. Wer mir nachfolgt, wird nicht in der Finsternis wandeln, sondern wird das Licht des Lebens haben.", "reference": "Johannes 8,12"},
        # ... add more unique ELB verses ...
    ],
    "de_luth2017": [
        {"verse_content": "Ich vermag alles durch den, der mich mächtig macht, Christus.", "reference": "Philipper 4,13"},
        {"verse_content": "Denn also hat Gott die Welt geliebt, dass er seinen eingeborenen Sohn gab, damit alle, die an ihn glauben, nicht verloren werden, sondern das ewige Leben haben.", "reference": "Johannes 3,16"},
        {"verse_content": "Der HERR ist mein Hirte, mir wird nichts mangeln.", "reference": "Psalm 23,1"},
        {"verse_content": "Fürchte dich nicht, denn ich bin mit dir; sei nicht ängstlich, denn ich bin dein Gott! Ich stärke dich, ich helfe dir auch, ich halte dich durch die rechte Hand meiner Gerechtigkeit.", "reference": "Jesaja 41,10"},
        # ... add more unique LUTH2017 verses ...
    ],
    "fr_lsg": [
        {"verse_content": "Je puis tout par celui qui me fortifie.", "reference": "Philippiens 4,13"},
        # ...
    ],
    "fr_bds": [
        {"verse_content": "Je peux tout grâce à celui qui me fortifie.", "reference": "Philippiens 4,13"},
        # ...
    ],
    "it_cei": [
        {"verse_content": "Tutto posso in colui che mi dà la forza.", "reference": "Filippesi 4:13"},
        # ...
    ],
    "it_nr94": [
        {"verse_content": "Io posso ogni cosa in colui che mi fortifica.", "reference": "Filippesi 4:13"},
        # ...
    ],
    "es_rvr60": [
        {"verse_content": "Todo lo puedo en Cristo que me fortalece.", "reference": "Filipenses 4:13"},
        # ...
    ],
    "es_nvi": [
        {"verse_content": "Todo lo puedo en Cristo que me fortalece.", "reference": "Filipenses 4:13"},
        # ...
    ],
}

# Placeholder references for generating dynamic verses beyond seeded data
placeholder_references = [
  "Psalm 119:105", "Proverbs 16:9", "Isaiah 26:3", "Matthew 11:28-30",
  "John 14:6", "Romans 12:2", "1 Corinthians 10:13", "2 Corinthians 5:17",
  "Galatians 5:22-23", "Ephesians 2:8-9", "Philippians 1:6", "Colossians 3:23",
  "1 Thessalonians 5:16-18", "1 Timothy 4:12", "Hebrews 11:1", "James 1:5",
  "1 Peter 3:15", "1 John 1:9", "Revelation 21:4"
]

output_dir = os.path.join("worker", "src", "data", "bible_verses")
filename_map = {
    "de_elb": "bible_verses_de_elb.json",
    "de_luth2017": "bible_verses_de_luth2017.json",
    "fr_lsg": "bible_verses_fr_lsg.json",
    "fr_bds": "bible_verses_fr_bds.json",
    "it_cei": "bible_verses_it_cei.json",
    "it_nr94": "bible_verses_it_nr94.json",
    "es_rvr60": "bible_verses_es_rvr60.json",
    "es_nvi": "bible_verses_es_nvi.json",
}

def generate_verses(verse_list, key, total=500):
    """Generate verses: seeded data first, then placeholders for diversity"""
    result = []
    for i in range(total):
        index = f"{i+1:03d}"
        if i < len(verse_list):
            verse = verse_list[i].copy()
            verse["index"] = index
        else:
            ref = placeholder_references[(i - len(verse_list)) % len(placeholder_references)]
            verse = {
                "index": index,
                "verse_content": f"{key.upper()} Bible verse #{index} - placeholder for {ref}",
                "reference": ref
            }
        result.append(verse)
    return result

def write_json(filename, data):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    for key, verses in verses_data.items():
        if not verses:
            print(f"Warning: No verses provided for {key}. Skipping.")
            continue
        path = os.path.join(output_dir, filename_map[key])
        write_json(path, generate_verses(verses, key))
        print(f"Wrote 500 verses to {path}")

if __name__ == "__main__":
    main()
