#!/bin/bash

echo "=========================================="
echo " Concurrent ID Generator Performance Test"
echo "=========================================="

TOTAL_REQUESTS=10000
CONCURRENT_REQUESTS=100

rm -rf concurrent-results
mkdir concurrent-results

echo ""
echo "Total Requests      : $TOTAL_REQUESTS"
echo "Concurrent Requests : $CONCURRENT_REQUESTS"
echo "Endpoint            : http://localhost/api/id"
echo ""

echo "Starting concurrent test..."

START_TIME=$(python3 -c 'import time; print(time.time())')

seq 1 $TOTAL_REQUESTS | xargs -P $CONCURRENT_REQUESTS -I {} \
bash -c 'curl -s http://localhost/api/id > concurrent-results/{}.json'

END_TIME=$(python3 -c 'import time; print(time.time())')

ELAPSED=$(python3 -c "print($END_TIME - $START_TIME)")

python3 - <<'PY'
import json
import glob

ids = []

for filename in glob.glob("concurrent-results/*.json"):
    try:
        with open(filename) as f:
            data = json.load(f)
            ids.append(data["id"])
    except Exception:
        pass

with open("concurrent-ids.txt", "w") as f:
    for value in ids:
        f.write(str(value) + "\n")
PY

TOTAL=$(wc -l < concurrent-ids.txt | tr -d ' ')
UNIQUE=$(sort -u concurrent-ids.txt | wc -l | tr -d ' ')
DUPLICATES=$((TOTAL - UNIQUE))

THROUGHPUT=$(python3 -c "print(round($TOTAL / $ELAPSED, 2))")

echo ""
echo "=========================================="
echo " Concurrent Performance Results"
echo "=========================================="

echo "Total IDs Generated : $TOTAL"
echo "Unique IDs          : $UNIQUE"
echo "Duplicate IDs       : $DUPLICATES"
echo "Time Taken          : $ELAPSED seconds"
echo "Throughput          : $THROUGHPUT IDs/sec"

echo "=========================================="

if [ "$DUPLICATES" -eq 0 ]; then
    echo "SUCCESS: All generated IDs are unique!"
else
    echo "FAILURE: Duplicate IDs detected!"
fi

echo "=========================================="