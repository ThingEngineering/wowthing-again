import csv
import glob
import os
import os.path
import re
import sys


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

        m = re.search(r'^\s*\[(\d+)\]\s*=\s*{name=\"(.*?)\",($|\w)', line)
        if m:
            state = 'mob'
            if thing is not None:
                kills.append(thing)
            thing = {
                'name': m.group(2),
                'npcId': m.group(1),
            }
        
        if state == 'mob':
            m = re.search(r'locations=\{(.*?)\},($|\w)', line)
            if m:
                thing['locations'] = {}

                for mapId, locations in re.findall(r'\[(\d+)\]=\{([\d\,]+)},', m.group(1)):
                    thing['locations'][mapId] = []
                    for location in locations.split(','):
                        thing['locations'][mapId].append([
                            int(location[0:4]) / 100,
                            int(location[4:]) / 100,
                        ])

            m = re.search(r'loot=\{(.*?)\},($|\w)', line)
            if m:
                thing['loot'] = m.group(1)

            m = re.search(r'note=\"(.*?)\",($|\w)', line)
            if m:
                thing['note'] = m.group(1)

            m = re.search(r'quest=(\d+),', line)
            if m:
                thing['questId'] = m.group(1)

    if thing is not None:
        kills.append(thing)
    
    grouped = {}
    for kill in kills:
        if 'locations' not in kill:
            print('???', kill)
            continue

        for mapId in kill['locations'].keys():
            grouped.setdefault(mapId, []).append(kill)

    for mapId, mapKills in grouped.items():
        print()
        print('# Map', mapId)
        for thing in sorted(mapKills, key=lambda t: t.get('name', f'zzz #{thing["npcId"]}')):
            print_thing(thing, 'kill')


def print_thing(thing, thing_type):
    print()
    print(f'- name: "{thing.get("name", "???")}"')

    if 'locations' in thing:
        print(f'  locations: {thing["locations"]}')

    if 'note' in thing:
        print(f'  note: "{thing["note"]}"')

    if 'npcId' in thing:
        print(f'  npcId: {thing["npcId"]}')

    if 'questId' in thing:
        print(f'  questId: {thing["questId"]}')

    print(f'  type: {thing_type}')

    if 'loot' in thing:
        print(f'  drops:')
        print(f'    # {thing["loot"]}')

if __name__ == '__main__':
    main()
