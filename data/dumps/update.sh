#!/bin/bash

for csv in *.csv; do
  base=`echo $csv | sed -E 's/-.*?$//'`
  curl -o ${base}-${1}.csv "https://wow.tools/dbc/api/export/?name=${base}&build=${1}&useHotfixes=true"
done
