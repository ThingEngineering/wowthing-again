import csv
import glob
import os


things = {}
with open(glob.glob('data/dumps/runeforgelegendaryability-*.csv')[0]) as csv_file:
    for row in csv.DictReader(csv_file):
        things[row['ItemBonusListID']] = [row['SpellID'], row['Name_lang']]

with open('frontend/data/legendary.ts', 'w') as out:
    out.write('export const legendaryBonusIDs: Record<number, number> = {\n')
    for bonus_id, (spell_id, name) in sorted(things.items()):
        out.write(f'    {bonus_id}: {spell_id}, // {name}\n')
    out.write('}\n')
