#!/usr/bin/env bash
set -euo pipefail

echo "=== Latest 5 collisions ==="
docker-compose exec mongodb mongosh streamingDB --quiet --eval '
  db.collisions_ts
    .find()
    .sort({ timestamp: -1 })
    .limit(5)
    .forEach(printjson);
'

echo
echo "=== Latest 5 traffic speeds ==="
docker-compose exec mongodb mongosh streamingDB --quiet --eval '
  db.traffic_speeds
    .find()
    .sort({ timestamp: -1 })
    .limit(5)
    .forEach(printjson);
'
