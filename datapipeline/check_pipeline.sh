#!/usr/bin/env bash
set -e

echo "⏳ Checking producer health endpoint..."
for HOST in 127.0.0.1 localhost; do
  if curl --silent --connect-timeout 2 http://$HOST:5001/health | grep -q OK; then
    echo "✅ Producer is healthy at http://$HOST:5001/health"
    break
  else
    echo "❌ No response at http://$HOST:5001/health"
  fi
done

echo
echo "⏳ Listing Kafka topics..."
docker-compose exec kafka kafka-topics --bootstrap-server kafka:9092 --list

echo
echo "⏳ Checking for at least one message in each Kafka topic..."
for TOPIC in raw_collisions traffic_speeds; do
  echo -n "  • $TOPIC: "
  if docker-compose exec -T kafka \
    kafka-console-consumer \
      --bootstrap-server kafka:9092 \
      --topic "$TOPIC" --from-beginning --max-messages 1 2>/dev/null \
    | grep -q '{'; then
    echo "has messages ✅"
  else
    echo "no messages found ❌"
  fi
done

echo
echo "⏳ Checking MongoDB collections and latest docs..."
docker-compose exec mongodb mongosh --quiet streamingDB --eval '
  print("  • collisions_ts count:", db.collisions_ts.countDocuments());
  print("  • traffic_speeds count:", db.traffic_speeds.countDocuments());
  print("\n  🔍 Latest collision doc:");
  printjson(db.collisions_ts.find().sort({timestamp:-1}).limit(1).next());
  print("\n  🔍 Latest speed doc:");
  printjson(db.traffic_speeds.find().sort({timestamp:-1}).limit(1).next());
'

echo
echo "🎉 All checks complete."

