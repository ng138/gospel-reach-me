#!/usr/bin/env python3
"""
Script to update the NIV Bible verses with a diverse collection of
inspirational and powerful verses from throughout the Bible.
"""

import json
import random

# Load the existing NIV verses file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_niv.json', 'r') as f:
    verses = json.load(f)

# Define a comprehensive collection of inspirational NIV verses from throughout the Bible
inspirational_verses = [
    {
        "verse_content": "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
        "reference": "Jeremiah 29:11"
    },
    {
        "verse_content": "I can do all this through him who gives me strength.",
        "reference": "Philippians 4:13"
    },
    {
        "verse_content": "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        "reference": "Proverbs 3:5-6"
    },
    {
        "verse_content": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        "reference": "Romans 8:28"
    },
    {
        "verse_content": "Jesus looked at them and said, 'With man this is impossible, but with God all things are possible.'",
        "reference": "Matthew 19:26"
    },
    {
        "verse_content": "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
        "reference": "Joshua 1:9"
    },
    {
        "verse_content": "The LORD is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him.",
        "reference": "Psalm 28:7"
    },
    {
        "verse_content": "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        "reference": "Isaiah 40:31"
    },
    {
        "verse_content": "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
        "reference": "2 Corinthians 5:17"
    },
    {
        "verse_content": "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
        "reference": "Philippians 4:6-7"
    },
    {
        "verse_content": "The name of the LORD is a fortified tower; the righteous run to it and are safe.",
        "reference": "Proverbs 18:10"
    },
    {
        "verse_content": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        "reference": "John 3:16"
    },
    {
        "verse_content": "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
        "reference": "Joshua 1:9"
    },
    {
        "verse_content": "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
        "reference": "Matthew 6:33"
    },
    {
        "verse_content": "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.",
        "reference": "Mark 11:24"
    },
    {
        "verse_content": "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.",
        "reference": "Deuteronomy 31:8"
    },
    {
        "verse_content": "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
        "reference": "Romans 8:38-39"
    },
    {
        "verse_content": "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.",
        "reference": "James 1:2-3"
    },
    {
        "verse_content": "No, in all these things we are more than conquerors through him who loved us.",
        "reference": "Romans 8:37"
    },
    {
        "verse_content": "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.",
        "reference": "John 16:33"
    },
    {
        "verse_content": "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
        "reference": "Philippians 4:19"
    },
    {
        "verse_content": "Come to me, all you who are weary and burdened, and I will give you rest.",
        "reference": "Matthew 11:28"
    },
    {
        "verse_content": "What, then, shall we say in response to these things? If God is for us, who can be against us?",
        "reference": "Romans 8:31"
    },
    {
        "verse_content": "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
        "reference": "Ephesians 2:8-9"
    },
    {
        "verse_content": "But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness." Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.",
        "reference": "2 Corinthians 12:9"
    },
    {
        "verse_content": "Cast all your anxiety on him because he cares for you.",
        "reference": "1 Peter 5:7"
    },
    {
        "verse_content": "Commit to the LORD whatever you do, and he will establish your plans.",
        "reference": "Proverbs 16:3"
    },
    {
        "verse_content": "The LORD is close to the brokenhearted and saves those who are crushed in spirit.",
        "reference": "Psalm 34:18"
    },
    {
        "verse_content": "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
        "reference": "Galatians 5:22-23"
    },
    {
        "verse_content": "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
        "reference": "Galatians 6:9"
    },
    {
        "verse_content": "Take delight in the LORD, and he will give you the desires of your heart.",
        "reference": "Psalm 37:4"
    },
    {
        "verse_content": "The LORD will fight for you; you need only to be still.",
        "reference": "Exodus 14:14"
    },
    {
        "verse_content": "Therefore, there is now no condemnation for those who are in Christ Jesus.",
        "reference": "Romans 8:1"
    },
    {
        "verse_content": "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
        "reference": "Romans 15:13"
    },
    {
        "verse_content": "For we live by faith, not by sight.",
        "reference": "2 Corinthians 5:7"
    },
    {
        "verse_content": "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.",
        "reference": "Galatians 2:20"
    },
    {
        "verse_content": "Now faith is confidence in what we hope for and assurance about what we do not see.",
        "reference": "Hebrews 11:1"
    },
    {
        "verse_content": "Be on your guard; stand firm in the faith; be courageous; be strong.",
        "reference": "1 Corinthians 16:13"
    },
    {
        "verse_content": "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.",
        "reference": "Hebrews 11:6"
    },
    {
        "verse_content": "Jesus replied, 'Truly I tell you, if you have faith and do not doubt, not only can you do what was done to the fig tree, but also you can say to this mountain, Go, throw yourself into the sea, and it will be done.'",
        "reference": "Matthew 21:21"
    },
    {
        "verse_content": "For everyone born of God overcomes the world. This is the victory that has overcome the world, even our faith.",
        "reference": "1 John 5:4"
    },
    {
        "verse_content": "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
        "reference": "Isaiah 41:10"
    },
    {
        "verse_content": "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
        "reference": "John 14:27"
    },
    {
        "verse_content": "The LORD gives strength to his people; the LORD blesses his people with peace.",
        "reference": "Psalm 29:11"
    },
    {
        "verse_content": "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
        "reference": "Isaiah 26:3"
    },
    {
        "verse_content": "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.",
        "reference": "Colossians 3:15"
    },
    {
        "verse_content": "In peace I will lie down and sleep, for you alone, LORD, make me dwell in safety.",
        "reference": "Psalm 4:8"
    },
    {
        "verse_content": "Make every effort to live in peace with everyone and to be holy; without holiness no one will see the Lord.",
        "reference": "Hebrews 12:14"
    },
    {
        "verse_content": "Blessed are the peacemakers, for they will be called children of God.",
        "reference": "Matthew 5:9"
    },
    {
        "verse_content": "Finally, brothers and sisters, rejoice! Strive for full restoration, encourage one another, be of one mind, live in peace. And the God of love and peace will be with you.",
        "reference": "2 Corinthians 13:11"
    },
    {
        "verse_content": "Do not be overcome by evil, but overcome evil with good.",
        "reference": "Romans 12:21"
    },
    {
        "verse_content": "A new command I give you: Love one another. As I have loved you, so you must love one another.",
        "reference": "John 13:34"
    },
    {
        "verse_content": "Greater love has no one than this: to lay down one's life for one's friends.",
        "reference": "John 15:13"
    },
    {
        "verse_content": "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
        "reference": "1 Corinthians 13:4-5"
    },
    {
        "verse_content": "And now these three remain: faith, hope and love. But the greatest of these is love.",
        "reference": "1 Corinthians 13:13"
    },
    {
        "verse_content": "Above all, love each other deeply, because love covers over a multitude of sins.",
        "reference": "1 Peter 4:8"
    },
    {
        "verse_content": "Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God.",
        "reference": "1 John 4:7"
    },
    {
        "verse_content": "This is how we know what love is: Jesus Christ laid down his life for us. And we ought to lay down our lives for our brothers and sisters.",
        "reference": "1 John 3:16"
    },
    {
        "verse_content": "And over all these virtues put on love, which binds them all together in perfect unity.",
        "reference": "Colossians 3:14"
    },
    {
        "verse_content": "Be completely humble and gentle; be patient, bearing with one another in love.",
        "reference": "Ephesians 4:2"
    },
    {
        "verse_content": "Let no debt remain outstanding, except the continuing debt to love one another, for whoever loves others has fulfilled the law.",
        "reference": "Romans 13:8"
    },
    {
        "verse_content": "Whoever does not love does not know God, because God is love.",
        "reference": "1 John 4:8"
    },
    {
        "verse_content": "For God did not give us a spirit of timidity, but a spirit of power, of love and of self-discipline.",
        "reference": "2 Timothy 1:7"
    },
    {
        "verse_content": "Be strong and take heart, all you who hope in the LORD.",
        "reference": "Psalm 31:24"
    },
    {
        "verse_content": "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?",
        "reference": "Psalm 27:1"
    },
    {
        "verse_content": "The LORD is my shepherd, I lack nothing.",
        "reference": "Psalm 23:1"
    },
    {
        "verse_content": "God is our refuge and strength, an ever-present help in trouble.",
        "reference": "Psalm 46:1"
    }
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
random.shuffle(inspirational_verses)

# Add the remaining verses using the inspirational collection
for i in range(61, 501):
    index = f"{i:03d}"
    # Use a verse from our inspirational collection, cycling through them
    verse_data = inspirational_verses[(i - 61) % len(inspirational_verses)]
    new_verses.append({
        "index": index,
        "verse_content": verse_data["verse_content"],
        "reference": verse_data["reference"]
    })

# Write the updated verses back to the file
with open('/Users/noah/Desktop/NFCBible/worker/src/data/bible_verses/bible_verses_en_niv.json', 'w') as f:
    json.dump(new_verses, f, indent=2)

print("Successfully updated NIV Bible verses with inspirational and powerful verses from throughout the Bible.")
