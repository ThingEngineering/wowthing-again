import csv
import glob
import os
import re


ID_RE = re.compile(r'^\s*-\s+([\d\s]+)($| \#.+$)')


spell_to_mount = {}
with open(glob.glob('dumps/enUS/mount-*.csv')[0]) as csv_file:
    reader = csv.DictReader(csv_file)
    for row in reader:
        spell_to_mount[row['SourceSpellID']] = row['ID']

for root, dirs, files in os.walk('data/mounts'):
    for filename in files:
        if not filename.endswith('.yml'):
            continue

        filepath = os.path.join(root, filename)
        lines = open(filepath).readlines()
        out = []

        for line in lines:
            line = line.rstrip()
            m = ID_RE.search(line)
            if m:
                try:
                    ids = [spell_to_mount[spell_id] for spell_id in m.group(1).split()]
                    out.append(f'  - {" ".join(ids)}{m.group(2)}')
                except KeyError:
                    out.append(f'#  - {m.group(1)}{m.group(2)} FIXME')
            else:
                out.append(line)

        open(filepath, 'w').writelines(f'{line}\n' for line in out)
