import json
import os
import re
import requests
import subprocess
import sys

from dump_transmog import SLOT_MAP 


transmog_re = re.compile(r'^var transmogSets = (.*?);$', re.MULTILINE)


r = requests.get(sys.argv[1])
m = transmog_re.search(r.text)
if m:
    things = json.loads(m.group(1))
    things.sort(key=lambda t: t['name'])
    for thing in things:
        print(f'      - name: "{thing["name"]}"')
        print(f'        wowheadSetId: {thing["id"]}')
        print(f'        items:')

        args = ['python3', 'bin/dump_transmog.py', 'i']
        args.extend(str(s) for s in thing['pieces'])

        neat = subprocess.run(
            args,
            stdout=subprocess.PIPE,
            text=True
        )

        for line in neat.stdout.splitlines():
            if line.startswith('          '):
                print(line)

        #os.system(f'python3 bin/dump_transmog.py i {" ".join(str(s) for s in thing["pieces"])} | grep "^          "')

        #items = [[int(slot) if slot != '20' else 5, displayIds] for slot, displayIds in thing['displaysByType'].items()]

        #for slot, displayIds in sorted(items):
        #    s = slot < 10 and '  ' or ' '
        #    print(f'          {slot}:{s}{" ".join(str(s) for s in displayIds)} # {SLOT_MAP[slot]}')

        print()
        #print(thing)
        #print()

#https://www.wowhead.com/tier-16-raid-transmog-sets
