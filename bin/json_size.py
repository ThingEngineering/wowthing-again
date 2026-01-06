import json
import pprint
import requests
import sys


r = requests.get(sys.argv[1], verify=False)
parsed = r.json()
sizes = []
for key, value in parsed.items():
    sizes.append([
        len(json.dumps(value, separators=[',', ':'])),
        key,
    ])
    
    if isinstance(value, dict) and len(value) < 20:
        sub_keys = []
        for v_key, v_value in value.items():
            sub_keys.append([
                len(json.dumps(v_value, separators=[',', ':'])),
                v_key
            ])
        
        sub_keys.sort()
        sub_keys.reverse()
        sizes[-1].append(sub_keys)

sizes.sort()
sizes.reverse()
pprint.pprint(sizes)
