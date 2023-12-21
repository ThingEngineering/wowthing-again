import json
import pprint
import requests
import sys


r = requests.get(sys.argv[1])
parsed = r.json()
sizes = []
for key, value in parsed.items():
    sizes.append([
        len(json.dumps(value)),
        key,
    ])

sizes.sort()
sizes.reverse()
pprint.pprint(sizes)
