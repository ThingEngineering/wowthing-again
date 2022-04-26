import csv
import json
import os


FIELDS = [
    'id',
    'armorType',
    'reqclass',
    'name',
    'pieces',
]


data = json.load(open('data/transmog/wh.json'))

with open('data/transmog/wh.csv', 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=FIELDS, extrasaction='ignore')
    writer.writeheader()

    for thing in data:
        thing['pieces'] = ' '.join(str(p) for p in thing['pieces'])
        writer.writerow(thing)
        #print(thing)
