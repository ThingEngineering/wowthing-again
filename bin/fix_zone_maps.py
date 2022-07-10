import csv
import glob
import os
import re


TYPE_RE = re.compile(r'^\s*- type: (.*?)$')
ID_RE = re.compile(r'^(\s*)id: ([\d\s]+)($| \#.+$)')


creature_to_pet = {}
with open(glob.glob('dumps/battlepetspecies-*.csv')[0]) as csv_file:
    reader = csv.DictReader(csv_file)
    for row in reader:
        creature_to_pet[row['CreatureID']] = row['ID']

spell_to_mount = {}
with open(glob.glob('dumps/enUS/mount-*.csv')[0]) as csv_file:
    reader = csv.DictReader(csv_file)
    for row in reader:
        spell_to_mount[row['SourceSpellID']] = row['ID']

for root, dirs, files in os.walk('data/zone-maps'):
    for filename in files:
        if not filename.endswith('.yml'):
            continue

        filepath = os.path.join(root, filename)
        lines = open(filepath).readlines()
        out = []

        last_type = None
        for line in lines:
            line = line.rstrip()

            m = TYPE_RE.match(line)
            if m:
                last_type = m.group(1)
            else:
                m = ID_RE.match(line)
                if last_type is not None and m:
                    if last_type == 'pet':
                        line = f'{m.group(1)}id: {creature_to_pet[m.group(2)]}{m.group(3)}'
                    elif last_type == 'mount':
                        line = f'{m.group(1)}id: {spell_to_mount[m.group(2)]}{m.group(3)}'
                
                last_type = None
            
            out.append(line)

        open(filepath, 'w').writelines(f'{line}\n' for line in out)
