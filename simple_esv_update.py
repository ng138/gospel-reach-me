#!/usr/bin/env python3
"""
Script to update the ESV Bible verses with inspirational and powerful verses.
"""

import json
import random

# Load the existing ESV verses file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_esv.json', 'r') as f:
    verses = json.load(f)

# Define a comprehensive collection of inspirational ESV verses
esv_verses = [
    {
        "verse_content": "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        "reference": "John 3:16"
    },
    {
        "verse_content": "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
        "reference": "Isaiah 40:31"
    },
    {
        "verse_content": "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
        "reference": "2 Corinthians 5:17"
    },
    {
        "verse_content": "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
        "reference": "Philippians 4:6-7"
    },
    {
        "verse_content": "The LORD is my shepherd; I shall not want.",
        "reference": "Psalm 23:1"
    },
    {
        "verse_content": "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
        "reference": "Romans 8:28"
    },
    {
        "verse_content": "Jesus said to him, 'I am the way, and the truth, and the life. No one comes to the Father except through me.'",
        "reference": "John 14:6"
    },
    {
        "verse_content": "Come to me, all who labor and are heavy laden, and I will give you rest.",
        "reference": "Matthew 11:28"
    },
    {
        "verse_content": "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
        "reference": "Matthew 6:33"
    },
    {
        "verse_content": "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",
        "reference": "Ephesians 2:8-9"
    },
    {
        "verse_content": "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me.",
        "reference": "Galatians 2:20"
    },
    {
        "verse_content": "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers, nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.",
        "reference": "Romans 8:38-39"
    },
    {
        "verse_content": "The thief comes only to steal and kill and destroy. I came that they may have life and have it abundantly.",
        "reference": "John 10:10"
    },
    {
        "verse_content": "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.",
        "reference": "Romans 6:23"
    },
    {
        "verse_content": "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly of my weaknesses, so that the power of Christ may rest upon me.",
        "reference": "2 Corinthians 12:9"
    },
    {
        "verse_content": "Casting all your anxieties on him, because he cares for you.",
        "reference": "1 Peter 5:7"
    },
    {
        "verse_content": "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
        "reference": "Jeremiah 29:11"
    },
    {
        "verse_content": "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
        "reference": "Proverbs 3:5-6"
    },
    {
        "verse_content": "I can do all things through him who strengthens me.",
        "reference": "Philippians 4:13"
    },
    {
        "verse_content": "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
        "reference": "Isaiah 41:10"
    },
    {
        "verse_content": "The LORD is my light and my salvation; whom shall I fear? The LORD is the stronghold of my life; of whom shall I be afraid?",
        "reference": "Psalm 27:1"
    },
    {
        "verse_content": "What then shall we say to these things? If God is for us, who can be against us?",
        "reference": "Romans 8:31"
    },
    {
        "verse_content": "No, in all these things we are more than conquerors through him who loved us.",
        "reference": "Romans 8:37"
    },
    {
        "verse_content": "I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world.",
        "reference": "John 16:33"
    },
    {
        "verse_content": "And my God will supply every need of yours according to his riches in glory in Christ Jesus.",
        "reference": "Philippians 4:19"
    },
    {
        "verse_content": "Let not your hearts be troubled. Believe in God; believe also in me.",
        "reference": "John 14:1"
    },
    {
        "verse_content": "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.",
        "reference": "John 14:27"
    },
    {
        "verse_content": "Greater love has no one than this, that someone lay down his life for his friends.",
        "reference": "John 15:13"
    },
    {
        "verse_content": "Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful.",
        "reference": "1 Corinthians 13:4-5"
    },
    {
        "verse_content": "So now faith, hope, and love abide, these three; but the greatest of these is love.",
        "reference": "1 Corinthians 13:13"
    },
    {
        "verse_content": "Above all, keep loving one another earnestly, since love covers a multitude of sins.",
        "reference": "1 Peter 4:8"
    },
    {
        "verse_content": "Beloved, let us love one another, for love is from God, and whoever loves has been born of God and knows God.",
        "reference": "1 John 4:7"
    },
    {
        "verse_content": "By this we know love, that he laid down his life for us, and we ought to lay down our lives for the brothers.",
        "reference": "1 John 3:16"
    },
    {
        "verse_content": "And above all these put on love, which binds everything together in perfect harmony.",
        "reference": "Colossians 3:14"
    },
    {
        "verse_content": "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
        "reference": "Ephesians 4:32"
    },
    {
        "verse_content": "Owe no one anything, except to love each other, for the one who loves another has fulfilled the law.",
        "reference": "Romans 13:8"
    },
    {
        "verse_content": "Anyone who does not love does not know God, because God is love.",
        "reference": "1 John 4:8"
    },
    {
        "verse_content": "For God gave us a spirit not of fear but of power and love and self-control.",
        "reference": "2 Timothy 1:7"
    },
    {
        "verse_content": "Be strong, and let your heart take courage, all you who wait for the LORD!",
        "reference": "Psalm 31:24"
    },
    {
        "verse_content": "God is our refuge and strength, a very present help in trouble.",
        "reference": "Psalm 46:1"
    },
    {
        "verse_content": "He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore, for the former things have passed away.",
        "reference": "Revelation 21:4"
    },
    {
        "verse_content": "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.",
        "reference": "Lamentations 3:22-23"
    },
    {
        "verse_content": "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law.",
        "reference": "Galatians 5:22-23"
    },
    {
        "verse_content": "Rejoice in the Lord always; again I will say, rejoice.",
        "reference": "Philippians 4:4"
    },
    {
        "verse_content": "Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.",
        "reference": "Philippians 4:8"
    },
    {
        "verse_content": "Count it all joy, my brothers, when you meet trials of various kinds, for you know that the testing of your faith produces steadfastness.",
        "reference": "James 1:2-3"
    },
    {
        "verse_content": "The LORD is near to the brokenhearted and saves the crushed in spirit.",
        "reference": "Psalm 34:18"
    },
    {
        "verse_content": "The name of the LORD is a strong tower; the righteous man runs into it and is safe.",
        "reference": "Proverbs 18:10"
    },
    {
        "verse_content": "No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.",
        "reference": "1 Corinthians 10:13"
    },
    {
        "verse_content": "Delight yourself in the LORD, and he will give you the desires of your heart.",
        "reference": "Psalm 37:4"
    },
    {
        "verse_content": "The LORD will fight for you, and you have only to be silent.",
        "reference": "Exodus 14:14"
    },
    {
        "verse_content": "There is therefore now no condemnation for those who are in Christ Jesus.",
        "reference": "Romans 8:1"
    },
    {
        "verse_content": "May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.",
        "reference": "Romans 15:13"
    },
    {
        "verse_content": "For we walk by faith, not by sight.",
        "reference": "2 Corinthians 5:7"
    },
    {
        "verse_content": "Now faith is the assurance of things hoped for, the conviction of things not seen.",
        "reference": "Hebrews 11:1"
    },
    {
        "verse_content": "Be watchful, stand firm in the faith, act like men, be strong.",
        "reference": "1 Corinthians 16:13"
    },
    {
        "verse_content": "And without faith it is impossible to please him, for whoever would draw near to God must believe that he exists and that he rewards those who seek him.",
        "reference": "Hebrews 11:6"
    },
    {
        "verse_content": "For everyone who has been born of God overcomes the world. And this is the victory that has overcome the world—our faith.",
        "reference": "1 John 5:4"
    },
    {
        "verse_content": "You keep him in perfect peace whose mind is stayed on you, because he trusts in you.",
        "reference": "Isaiah 26:3"
    },
    {
        "verse_content": "And let the peace of Christ rule in your hearts, to which indeed you were called in one body. And be thankful.",
        "reference": "Colossians 3:15"
    },
    {
        "verse_content": "In peace I will both lie down and sleep; for you alone, O LORD, make me dwell in safety.",
        "reference": "Psalm 4:8"
    },
    {
        "verse_content": "Strive for peace with everyone, and for the holiness without which no one will see the Lord.",
        "reference": "Hebrews 12:14"
    },
    {
        "verse_content": "Blessed are the peacemakers, for they shall be called sons of God.",
        "reference": "Matthew 5:9"
    },
    {
        "verse_content": "Do not be overcome by evil, but overcome evil with good.",
        "reference": "Romans 12:21"
    },
    {
        "verse_content": "A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another.",
        "reference": "John 13:34"
    },
    {
        "verse_content": "Your word is a lamp to my feet and a light to my path.",
        "reference": "Psalm 119:105"
    },
    {
        "verse_content": "Whatever you do, work heartily, as for the Lord and not for men.",
        "reference": "Colossians 3:23"
    }
]

# Keep track of the first 25 verses which already have actual translations
keep_first_25 = {verse["index"]: verse for verse in verses if int(verse["index"]) <= 25}

# Create a new list of verses
new_verses = []

# Add the first 25 verses
for i in range(1, 26):
    index = f"{i:03d}"
    if index in keep_first_25:
        new_verses.append(keep_first_25[index])

# Shuffle the inspirational verses to randomize them
random.shuffle(esv_verses)

# Add the remaining verses to reach 500 total
for i in range(26, 501):
    index = f"{i:03d}"
    # Use a verse from our inspirational collection, cycling through them
    verse_data = esv_verses[(i - 26) % len(esv_verses)]
    new_verses.append({
        "index": index,
        "verse_content": verse_data["verse_content"],
        "reference": verse_data["reference"]
    })

# Write the updated verses back to the file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_esv.json', 'w', encoding='utf-8') as f:
    json.dump(new_verses, f, indent=2, ensure_ascii=False)

print("Successfully updated ESV Bible verses with 500 inspirational and powerful verses.")
