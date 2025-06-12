#!/usr/bin/env python3
"""
A simpler script to update the NIV Bible verses with inspirational content.
"""

import json
import random

# Load the existing NIV verses file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_niv.json', 'r') as f:
    verses = json.load(f)

# Define a list of inspirational Bible references and their verses
inspirational_references = [
    {"ref": "John 3:16", "text": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."},
    {"ref": "Philippians 4:13", "text": "I can do all this through him who gives me strength."},
    {"ref": "Jeremiah 29:11", "text": "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future."},
    {"ref": "Romans 8:28", "text": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."},
    {"ref": "Isaiah 40:31", "text": "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."},
    {"ref": "Proverbs 3:5-6", "text": "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."},
    {"ref": "Psalm 23:1", "text": "The LORD is my shepherd, I lack nothing."},
    {"ref": "1 Corinthians 13:4-5", "text": "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs."},
    {"ref": "Joshua 1:9", "text": "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go."},
    {"ref": "Matthew 11:28", "text": "Come to me, all you who are weary and burdened, and I will give you rest."},
    {"ref": "Romans 12:2", "text": "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will."},
    {"ref": "Philippians 4:6-7", "text": "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."},
    {"ref": "Psalm 46:1", "text": "God is our refuge and strength, an ever-present help in trouble."},
    {"ref": "John 14:6", "text": "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'"},
    {"ref": "Romans 8:38-39", "text": "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord."},
    {"ref": "2 Corinthians 5:17", "text": "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!"},
    {"ref": "Psalm 27:1", "text": "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?"},
    {"ref": "1 Peter 5:7", "text": "Cast all your anxiety on him because he cares for you."},
    {"ref": "Galatians 5:22-23", "text": "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law."},
    {"ref": "Ephesians 2:8-9", "text": "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast."},
    {"ref": "Hebrews 11:1", "text": "Now faith is confidence in what we hope for and assurance about what we do not see."},
    {"ref": "2 Timothy 1:7", "text": "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline."},
    {"ref": "Isaiah 41:10", "text": "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand."},
    {"ref": "Psalm 37:4", "text": "Take delight in the LORD, and he will give you the desires of your heart."},
    {"ref": "John 16:33", "text": "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world."},
    {"ref": "Matthew 6:33", "text": "But seek first his kingdom and his righteousness, and all these things will be given to you as well."},
    {"ref": "Philippians 4:19", "text": "And my God will meet all your needs according to the riches of his glory in Christ Jesus."},
    {"ref": "Romans 15:13", "text": "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit."},
    {"ref": "Psalm 34:18", "text": "The LORD is close to the brokenhearted and saves those who are crushed in spirit."},
    {"ref": "Proverbs 18:10", "text": "The name of the LORD is a fortified tower; the righteous run to it and are safe."},
    {"ref": "1 Corinthians 10:13", "text": "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it."},
    {"ref": "Romans 8:31", "text": "What, then, shall we say in response to these things? If God is for us, who can be against us?"},
    {"ref": "2 Corinthians 12:9", "text": "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me."},
    {"ref": "Proverbs 16:3", "text": "Commit to the LORD whatever you do, and he will establish your plans."},
    {"ref": "Psalm 119:105", "text": "Your word is a lamp for my feet, a light on my path."},
    {"ref": "Galatians 2:20", "text": "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me."},
    {"ref": "John 15:13", "text": "Greater love has no one than this: to lay down one's life for one's friends."},
    {"ref": "Deuteronomy 31:8", "text": "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged."},
    {"ref": "1 John 4:7", "text": "Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God."},
    {"ref": "Colossians 3:23", "text": "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."},
    {"ref": "Psalm 145:18", "text": "The LORD is near to all who call on him, to all who call on him in truth."}
]

# Keep track of the first 60 verses which already have actual translations
keep_first_60 = {verse["index"]: verse for verse in verses if int(verse["index"]) <= 60}

# Create a new list of verses
new_verses = []

# Add the first 60 verses
for i in range(1, 61):
    index = f"{i:03d}"
    if index in keep_first_60:
        new_verses.append(keep_first_60[index])

# Shuffle the inspirational verses to randomize them
random.shuffle(inspirational_references)

# Add the remaining verses using the inspirational collection
for i in range(61, 501):
    index = f"{i:03d}"
    # Use a verse from our inspirational collection, cycling through them
    verse_data = inspirational_references[(i - 61) % len(inspirational_references)]
    new_verses.append({
        "index": index,
        "verse_content": verse_data["text"],
        "reference": verse_data["ref"]
    })

# Write the updated verses back to the file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_niv.json', 'w') as f:
    json.dump(new_verses, f, indent=2)

print("Successfully updated NIV Bible verses with inspirational and powerful verses from throughout the Bible.")
