import json
import math
import os
import re
import requests
import requests_cache
import sys


HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
}

ARMOR_SUBCLASS = {
    1: 'cloth',
    2: 'leather',
    3: 'mail',
    4: 'plate',
}
WEAPON_SUBCLASS = {
    0: '1h ? axe',
    1: '2h ? axe',
    2: 'bow',
    3: 'gun',
    4: '1h ? mace',
    5: '2h ? mace',
    6: 'polearm',
    7: '1h ? sword',
    8: '2h ? sword',
    9: 'warglaive',
    10: 'staff',
    13: 'fist',
    15: '? dagger',
    18: 'crossbow',
    19: 'wand',
    20: 'fishing-pole',
}
INVENTORY_SLOT = {
    1: 'head',
    3: 'shoulders',
    4: 'shirt',
    5: 'chest',
    6: 'waist',
    7: 'legs',
    8: 'feet',
    9: 'wrists',
    10: 'hands',
    13: 'weapon',
    14: 'weapon',
    15: 'ranged',
    16: 'back',
    17: 'weapon',
    20: 'chest',
    21: 'weapon',
    22: 'weapon',
    23: 'off-hand',
    26: 'ranged',
}
CHRCLASS = {
    1: 'Death Knight',
    2: 'Demon Hunter',
    3: 'Druid',
    4: 'Hunter',
    5: 'Mage',
    6: 'Monk',
    7: 'Paladin',
    8: 'Priest',
    9: 'Rogue',
    10: 'Shaman',
    11: 'Warlock',
    12: 'Warrior',
}
SORT_CHRCLASS = {
    32: 1,   # 6=death knight
    2048: 2, # 12=demon hunter
    1024: 3, # 11=druid
    4: 4,    # 3=hunter
    128: 5,  # 8=mage
    512: 6,  # 10=monk
    2: 7,    # 2=paladin
    16: 8,   # 5=priest
    8: 9,    # 4=rogue
    64: 10,  # 7=shaman
    256: 11, # 9=warlock
    1: 12,   # 1=warrior

    # cloth
    (16 + 128 + 256): 20,
    # leather
    (8 + 512): 21,
    (8 + 512 + 1024): 21,
    (8 + 512 + 1024 + 2048): 21,
    # mail
    (4 + 64): 22,
    # plate
    (1 + 2): 23,
    (1 + 2 + 32): 23,
}
SORT_CLASS = {
    4: 1, # Armor
    0: 2, # Misc
    2: 3, # Weapon
}
SORT_SUBCLASS = {
    (4, 1): 20, # Cloth
    (4, 2): 21, # Leather
    (4, 3): 22, # Mail
    (4, 4): 23, # Plate
    (4, -6): 30, # Cloak
    (2, 0): 100, # 1h axe
    (2, 4): 101, # 1h mace
    (2, 8): 102, # 1h sword
    (2, 1): 110, # 2h axe
    (2, 5): 111, # 2h mace
    (2, 9): 112, # 2h sword
    (2, 15): 120, # dagger
    (2, 13): 121, # fist
    (2, 19): 122, # wand
    (2, 9): 123, # warglaive
    (2, 6): 130, # polearm
    (2, 10): 131, # staff
    (2, 2): 140, # bow
    (2, 18): 141, # crossbow
    (2, 3): 142, # gun
    (4, -5): 150, # Off-hand
    (4, 6): 151, # Shield
}
SORT_KEY = {
    1: 1,
    3: 2,
    5: 3,
    9: 4,
    10: 5,
    6: 6,
    7: 7,
    8: 8,
}
SKIP_INVENTORY_SLOT = set([
    2, # neck
    11, # ring
    12, # trinket
])


STANDING = {
    4: 'friendly',
    5: 'honored',
    6: 'revered',
    7: 'exalted',
}

mapper_re = re.compile(r'var g_mapperData = (.*?)\;$', re.MULTILINE)
npc_re = re.compile(r'^\$\.extend\(g_npcs\[\d+], (.*?)\)\;$', re.MULTILINE)
sells_re = re.compile(r'^new Listview\(.*?id: \'sells\'.*?data: (.*?)\}\)\;$', re.MULTILINE)

cache_path = os.path.join(os.path.dirname(__file__), '..', 'temp', 'requests_cache')
requests_cache.install_cache(cache_path, expire_after=4 * 3600)


r = requests.get(sys.argv[1], headers=HEADERS)

m = mapper_re.search(r.text)
mapper = None
if m:
    mapper = json.loads(m.group(1))

m = npc_re.search(r.text)
if not m:
    print('npc_re fail')
    sys.exit(1)

npc = json.loads(m.group(1))

m = sells_re.search(r.text)
if not m:
    print('sells_re fail')
    sys.exit(1)

item_json = re.sub(r'(standing|react|stack|avail|cost):', r'"\1":', m.group(1))
item_json = re.sub(r',\]', ',0]', item_json)
item_json = re.sub(r'\[,', '[0,', item_json)
items = json.loads(item_json)


faction = ''
react = npc.get('react')
if react is None:
    react = [0, 9]
else:
    if len(react) == 1:
        react.push(0)
    if react[0] is None:
        react[0] = 0
    if react[1] is None:
        react[1] = 0

if react[0] == 1 and (len(react) == 1 or react[1] <= 0):
    faction = ' alliance'
elif react[0] <= 0 and react[1] == 1:
    faction = ' horde'

print(f'id: {npc["id"]}')
print(f'name: "{npc["name"]}"')
if 'tag' in npc:
    print(f'note: "{npc["tag"]}"')

print()
print('locations:')

if mapper is not None:
    for map_set in mapper.values():
        if isinstance(map_set, dict):
            map_set = map_set.values()

        for map in map_set:
            map_name = map.get('uiMapName', 'unknown').lower().replace(' ', '_').replace('-', '_').replace("'", '')
            print(f'  {map_name}:')
            
            for coord in map['coords']:
                print(f'    - {coord[0]} {coord[1]}{faction}')

print()

print('sells:')

sorted_items = sorted(items, key=lambda item: [
    -item["standing"],
    SORT_CLASS.get(item["classs"], item["classs"] + 100),
    SORT_CHRCLASS.get(
        item.get("reqclass", 0),
        SORT_SUBCLASS.get(
            (item["classs"], item.get("subclass", 0)),
            item.get("subclass", 0) + 100
        )
    ),
    SORT_KEY.get(item.get("slot", 0), item.get("slot", 0) + 100),
    item["name"],

])

last_cls = None
for item in sorted_items:
    item_class = item.get('classs', 0)
    item_subclass = item.get('subclass', 0)
    item_slot = item.get('slot', 0)
    type_parts = []

    sort_key = SORT_CHRCLASS.get(item.get('reqclass', 0), 0)
    char_class = CHRCLASS.get(sort_key, sort_key)

    if char_class != last_cls:
        print(f'  # {char_class}')
        print()
        last_cls = char_class

    if item_slot in SKIP_INVENTORY_SLOT:
        print(f'  # Skipped id={item["id"]} name={item["name"]} slot={item_slot}')
        continue

    if item_class == 2:
        type_parts.append(WEAPON_SUBCLASS.get(item_subclass, f'subclass={item_subclass}'))
    
    elif item_class == 4:
        if item_subclass == -8:
            type_parts.append('shirt')
        elif item_subclass == -7:
            type_parts.append('tabard')
        elif item_subclass == -6:
            type_parts.append('cloak')
        elif item_subclass == -5:
            type_parts.append('off-hand')
        elif item_subclass == 6:
            type_parts.append('shield')
        else:
            type_parts.append(ARMOR_SUBCLASS.get(item_subclass, f'subclass={item_subclass}'))
            type_parts.append(INVENTORY_SLOT.get(item_slot, f'item_slot={item_slot}'))
    
    type_str = ''
    if len(type_parts) > 0:
        type_str = f' [{" ".join(type_parts)}]'

    print( '  - type: transmog')
    print(f'    id: {item["id"]} # {item["name"]}{type_str}')
    print( '    costs:')

    costs = item['cost']
    if costs[0] > 0:
        print(f'      0: {max(1, math.floor(costs[0] / 10000))} # Gold')

    if len(costs) >= 2:
        for cost in costs[1]:
            print(f'      {cost[0]}: {cost[1]}')

    if len(costs) == 3:
        for cost in costs[2]:
            print(f'      1{cost[0]:06}: {cost[1]}')
    
    if item['standing'] > 0:
        print(f'    reputation: 0 {STANDING.get(item["standing"], item["standing"])}')

    print('')
    #print('>', item)
