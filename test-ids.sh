#!/bin/bash

echo "======================================"
echo "Distributed ID Generator Test"
echo "======================================"

rm -f ids.txt

echo "Generating 300 IDs..."

for i in {1..100}; do
    curl -s http://localhost:8081/api/id | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])' >> ids.txt
    curl -s http://localhost:8082/api/id | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])' >> ids.txt
    curl -s http://localhost:8083/api/id | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])' >> ids.txt
done

TOTAL=$(wc -l < ids.txt | tr -d ' ')
UNIQUE=$(sort -u ids.txt | wc -l | tr -d ' ')
DUPLICATES=$((TOTAL - UNIQUE))

echo ""
echo "Total IDs      : $TOTAL"
echo "Unique IDs     : $UNIQUE"
echo "Duplicates     : $DUPLICATES"

echo "======================================"

if [ "$DUPLICATES" -eq 0 ]; then
    echo "SUCCESS: No duplicate IDs!"
else
    echo "FAILURE: Duplicate IDs detected!"
fi