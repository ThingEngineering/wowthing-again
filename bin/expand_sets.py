import csv
import glob
import json
import os
import re
import requests
import subprocess
import sys


CLASS_MASK = {
       1: 'Warrior',
       2: 'Paladin',
       4: 'Hunter',
       8: 'Rogue',
      16: 'Priest',
      32: 'Death Knight',
      64: 'Shaman',
     128: 'Mage',
     256: 'Warlock',
     512: 'Monk',
    1024: 'Druid',
    2048: 'Demon Hunter',
    4096: 'Evoker',
}

SLOT_MAP = {
     1: 'Head',
     3: 'Shoulders',
     5: 'Chest',
     6: 'Waist',
     7: 'Legs',
     8: 'Feet',
     9: 'Wrists',
    10: 'Hands',
    16: 'Back',
    20: 'Chest',
}

SLOT_ORDER = [
    1,
    3,
    16,
    5,
    20,
    9,
    10,
    6,
    7,
    8,
]


def main():
    dumps_path = os.path.join(os.path.abspath(os.path.expanduser(os.environ['WOWTHING_DUMP_PATH'])), 'enUS')

    set_items = {}
    with open(os.path.join(dumps_path, 'itemset.csv')) as csv_file:
        for row in csv.DictReader(csv_file):
            this_set = set_items[int(row['ID'])] = []
            for i in range(16):
                item_id = int(row[f'ItemID[{i}]'])
                if item_id > 0:
                    this_set.append(item_id)

    item_class_mask = {}
    item_slot = {}
    with open(os.path.join(dumps_path, 'item.csv')) as csv_file:
        for row in csv.DictReader(csv_file):
            item_id = int(row['ID'])
            item_slot[item_id] = int(row['InventoryType'])

    item_name = {}
    with open(os.path.join(dumps_path, 'itemsparse.csv')) as csv_file:
        for row in csv.DictReader(csv_file):
            item_id = int(row['ID'])
            item_class_mask[item_id] = int(row['AllowableClass'])
            item_name[item_id] = row['Display_lang']

    for set_id in sys.argv[1:]:
        item_ids = set_items[int(set_id)]
        item_ids.sort(key=lambda x: SLOT_ORDER.index(item_slot[x]))
        for item_id in item_ids:
            print(f'  - {item_id} # {item_name[item_id]} [{CLASS_MASK[item_class_mask[item_id]]} {SLOT_MAP[item_slot[item_id]]}]')


if __name__ == '__main__':
    main()
