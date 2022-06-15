import csv
import glob
import os
import os.path
import re
import sys

#map.nodes[11905220] = Rare({
#    id=142436,
#    quest={53016, 53522},
#    controllingFaction='Horde',
#    rewards={
#        Pet({item=163689, id=2437})
#    }
#}) -- Ragebeak



def main():
    dump_base = os.path.join(os.path.dirname(sys.argv[0]), '..', 'data', 'dumps')

    creature_map = {}
    with open(glob.glob(os.path.join(dump_base, 'enUS/creature-*.csv'))[0]) as csv_file:
        for row in csv.DictReader(csv_file):
            creature_map[int(row['ID'])] = row['Name_lang']

    mount_map = {}
    with open(glob.glob(os.path.join(dump_base, 'enUS/mount-*.csv'))[0]) as csv_file:
        for row in csv.DictReader(csv_file):
            mount_map[int(row['ID'])] = dict(
                name=row['Name_lang'],
                spell_id=int(row['SourceSpellID']),
            )

    pet_map = {}
    with open(glob.glob(os.path.join(dump_base, 'battlepetspecies-*.csv'))[0]) as csv_file:
        for row in csv.DictReader(csv_file):
            pet_map[int(row['ID'])] = dict(
                creature_id=int(row['CreatureID']),
                spell_id=int(row['SummonSpellID']),
            )

    kills = []
    treasures = []

    line_number = 0
    state = None
    thing = None
    thing_type = ''

    for line in open(sys.argv[1]):
        line = line.strip()
        line_number += 1

        m = re.match(r'^map\.nodes\[(\d+)\]\s*=\s*(BonusBoss|Rare|Treasure)\(\{.*?$', line)
        if m:
            #function HandyNotes:getXY(id)
            #    return floor(id / 10000) / 10000, (id % 10000) / 10000
            #end

            coords = int(m.group(1))
            x = round(coords / 100000) / 10
            y = round(coords % 10000 / 10) / 10

            thing = dict(
                location=f'{x} {y}',
                rewards=[],
            )
            thing_type = m.group(2)
        
        elif thing is not None:
            if state and (line == '}' or line == '},'):
                state = None
                continue

            # Comments
            if line.startswith('--'):
                continue

            # Shrug
            if re.search(r'^(assault|controllingFaction|fgroup|future|glow|label|noassault|note|requires|rift|rlabel|vignette)\s*=', line):
                continue

            if re.search(r'^pois\s*=\s*\{', line) and not re.search(r'\}$', line) and not re.search('\}\s*--.*?$', line):
                state = 'pois'
                continue
            elif state == 'pois':
                continue

            if re.match(r'^rewards\s*=\s*{$', line):
                state = 'rewards'
                print('rewards')
                continue
            elif state == 'rewards':
                print('reward: ', line)
                if line.startswith('Achievement({'):
                    continue

                m = re.match(r'^Item\(\{(.*?)\}\),?\s*--\s*(.*?)$', line)
                if m:
                    keys = {}
                    for part in m.group(1).split(', '):
                        parts = re.split(r'\s*=\s*', part, 1)
                        keys[parts[0]] = parts[1]

                    if 'note' in keys and ('"neck"' in keys['note'] or '"ring"' in keys['note'] or '"trinket"' in keys['note']):
                        continue

                    if 'quest' in keys:
                        reward = dict(
                            type='quest',
                            id=keys['quest'],
                            name=m.group(2),
                        )

                        if 'covenant' in keys:
                            reward['limit'] = f'covenant {keys["covenant"].lower()}'

                        thing['rewards'].append(reward)
                        continue

                m = re.match(r'^Mount\(\{.*?id\s*=\s*(\d+).*?\}\).*?$', line)
                if m:
                    mount = mount_map[int(m.group(1))]

                    thing['rewards'].append(dict(
                        type='mount',
                        id=mount['spell_id'],
                        name=mount['name'],
                    ))
                    continue

                m = re.match(r'^Pet\(\{.*?id\s*=\s*(\d+).*?\}\).*?$', line)
                if m:
                    pet = pet_map[int(m.group(1))]
                    name = creature_map[pet['creature_id']]

                    thing['rewards'].append(dict(
                        type='pet',
                        id=pet['spell_id'],
                        name=name,
                    ))
                    continue

                m = re.match(r'^Toy\(\{item\s*=\s*(\d+)\}\),?( -- (.*?))?$', line)
                if m:
                    thing['rewards'].append(dict(
                        type='toy',
                        id=m.group(1),
                        name=m.group(2),
                    ))
                    continue

                m = re.match(r'^Transmog\(\{(.*?)\}\),?\s*--\s*(.*?)$', line)
                if m:
                    keys = {}
                    for part in m.group(1).split(', '):
                        parts = re.split(r'\s*=\s*', part, 1)
                        keys[parts[0]] = parts[1]

                    if 'note' in keys and '"trinket"' in keys['note']:
                        continue

                    thing_data = dict(
                        type='transmog',
                        id=keys['item'],
                        name=m.group(2),
                    )

                    m2 = re.match(r'^L\[\"(.*?)\"\]$', keys.get('slot', ''))
                    if m2:
                        slot = m2.group(1)
                        if slot in ['cloth', 'leather', 'mail', 'plate']:
                            thing_data['limit'] = f'armor {slot}'
                        elif slot != 'cosmetic':
                            thing_data['limit'] = f'weapon {slot}'

                    if 'covenant' in keys:
                        if 'limit' in thing_data:
                            thing_data['limit'] += f' covenant {covenant}'
                        else:
                            thing_data['limit'] = f'covenant {keys["covenant"].lower()}'

                    thing['rewards'].append(thing_data)
                    continue

                print(line_number, 'reward??', line)
                continue

            m = re.match(r'^\}\) --\s*(.*?)$', line)
            if m:
                thing['name'] = m.group(1)

                if thing_type == 'Treasure':
                    thing['reset'] = 'never'
                    treasures.append(thing)
                else:
                    kills.append(thing)

                thing = None
                continue

            m = re.match(r'^id\s*=\s*(\d+),?$', line)
            if m:
                thing['id'] = int(m.group(1))
                continue

            m = re.match(r'^quest\s*=\s*(\d+).*?$', line)
            if m:
                thing['quests'] = [m.group(1)]
                continue

            m = re.match(r'^quest\s*=\s*\{(.*?)\},?$', line)
            if m:
                thing['quests'] = m.group(1).split(', ')
                continue

            m = re.match(r'^(faction)\s*=\s*\'(.*?)\',?$', line)
            if m:
                thing['faction'] = m.group(2)
                continue

            print(line_number, '??', line)

    if len(kills) > 0:
        print()
        print('# Kills')

        for thing in sorted(kills, key=lambda t: t['name']):
            print_thing(thing, 'kill')

    if len(treasures) > 0:
        print()
        print('# Treasures')

        for thing in sorted(treasures, key=lambda t: t['name']):
            print_thing(thing, 'treasure')


def print_thing(thing, thing_type):
        #if len(thing['rewards']) == 0:
        #    return

        print()
        print(f'- name: "{thing["name"]}"')

        if 'faction' in thing:
            print(f'  faction: {thing["faction"].lower()}')

        print(f'  location: {thing["location"]}')

        if 'id' in thing:
            print(f'  npcId: {thing["id"]}')

        if 'quests' in thing:
            print(f'  questId: {" ".join(thing["quests"])}')

        if 'reset' in thing:
            print(f'  reset: {thing["reset"]}')

        print(f'  type: {thing_type}')
        
        print(f'  drops:')
        first = True
        for drop in thing['rewards']:
            if first:
                first = False
            else:
                print()

            print(f'  - type: {drop["type"]}')
            print(f'    id: {drop["id"]} # {drop["name"]}')
            #print(f'    name: "{drop["name"]}"')

            if 'limit' in drop:
                print(f'    limit: {drop["limit"]}')


if __name__ == '__main__':
    main()
