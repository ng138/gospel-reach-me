#!/usr/bin/env python3
"""
Script to generate Italian Bible verses (CEI and NR94).
"""

import json
import os

# Output directory
output_dir = os.path.join("worker", "src", "data", "bible_verses")
os.makedirs(output_dir, exist_ok=True)

# Real Italian Bible verses - CEI (Conferenza Episcopale Italiana)
it_cei_verses = [
    {"verse_content": "Tutto posso in colui che mi dà la forza.", "reference": "Filippesi 4:13"},
    {"verse_content": "Dio infatti ha tanto amato il mondo da dare il suo Figlio unigenito, perché chiunque crede in lui non muoia, ma abbia la vita eterna.", "reference": "Giovanni 3:16"},
    {"verse_content": "Il Signore è il mio pastore: non manco di nulla.", "reference": "Salmi 23:1"},
    {"verse_content": "Non temere, perché io sono con te; non smarrirti, perché io sono il tuo Dio. Ti rendo forte e ti vengo in aiuto e ti sostengo con la destra della mia giustizia.", "reference": "Isaia 41:10"},
    {"verse_content": "Affida al Signore la tua via, confida in lui ed egli agirà.", "reference": "Salmi 37:5"},
    {"verse_content": "Il Signore tuo Dio in mezzo a te è un salvatore potente.", "reference": "Sofonia 3:17"},
    {"verse_content": "Io sono la luce del mondo; chi segue me, non camminerà nelle tenebre, ma avrà la luce della vita.", "reference": "Giovanni 8:12"},
    {"verse_content": "Io conosco i progetti che ho fatto a vostro riguardo - dice il Signore - progetti di pace e non di sventura, per concedervi un futuro pieno di speranza.", "reference": "Geremia 29:11"},
    {"verse_content": "Confida nel Signore con tutto il cuore e non appoggiarti sulla tua intelligenza; in tutti i tuoi passi pensa a lui ed egli appianerà i tuoi sentieri.", "reference": "Proverbi 3:5-6"},
    {"verse_content": "Non ti ho io comandato: Sii forte e coraggioso? Non temere dunque e non spaventarti, perché è con te il Signore tuo Dio, dovunque tu vada.", "reference": "Giosuè 1:9"},
    {"verse_content": "Del resto, noi sappiamo che tutto concorre al bene di coloro che amano Dio, che sono stati chiamati secondo il suo disegno.", "reference": "Romani 8:28"},
    {"verse_content": "Dio è per noi rifugio e forza, aiuto sempre vicino nelle angosce.", "reference": "Salmi 46:1"},
    {"verse_content": "Dio non ci ha dato uno Spirito di timidezza, ma di forza, di amore e di saggezza.", "reference": "2 Timoteo 1:7"},
    {"verse_content": "Non affannatevi dunque per il domani, perché il domani avrà già le sue inquietudini. A ciascun giorno basta la sua pena.", "reference": "Matteo 6:34"},
    {"verse_content": "Vi ho detto queste cose perché abbiate pace in me. Voi avrete tribolazione nel mondo, ma abbiate fiducia; io ho vinto il mondo!", "reference": "Giovanni 16:33"},
    {"verse_content": "Il Signore è mia forza e mio scudo, ho posto in lui la mia fiducia; mi ha dato aiuto ed esulta il mio cuore, con il mio canto gli rendo grazie.", "reference": "Salmi 28:7"},
    {"verse_content": "Quanti sperano nel Signore riacquistano forza, mettono ali come aquile, corrono senza affannarsi, camminano senza stancarsi.", "reference": "Isaia 40:31"},
    {"verse_content": "Nulla è impossibile a Dio.", "reference": "Luca 1:37"},
    {"verse_content": "Il Signore è mia luce e mia salvezza, di chi avrò paura? Il Signore è difesa della mia vita, di chi avrò timore?", "reference": "Salmi 27:1"},
    {"verse_content": "Non angustiatevi per nulla, ma in ogni necessità esponete a Dio le vostre richieste, con preghiere, suppliche e ringraziamenti.", "reference": "Filippesi 4:6"},
    {"verse_content": "E la pace di Dio, che sorpassa ogni intelligenza, custodirà i vostri cuori e i vostri pensieri in Cristo Gesù.", "reference": "Filippesi 4:7"},
    {"verse_content": "Perché dove sono due o tre riuniti nel mio nome, io sono in mezzo a loro.", "reference": "Matteo 18:20"},
    {"verse_content": "Ti benedica il Signore e ti protegga. Il Signore faccia brillare il suo volto su di te e ti sia propizio. Il Signore rivolga su di te il suo volto e ti conceda pace.", "reference": "Numeri 6:24-26"},
    {"verse_content": "Il mio Dio, a sua volta, colmerà ogni vostro bisogno secondo la sua ricchezza con magnificenza in Cristo Gesù.", "reference": "Filippesi 4:19"}
]

# Real Italian Bible verses - Nuova Riveduta 1994 (NR94)
it_nr94_verses = [
    {"verse_content": "Io posso ogni cosa in colui che mi fortifica.", "reference": "Filippesi 4:13"},
    {"verse_content": "Perché Dio ha tanto amato il mondo, che ha dato il suo unigenito Figlio, affinché chiunque crede in lui non perisca, ma abbia vita eterna.", "reference": "Giovanni 3:16"},
    {"verse_content": "Il SIGNORE è il mio pastore: nulla mi manca.", "reference": "Salmi 23:1"},
    {"verse_content": "Tu, non temere, perché io sono con te; non ti smarrire, perché io sono il tuo Dio; io ti fortifico, io ti soccorro, io ti sostengo con la destra della mia giustizia.", "reference": "Isaia 41:10"},
    {"verse_content": "Riponi la tua sorte nel SIGNORE; confida in lui, ed egli agirà.", "reference": "Salmi 37:5"},
    {"verse_content": "Il SIGNORE, il tuo Dio, è in mezzo a te, come un potente che salva.", "reference": "Sofonia 3:17"},
    {"verse_content": "Io sono la luce del mondo; chi mi segue non camminerà nelle tenebre, ma avrà la luce della vita.", "reference": "Giovanni 8:12"},
    {"verse_content": "Infatti io so i pensieri che medito per voi», dice il SIGNORE: «pensieri di pace e non di male, per darvi un avvenire e una speranza.", "reference": "Geremia 29:11"},
    {"verse_content": "Confida nel SIGNORE con tutto il cuore e non ti appoggiare sul tuo discernimento. Riconoscilo in tutte le tue vie ed egli appianerà i tuoi sentieri.", "reference": "Proverbi 3:5-6"},
    {"verse_content": "Non te l'ho io comandato? Sii forte e coraggioso; non ti spaventare e non ti sgomentare, perché il SIGNORE, il tuo Dio, sarà con te dovunque andrai.", "reference": "Giosuè 1:9"},
    {"verse_content": "Or sappiamo che tutte le cose cooperano al bene di quelli che amano Dio, i quali sono chiamati secondo il suo disegno.", "reference": "Romani 8:28"},
    {"verse_content": "Dio è per noi un rifugio e una forza, un aiuto sempre pronto nelle difficoltà.", "reference": "Salmi 46:1"},
    {"verse_content": "Infatti Dio ci ha dato uno spirito non di timidezza, ma di forza, d'amore e di autocontrollo.", "reference": "2 Timoteo 1:7"},
    {"verse_content": "Non siate dunque in ansia per il domani, perché il domani si preoccuperà di sé stesso. Basta a ciascun giorno il suo affanno.", "reference": "Matteo 6:34"},
    {"verse_content": "Vi ho detto queste cose, affinché abbiate pace in me. Nel mondo avrete tribolazione; ma fatevi coraggio, io ho vinto il mondo.", "reference": "Giovanni 16:33"},
    {"verse_content": "Il SIGNORE è la mia forza e il mio scudo; in lui s'è confidato il mio cuore, e sono stato soccorso; perciò il mio cuore esulta, e io lo celebrerò con il mio canto.", "reference": "Salmi 28:7"},
    {"verse_content": "Ma quelli che sperano nel SIGNORE acquistano nuove forze, si alzano a volo come aquile, corrono e non si stancano, camminano e non si affaticano.", "reference": "Isaia 40:31"},
    {"verse_content": "Poiché nessuna parola di Dio rimarrà inefficace.", "reference": "Luca 1:37"},
    {"verse_content": "Il SIGNORE è la mia luce e la mia salvezza; di chi temerò? Il SIGNORE è il baluardo della mia vita; di chi avrò paura?", "reference": "Salmi 27:1"},
    {"verse_content": "Non angustiatevi di nulla, ma in ogni cosa fate conoscere le vostre richieste a Dio in preghiere e suppliche, accompagnate da ringraziamenti.", "reference": "Filippesi 4:6"},
    {"verse_content": "E la pace di Dio, che supera ogni intelligenza, custodirà i vostri cuori e i vostri pensieri in Cristo Gesù.", "reference": "Filippesi 4:7"},
    {"verse_content": "Poiché dove due o tre sono riuniti nel mio nome, lì sono io in mezzo a loro.", "reference": "Matteo 18:20"},
    {"verse_content": "Il SIGNORE ti benedica e ti protegga! Il SIGNORE faccia risplendere il suo volto su di te e ti sia propizio! Il SIGNORE rivolga verso di te il suo volto e ti dia la pace!", "reference": "Numeri 6:24-26"},
    {"verse_content": "Il mio Dio provvederà a ogni vostro bisogno, secondo la sua gloriosa ricchezza, in Cristo Gesù.", "reference": "Filippesi 4:19"}
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

# Generate and write Italian CEI verses
cei_verses = generate_verses(it_cei_verses)
with open(os.path.join(output_dir, "bible_verses_it_cei.json"), 'w', encoding='utf-8') as f:
    json.dump(cei_verses, f, ensure_ascii=False, indent=2)
print(f"Generated {len(cei_verses)} Italian CEI verses")

# Generate and write Italian NR94 verses
nr94_verses = generate_verses(it_nr94_verses)
with open(os.path.join(output_dir, "bible_verses_it_nr94.json"), 'w', encoding='utf-8') as f:
    json.dump(nr94_verses, f, ensure_ascii=False, indent=2)
print(f"Generated {len(nr94_verses)} Italian NR94 verses")

print("Italian Bible verse files have been generated with proper verse content!")
