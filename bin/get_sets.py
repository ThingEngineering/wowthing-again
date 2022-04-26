import json
import re
import requests
import sys


transmog_re = re.compile(r'^var transmogSets = (.*?);$', re.MULTILINE)


r = requests.get(sys.argv[1])
m = transmog_re.search(r.text)
if m:
    things = json.loads(m.group(1))
    things.sort(key=lambda t: t['name'])
    for thing in things:
        print(f'{str(thing["id"]).rjust(4)} {thing["name"]}')


#https://www.wowhead.com/tier-16-raid-transmog-sets
