import json
import math
import re
import requests
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
sells_re = re.compile(r'^new Listview\(.*?data: (.*?)\}\)\;$', re.MULTILINE)


r = requests.get(sys.argv[1], headers=HEADERS)

m = mapper_re.search(r.text)
if not m:
    print('mapper_re fail')
    sys.exit(1)

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

items = json.loads(re.sub(r'(standing|react|stack|avail|cost):', r'"\1":', m.group(1)))


faction = ''
react = npc['react']
if react[0] == 1 and react[1] <= 0:
    faction = ' alliance'
elif react[0] <= 0 and react[1] == 1:
    faction = ' horde'

print(f'id: {npc["id"]}')
print(f'name: "{npc["name"]}"')
if 'tag' in npc:
    print(f'note: "{npc["tag"]}"')

print()
print('locations:')

for map_set in mapper.values():
    for map in map_set:
        map_name = map['uiMapName'].lower().replace(' ', '_').replace('-', '_').replace("'", '')
        print(f'  {map_name}:')
        
        for coord in map['coords']:
            print(f'    - {coord[0]} {coord[1]}{faction}')

print()

print('sells:')

sorted_items = sorted(items, key=lambda item: [
    -item["standing"],
    item["classs"],
    item.get("subclass", 0),
    item.get("reqclass", 0),
    item.get("slot", 0),
    item["name"],

])

for item in sorted_items:
    item_class = item.get('classs', 0)
    item_subclass = item.get('subclass', 0)
    item_slot = item.get('slot', 0)
    type_parts = []

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
        print(f'    reputation: 0 {STANDING[item["standing"]]}')

    print('')
    #print('>', item)
