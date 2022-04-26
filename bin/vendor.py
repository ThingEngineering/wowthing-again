import json
import re
import requests
import sys


HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
}
URL = 'https://www.wowhead.com/item=%s'

needle_re = re.compile(r'^\s*data: (\[\{\"appearances\".*?),?\s*$', re.MULTILINE)


for item_id in sys.argv[1:]:
    r = requests.get(URL % (item_id), headers=HEADERS)
    m = needle_re.search(r.text)
    if m:
        things = json.loads(m.group(1))
        things.sort(key=lambda t: [t['name'], t['id']])
        print(f"{item_id}, new[] {{ {', '.join(str(t['id']) for t in things)} }}")
    else:
        print(item_id, 'womp womp')
        print(r.text)
