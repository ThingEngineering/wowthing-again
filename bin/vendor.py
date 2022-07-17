import json
import math
import re
import requests
import sys


HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
}

STANDING = {
    4: 'friendly',
    5: 'honored',
    6: 'revered',
    7: 'exalted',
}

npc_re = re.compile(r'^var g_pageInfo = .*?typeId: (\d+), name: \"(.*?)\"\}\;$', re.MULTILINE)
sells_re = re.compile(r'^new Listview\(.*?data: (.*?)\}\)\;$', re.MULTILINE)


r = requests.get(sys.argv[1], headers=HEADERS)

m = npc_re.search(r.text)
if m:
    print(f'id: {m.group(1)}')
    print(f'name: "{m.group(2)}"')

print()
print('locations:')
print('  z0_unknown:')
print('    - 0 0')
print()

m = sells_re.search(r.text)
if m:
    sigh = re.sub(r'(standing|react|stack|avail|cost):', r'"\1":', m.group(1))
    items = json.loads(sigh)
    
    print('sells:')
    for item in items:
        print( '  - type: transmog')
        print(f'    id: {item["id"]} # {item["name"]}')
        print( '    costs:')

        costs = item['cost']
        if costs[0] > 0:
            print(f'      0: {math.floor(costs[0] / 10000)} # Gold')

        if len(costs) == 3:
            for cost in costs[2]:
                print(f'      1{cost[0]:06}: {cost[1]}')
        
        if item['standing'] > 0:
            print(f'    reputation: 0 {STANDING[item["standing"]]}')

        print('')
        #print('>', item)

else:
    print(r.text)
