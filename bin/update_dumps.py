#!/usr/bin/env python3

import os
import os.path
import re
import requests
import sys


BASE_DIR = './dumps'
API_URL = 'https://wow.tools/dbc/api/export/?name={0}&build={1}&locale={2}&useHotfixes=true'

HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
}

def main():
    paths = []
    dirs = []
    for filename in sorted(os.listdir(BASE_DIR)):
        filepath = os.path.join(BASE_DIR, filename)
        if os.path.isdir(filepath):
            dirs.append([filename, filepath])
        else:
            fetch_file(BASE_DIR, filename)

    for filename, filepath in dirs:
        for locale_filename in sorted(os.listdir(filepath)):
            fetch_file(filepath, locale_filename, filename)

def fetch_file(dirname, filename, locale=None):
    new_build = sys.argv[1]
    m = re.match(r'^(.*?)-([\d\.]+)\.csv$', filename)
    basename = m.group(1)
    current_build = m.group(2)
    if current_build == new_build:
        print('already current: {0}/{1}'.format(locale or 'base', basename))
        return

    url = API_URL.format(basename, sys.argv[1], locale or 'enUS')
    print('updating: {0}/{1} to {2}...'.format(locale or 'base', basename, new_build), end='', flush=True)
    
    r = requests.get(url, headers=HEADERS)
    r.encoding = 'UTF-8'
    if r.status_code == requests.codes.ok:
        with open(os.path.join(dirname, '{0}-{1}.csv'.format(basename, new_build)), 'w') as f:
            f.write(r.text)
        os.remove(os.path.join(dirname, filename))
        print(' saved {0} bytes'.format(len(r.text)))
    else:
        print(' ERROR {0}'.format(r.status_code))
        sys.exit(1)

if __name__ == '__main__':
    main()

# https://wow.tools/dbc/api/export/?name=itemsparse&build=9.1.5.41079&useHotfixes=true
# https://wow.tools/dbc/api/export/?name=itemsparse&build=9.1.5.41079&locale=frFR&useHotfixes=true
