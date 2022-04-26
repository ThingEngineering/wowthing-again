#!/bin/bash

# https://wow.tools/dbc/api/export/?name=itemsparse&build=9.1.5.41079&useHotfixes=true
# https://wow.tools/dbc/api/export/?name=itemsparse&build=9.1.5.41079&locale=frFR&useHotfixes=true


for csv in *.csv; do
  base=`echo $csv | sed -E 's/-.*?$//'`
  curl -o ${base}-${1}.csv "https://wow.tools/dbc/api/export/?name=${base}&build=${1}&useHotfixes=true"
done
