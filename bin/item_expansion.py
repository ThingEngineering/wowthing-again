import json
import math
import re
import requests
import requests_cache
import sys


HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
}
ITEM_URL = 'https://www.wowhead.com/item=%s'

CHRCLASS = {
    32: 'Death Knight',
    2048: 'Demon Hunter',
    1024: 'Druid',
    4096: 'Evoker',
    4: 'Hunter',
    128: 'Mage',
    512: 'Monk',
    2: 'Paladin',
    16: 'Priest',
    8: 'Rogue',
    64: 'Shaman',
    256: 'Warlock',
    1: 'Warrior',
}

data_re = re.compile(r'^\s+data: (\[\{\"appearances\".+)\,$', re.MULTILINE)
name_re = re.compile(r'^\s*var g_pageInfo.+name\: \"(.*?)\" \}\;$', re.MULTILINE)

requests_cache.install_cache('temp/requests_cache', expire_after=4 * 3600)


ids = []
for arg in sys.argv[1:]:
    m = re.match(r'^(\d+)-(\d+)', arg)
    if m:
        for i in range(int(m.group(1)), int(m.group(2)) + 1):
            ids.append(str(i))
    else:
        ids.append(arg)


for id in ids:
    url = ITEM_URL % (id)
    r = requests.get(url, headers=HEADERS)

    m = name_re.search(r.text)
    if not m:
        print('name_re fail')
        continue

    print()
    print(f'{id}: # {m.group(1)}')

    matches = data_re.findall(r.text)
    if not matches:
        print('data_re fail')
        continue

    data = json.loads(matches[-1])

    items = sorted(
        [item for item in data if 'Gladiator' not in item['name']],
        key=lambda item: [
            item.get('reqclass', 0) and CHRCLASS[item['reqclass']] or 99,
            item['name'],
        ]
    )
    for item in items:
        if 'reqclass' in item:
            print(f'  - {item["id"]} # {item["name"]} [{CHRCLASS[item["reqclass"]]}]')
        else:
            print(f'  - {item["id"]} # {item["name"]}')
