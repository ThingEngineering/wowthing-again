#!/usr/bin/env python3

import csv
import os
import os.path
import re


BASE_DIR = './dumps'

COLUMNS = {
    'achievement': ['ID', 'Description_lang', 'Reward_lang', 'Title_lang'],
    'achievement_category': ['ID', 'Name_lang'],
    'chrclasses': ['ID', 'Name_male_lang', 'Name_female_lang'],
    'chrraces': ['ID', 'Name_lang', 'Name_female_lang'],
    'chrspecialization': ['ID', 'Name_lang', 'FemaleName_lang'],
    'creature': ['ID', 'Name_lang'],
    'criteriatree': ['ID', 'Description_lang'],
    'currencycategory': ['ID', 'Name_lang'],
    'currencytypes': ['ID', 'Name_lang'],
    'faction': ['ID', 'Name_lang'],
    'itemnamedescription': ['ID', 'Description_lang'],
    'itemsparse': ['ID', 'Display_lang'],
    'journalencounter': ['ID', 'Name_lang'],
    'journalinstance': ['ID', 'Name_lang'],
    'journaltier': ['ID', 'Name_lang'],
    'map': ['ID', 'MapName_lang'],
    'mount': ['ID', 'Name_lang'],
    'skillline': ['ID', 'DisplayName_lang', 'HordeDisplayName_lang'],
    'transmogset': ['ID', 'Name_lang'],
    'transmogsetgroup': ['ID', 'Name_lang'],
}

def main():
    for filename in sorted(os.listdir(BASE_DIR)):
        if filename == 'enUS':
            continue

        filepath = os.path.join(BASE_DIR, filename)
        if not os.path.isdir(filepath):
            continue
        
        for csvfile in sorted(os.listdir(filepath)):
            csvpath = os.path.join(filepath, csvfile)
            m = re.match(r'^(.*?)-[\d\.]+\.csv$', csvfile)
            if not m:
                continue
            basename = m.group(1)

            if basename not in COLUMNS:
                print(basename, 'not in COLUMNS?')
                continue

            newname = os.path.join(filepath, '{0}.new'.format(os.path.splitext(csvfile)[0]))
            with open(csvpath) as in_file:
                fieldnames = COLUMNS[basename]
                reader = csv.DictReader(in_file)
                if len(reader.fieldnames) > len(fieldnames):
                    print('Rewriting {0}'.format(csvpath))

                    with open(newname, 'w') as out_file:
                        writer = csv.DictWriter(out_file, fieldnames=fieldnames)
                        writer.writeheader()
                        for row in reader:
                            writer.writerow({k: row[k] for k in fieldnames})

if __name__ == '__main__':
    main()
