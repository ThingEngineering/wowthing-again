import csv
import os
import os.path
import re
import sys


class CsvReader:
    base_path = os.path.join(os.path.abspath(os.path.expanduser(os.environ['WOWTHING_DUMP_PATH'])), 'enUS')

    def __init__(self, filename):
        self.filename = filename + '.csv'
    
    def __enter__(self):
        self.file = open(os.path.join(self.base_path, self.filename))
        return csv.DictReader(self.file)
    
    def __exit__(self, exc_type, exc_value, traceback):
        self.file.close()


def main():
    bonuses = {}

    with CsvReader('itembonus') as reader:
        for row in reader:
            bonus_list_id = int(row['ParentItemBonusListID'])
            bonuses.setdefault(bonus_list_id, []).append(dict(
                type=int(row['Type']),
                values=[n for n in [int(row[f'Value[{v}]']) for v in [0, 1, 2, 3]] if n > 0]
            ))
    
    print(bonuses)


if __name__ == '__main__':
    main()
