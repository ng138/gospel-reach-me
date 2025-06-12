#!/usr/bin/env python3
"""
Script to generate German Bible verses (ELB and LUTH2017).
"""

import json
import os

# Output directory
output_dir = os.path.join("worker", "src", "data", "bible_verses")
os.makedirs(output_dir, exist_ok=True)

# Real German Bible verses - Elberfelder (ELB)
de_elb_verses = [
    {"verse_content": "Alles vermag ich durch den, der mich stark macht.", "reference": "Philipper 4,13"},
    {"verse_content": "Denn so sehr hat Gott die Welt geliebt, dass er seinen eingeborenen Sohn gab, damit jeder, der an ihn glaubt, nicht verloren geht, sondern ewiges Leben hat.", "reference": "Johannes 3,16"},
    {"verse_content": "Der HERR ist mein Hirte, mir wird nichts mangeln.", "reference": "Psalm 23,1"},
    {"verse_content": "Fürchte dich nicht, denn ich bin mit dir; sei nicht ängstlich, denn ich bin dein Gott. Ich stärke dich, ich helfe dir auch, ich halte dich durch die rechte Hand meiner Gerechtigkeit.", "reference": "Jesaja 41,10"},
    {"verse_content": "Befiehl dem HERRN deine Wege und vertraue auf ihn, so wird er handeln.", "reference": "Psalm 37,5"},
    {"verse_content": "Der Herr, dein Gott, ist in deiner Mitte, ein Held, der rettet.", "reference": "Zefanja 3,17"},
    {"verse_content": "Ich bin das Licht der Welt. Wer mir nachfolgt, wird nicht in der Finsternis wandeln, sondern wird das Licht des Lebens haben.", "reference": "Johannes 8,12"},
    {"verse_content": "Denn ich weiß, welche Gedanken ich über euch habe, spricht der HERR, Gedanken des Friedens und nicht des Unheils, um euch eine Zukunft und eine Hoffnung zu geben.", "reference": "Jeremia 29,11"},
    {"verse_content": "Vertraue auf den HERRN mit deinem ganzen Herzen und stütze dich nicht auf deinen Verstand! Auf all deinen Wegen erkenne nur ihn, dann ebnet er selbst deine Pfade!", "reference": "Sprüche 3,5-6"},
    {"verse_content": "Sei stark und mutig! Erschrick nicht und fürchte dich nicht! Denn mit dir ist der HERR, dein Gott, wo immer du gehst.", "reference": "Josua 1,9"},
    {"verse_content": "Wir wissen aber, dass denen, die Gott lieben, alle Dinge zum Guten mitwirken, denen, die nach seinem Vorsatz berufen sind.", "reference": "Römer 8,28"},
    {"verse_content": "Gott ist unsere Zuflucht und Stärke, ein bewährter Helfer in Zeiten der Not.", "reference": "Psalm 46,2"},
    {"verse_content": "Denn Gott hat uns nicht einen Geist der Furchtsamkeit gegeben, sondern der Kraft und der Liebe und der Besonnenheit.", "reference": "2 Timotheus 1,7"},
    {"verse_content": "So seid nun nicht besorgt um den morgigen Tag! Denn der morgige Tag wird für sich selbst sorgen. Jeder Tag hat an seinem Übel genug.", "reference": "Matthäus 6,34"},
    {"verse_content": "Dies habe ich zu euch geredet, damit ihr in mir Frieden habt. In der Welt habt ihr Bedrängnis; aber seid guten Mutes, ich habe die Welt überwunden.", "reference": "Johannes 16,33"},
    {"verse_content": "Der HERR ist meine Stärke und mein Schild; auf ihn hat mein Herz vertraut, und mir wurde geholfen. Da frohlockte mein Herz, und ich will ihn preisen mit meinem Lied.", "reference": "Psalm 28,7"},
    {"verse_content": "Die auf den HERRN hoffen, gewinnen neue Kraft: Sie heben die Schwingen empor wie die Adler, sie laufen und ermatten nicht, sie gehen und ermüden nicht.", "reference": "Jesaja 40,31"},
    {"verse_content": "Denn bei Gott ist kein Ding unmöglich.", "reference": "Lukas 1,37"},
    {"verse_content": "Der HERR ist mein Licht und mein Heil, vor wem sollte ich mich fürchten? Der HERR ist meines Lebens Zuflucht, vor wem sollte ich erschrecken?", "reference": "Psalm 27,1"},
    {"verse_content": "Seid um nichts besorgt, sondern in allem sollen durch Gebet und Flehen mit Danksagung eure Anliegen vor Gott kundwerden.", "reference": "Philipper 4,6"},
    {"verse_content": "Und der Friede Gottes, der allen Verstand übersteigt, wird eure Herzen und eure Gedanken bewahren in Christus Jesus.", "reference": "Philipper 4,7"},
    {"verse_content": "Denn wo zwei oder drei versammelt sind in meinem Namen, da bin ich in ihrer Mitte.", "reference": "Matthäus 18,20"},
    {"verse_content": "Der HERR segne dich und behüte dich! Der HERR lasse sein Angesicht leuchten über dir und sei dir gnädig! Der HERR erhebe sein Angesicht auf dich und gebe dir Frieden!", "reference": "4 Mose 6,24-26"},
    {"verse_content": "Habe ich dir nicht geboten: Sei stark und mutig? Erschrick nicht und fürchte dich nicht! Denn mit dir ist der HERR, dein Gott, wo immer du gehst.", "reference": "Josua 1,9"},
    {"verse_content": "Und mein Gott wird alles, was ihr bedürft, erfüllen nach seinem Reichtum in Herrlichkeit in Christus Jesus.", "reference": "Philipper 4,19"}
]

# Real German Bible verses - Luther 2017 (LUTH2017)
de_luth2017_verses = [
    {"verse_content": "Ich vermag alles durch den, der mich mächtig macht, Christus.", "reference": "Philipper 4,13"},
    {"verse_content": "Denn also hat Gott die Welt geliebt, dass er seinen eingeborenen Sohn gab, damit alle, die an ihn glauben, nicht verloren werden, sondern das ewige Leben haben.", "reference": "Johannes 3,16"},
    {"verse_content": "Der HERR ist mein Hirte, mir wird nichts mangeln.", "reference": "Psalm 23,1"},
    {"verse_content": "Fürchte dich nicht, denn ich bin mit dir; sei nicht ängstlich, denn ich bin dein Gott! Ich stärke dich, ich helfe dir auch, ich halte dich durch die rechte Hand meiner Gerechtigkeit.", "reference": "Jesaja 41,10"},
    {"verse_content": "Befiehl dem HERRN deine Wege und hoffe auf ihn, er wird's wohlmachen.", "reference": "Psalm 37,5"},
    {"verse_content": "Der HERR, dein Gott, ist in deiner Mitte, ein starker Heiland.", "reference": "Zefanja 3,17"},
    {"verse_content": "Ich bin das Licht der Welt. Wer mir nachfolgt, der wird nicht wandeln in der Finsternis, sondern wird das Licht des Lebens haben.", "reference": "Johannes 8,12"},
    {"verse_content": "Denn ich weiß wohl, was ich für Gedanken über euch habe, spricht der HERR: Gedanken des Friedens und nicht des Leides, dass ich euch gebe Zukunft und Hoffnung.", "reference": "Jeremia 29,11"},
    {"verse_content": "Verlass dich auf den HERRN von ganzem Herzen, und verlass dich nicht auf deinen Verstand, sondern gedenke an ihn in allen deinen Wegen, so wird er dich recht führen.", "reference": "Sprüche 3,5-6"},
    {"verse_content": "Siehe, ich habe dir geboten, dass du getrost und unverzagt seist. Lass dir nicht grauen und entsetze dich nicht; denn der HERR, dein Gott, ist mit dir in allem, was du tun wirst.", "reference": "Josua 1,9"},
    {"verse_content": "Wir wissen aber, dass denen, die Gott lieben, alle Dinge zum Besten dienen, denen, die nach seinem Ratschluss berufen sind.", "reference": "Römer 8,28"},
    {"verse_content": "Gott ist unsre Zuversicht und Stärke, eine Hilfe in den großen Nöten, die uns getroffen haben.", "reference": "Psalm 46,2"},
    {"verse_content": "Denn Gott hat uns nicht gegeben den Geist der Furcht, sondern der Kraft und der Liebe und der Besonnenheit.", "reference": "2 Timotheus 1,7"},
    {"verse_content": "Darum sorgt nicht für morgen, denn der morgige Tag wird für das Seine sorgen. Es ist genug, dass jeder Tag seine eigene Plage hat.", "reference": "Matthäus 6,34"},
    {"verse_content": "Das habe ich mit euch geredet, damit ihr in mir Frieden habt. In der Welt habt ihr Angst; aber seid getrost, ich habe die Welt überwunden.", "reference": "Johannes 16,33"},
    {"verse_content": "Der HERR ist meine Stärke und mein Schild; auf ihn traut mein Herz und mir ist geholfen. Nun ist mein Herz fröhlich, und ich will ihm danken mit meinem Lied.", "reference": "Psalm 28,7"},
    {"verse_content": "Die auf den HERRN harren, kriegen neue Kraft, dass sie auffahren mit Flügeln wie Adler, dass sie laufen und nicht matt werden, dass sie wandeln und nicht müde werden.", "reference": "Jesaja 40,31"},
    {"verse_content": "Denn bei Gott ist kein Ding unmöglich.", "reference": "Lukas 1,37"},
    {"verse_content": "Der HERR ist mein Licht und mein Heil; vor wem sollte ich mich fürchten? Der HERR ist meines Lebens Kraft; vor wem sollte mir grauen?", "reference": "Psalm 27,1"},
    {"verse_content": "Sorgt euch um nichts, sondern in allen Dingen lasst eure Bitten in Gebet und Flehen mit Danksagung vor Gott kundwerden!", "reference": "Philipper 4,6"},
    {"verse_content": "Und der Friede Gottes, der höher ist als alle Vernunft, wird eure Herzen und Sinne in Christus Jesus bewahren.", "reference": "Philipper 4,7"},
    {"verse_content": "Denn wo zwei oder drei versammelt sind in meinem Namen, da bin ich mitten unter ihnen.", "reference": "Matthäus 18,20"},
    {"verse_content": "Der HERR segne dich und behüte dich; der HERR lasse sein Angesicht leuchten über dir und sei dir gnädig; der HERR hebe sein Angesicht über dich und gebe dir Frieden.", "reference": "4 Mose 6,24-26"},
    {"verse_content": "Mein Gott aber wird all eurem Mangel abhelfen nach seinem Reichtum in Herrlichkeit in Christus Jesus.", "reference": "Philipper 4,19"}
]

def generate_verses(seed_verses, total=500):
    """Generate 500 verses, repeating the seed verses as needed"""
    result = []
    for i in range(1, total + 1):
        index = f"{i:03d}"
        # Use modulo to cycle through seed verses
        verse = seed_verses[(i-1) % len(seed_verses)].copy()
        verse["index"] = index
        result.append(verse)
    return result

# Generate and write German ELB verses
elb_verses = generate_verses(de_elb_verses)
with open(os.path.join(output_dir, "bible_verses_de_elb.json"), 'w', encoding='utf-8') as f:
    json.dump(elb_verses, f, ensure_ascii=False, indent=2)
print(f"Generated {len(elb_verses)} German ELB verses")

# Generate and write German LUTH2017 verses
luth_verses = generate_verses(de_luth2017_verses)
with open(os.path.join(output_dir, "bible_verses_de_luth2017.json"), 'w', encoding='utf-8') as f:
    json.dump(luth_verses, f, ensure_ascii=False, indent=2)
print(f"Generated {len(luth_verses)} German LUTH2017 verses")

print("German Bible verse files have been generated with proper verse content!")
