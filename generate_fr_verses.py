#!/usr/bin/env python3
"""
Script to generate French Bible verses (LSG and BDS).
"""

import json
import os

# Output directory
output_dir = os.path.join("worker", "src", "data", "bible_verses")
os.makedirs(output_dir, exist_ok=True)

# Real French Bible verses - Louis Segond (LSG)
fr_lsg_verses = [
    {"verse_content": "Je puis tout par celui qui me fortifie.", "reference": "Philippiens 4:13"},
    {"verse_content": "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", "reference": "Jean 3:16"},
    {"verse_content": "L'Éternel est mon berger: je ne manquerai de rien.", "reference": "Psaumes 23:1"},
    {"verse_content": "Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante.", "reference": "Ésaïe 41:10"},
    {"verse_content": "Recommande ton sort à l'Éternel, mets en lui ta confiance, et il agira.", "reference": "Psaumes 37:5"},
    {"verse_content": "L'Éternel, ton Dieu, est au milieu de toi, comme un héros qui sauve.", "reference": "Sophonie 3:17"},
    {"verse_content": "Je suis la lumière du monde; celui qui me suit ne marchera pas dans les ténèbres, mais il aura la lumière de la vie.", "reference": "Jean 8:12"},
    {"verse_content": "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.", "reference": "Jérémie 29:11"},
    {"verse_content": "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.", "reference": "Proverbes 3:5-6"},
    {"verse_content": "Ne t'ai-je pas donné cet ordre: Fortifie-toi et prends courage? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.", "reference": "Josué 1:9"},
    {"verse_content": "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.", "reference": "Romains 8:28"},
    {"verse_content": "Dieu est pour nous un refuge et un appui, un secours qui ne manque jamais dans la détresse.", "reference": "Psaumes 46:1"},
    {"verse_content": "Car ce n'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d'amour et de sagesse.", "reference": "2 Timothée 1:7"},
    {"verse_content": "Ne vous inquiétez donc pas du lendemain; car le lendemain aura soin de lui-même. A chaque jour suffit sa peine.", "reference": "Matthieu 6:34"},
    {"verse_content": "Je vous ai dit ces choses, afin que vous ayez la paix en moi. Vous aurez des tribulations dans le monde; mais prenez courage, j'ai vaincu le monde.", "reference": "Jean 16:33"},
    {"verse_content": "L'Éternel est ma force et mon bouclier; en lui mon cœur se confie, et je suis secouru; et mon cœur est dans l'allégresse, et je le loue par mes chants.", "reference": "Psaumes 28:7"},
    {"verse_content": "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point, ils marchent, et ne se fatiguent point.", "reference": "Ésaïe 40:31"},
    {"verse_content": "Car rien n'est impossible à Dieu.", "reference": "Luc 1:37"},
    {"verse_content": "L'Éternel est ma lumière et mon salut: de qui aurais-je crainte? L'Éternel est le soutien de ma vie: de qui aurais-je peur?", "reference": "Psaumes 27:1"},
    {"verse_content": "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.", "reference": "Philippiens 4:6"},
    {"verse_content": "Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.", "reference": "Philippiens 4:7"},
    {"verse_content": "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux.", "reference": "Matthieu 18:20"},
    {"verse_content": "Que l'Éternel te bénisse, et qu'il te garde! Que l'Éternel fasse luire sa face sur toi, et qu'il t'accorde sa grâce! Que l'Éternel tourne sa face vers toi, et qu'il te donne la paix!", "reference": "Nombres 6:24-26"},
    {"verse_content": "Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus-Christ.", "reference": "Philippiens 4:19"}
]

# Real French Bible verses - Bible du Semeur (BDS)
fr_bds_verses = [
    {"verse_content": "Je peux tout grâce à celui qui me fortifie.", "reference": "Philippiens 4:13"},
    {"verse_content": "Car Dieu a tant aimé le monde qu'il a donné son Fils unique afin que toute personne qui croit en lui ne périsse pas mais ait la vie éternelle.", "reference": "Jean 3:16"},
    {"verse_content": "L'Eternel est mon berger, je ne manquerai de rien.", "reference": "Psaumes 23:1"},
    {"verse_content": "N'aie pas peur, car je suis moi-même avec toi. Ne promène pas des regards inquiets, car je suis ton Dieu. Je te fortifie, je viens à ton secours, je te soutiens par ma main droite, la main de la justice.", "reference": "Ésaïe 41:10"},
    {"verse_content": "Remets ton sort à l'Eternel, confie-toi en lui, et il agira.", "reference": "Psaumes 37:5"},
    {"verse_content": "L'Eternel ton Dieu est au milieu de toi comme un héros qui sauve.", "reference": "Sophonie 3:17"},
    {"verse_content": "Je suis la lumière du monde. Celui qui me suit ne marchera pas dans les ténèbres: il aura au contraire la lumière de la vie.", "reference": "Jean 8:12"},
    {"verse_content": "Car moi, je connais les projets que je forme pour vous, déclare l'Eternel, projets de paix et non de malheur, afin de vous donner un avenir et une espérance.", "reference": "Jérémie 29:11"},
    {"verse_content": "Confie-toi en l'Eternel de tout ton cœur, et ne t'appuie pas sur ton propre discernement. Reconnais-le dans toutes tes voies, et il aplanira tes sentiers.", "reference": "Proverbes 3:5-6"},
    {"verse_content": "Ne t'ai-je pas donné cet ordre: Fortifie-toi et prends courage? Ne tremble pas et ne te laisse pas abattre, car l'Eternel, ton Dieu, sera avec toi partout où tu iras.", "reference": "Josué 1:9"},
    {"verse_content": "Nous savons en outre que Dieu fait concourir toutes choses au bien de ceux qui l'aiment, de ceux qui ont été appelés conformément au plan divin.", "reference": "Romains 8:28"},
    {"verse_content": "Dieu est pour nous un refuge et un appui, un secours toujours présent dans la détresse.", "reference": "Psaumes 46:1"},
    {"verse_content": "Car ce n'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d'amour et de sagesse.", "reference": "2 Timothée 1:7"},
    {"verse_content": "Ne vous inquiétez donc pas du lendemain, car le lendemain s'inquiétera de lui-même. A chaque jour suffit sa peine.", "reference": "Matthieu 6:34"},
    {"verse_content": "Je vous ai dit cela pour que vous trouviez la paix en moi. Dans le monde, vous aurez à souffrir bien des afflictions. Mais courage! Moi, j'ai vaincu le monde.", "reference": "Jean 16:33"},
    {"verse_content": "L'Eternel est ma force et mon bouclier, mon cœur lui fait confiance et j'ai été secouru. Aussi mon cœur est dans l'allégresse et je le loue par mes chants.", "reference": "Psaumes 28:7"},
    {"verse_content": "Mais ceux qui mettent leur espérance en l'Eternel renouvellent leur force. Ils prennent leur envol comme de jeunes aigles. Sans se lasser, ils courent, ils marchent en avant, et ne s'épuisent pas.", "reference": "Ésaïe 40:31"},
    {"verse_content": "Car rien n'est impossible à Dieu.", "reference": "Luc 1:37"},
    {"verse_content": "L'Eternel est ma lumière et mon salut: de qui aurais-je peur? L'Eternel est le refuge de ma vie: devant qui tremblerais-je?", "reference": "Psaumes 27:1"},
    {"verse_content": "Ne vous mettez en souci pour rien, mais, en toute chose, exposez vos besoins à Dieu. Adressez-lui vos prières et vos requêtes, en lui disant aussi votre reconnaissance.", "reference": "Philippiens 4:6"},
    {"verse_content": "Alors la paix de Dieu, qui surpasse tout ce que l'on peut concevoir, gardera votre cœur et votre pensée sous la protection de Jésus-Christ.", "reference": "Philippiens 4:7"},
    {"verse_content": "En effet, là où deux ou trois sont assemblés en mon nom, je suis présent au milieu d'eux.", "reference": "Matthieu 18:20"},
    {"verse_content": "Que l'Eternel te bénisse et te garde! Que l'Eternel fasse briller sur toi son visage et qu'il t'accorde sa grâce! Que l'Eternel tourne son visage vers toi et qu'il te donne la paix!", "reference": "Nombres 6:24-26"},
    {"verse_content": "Mon Dieu subviendra à tous vos besoins conformément à sa glorieuse richesse en Jésus-Christ.", "reference": "Philippiens 4:19"}
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

# Generate and write French LSG verses
lsg_verses = generate_verses(fr_lsg_verses)
with open(os.path.join(output_dir, "bible_verses_fr_lsg.json"), 'w', encoding='utf-8') as f:
    json.dump(lsg_verses, f, ensure_ascii=False, indent=2)
print(f"Generated {len(lsg_verses)} French LSG verses")

# Generate and write French BDS verses
bds_verses = generate_verses(fr_bds_verses)
with open(os.path.join(output_dir, "bible_verses_fr_bds.json"), 'w', encoding='utf-8') as f:
    json.dump(bds_verses, f, ensure_ascii=False, indent=2)
print(f"Generated {len(bds_verses)} French BDS verses")

print("French Bible verse files have been generated with proper verse content!")
