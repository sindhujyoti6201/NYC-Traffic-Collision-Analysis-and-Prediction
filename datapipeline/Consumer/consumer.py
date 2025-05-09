# consumer/consumer_test.py

import os
import json
import time
from threading import Thread
from dotenv import load_dotenv
from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable
from pymongo import MongoClient

# ─── Config & env ─────────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

KAFKA_ADDR    = os.getenv("KAFKA_ADDR", "kafka:9092")
MONGO_URI     = os.getenv("MONGO_URI", "mongodb://mongodb:27017/")
DB_NAME       = os.getenv("MONGO_DB", "streamingDB")

COL_TOPIC     = "raw_collisions"
SPD_TOPIC     = "traffic_speeds"

# ─── Mongo client & collections ────────────────────────────────
mongo = MongoClient(MONGO_URI)[DB_NAME]
collisions_col = mongo.collisions_ts
speeds_col     = mongo.traffic_speeds

# ─── Helper: retrying consumer factory ─────────────────────────
def make_consumer(topic, group, offset):
    while True:
        try:
            c = KafkaConsumer(
                topic,
                bootstrap_servers=[KAFKA_ADDR],
                group_id=group,
                auto_offset_reset=offset,
                enable_auto_commit=True,
                value_deserializer=lambda m: json.loads(m.decode("utf-8"))
            )
            print(f"✅ {group} connected to Kafka, subscribed to {topic}")
            return c
        except NoBrokersAvailable:
            print(f"⏳ {group} cannot connect to Kafka at {KAFKA_ADDR}, retrying in 5s…")
            time.sleep(5)

# ─── Collision consumer (backfill) ────────────────────────────
def consume_collisions():
    cons = make_consumer(COL_TOPIC, "collision-consumer", "earliest")
    for msg in cons:
        try:
            collisions_col.insert_one(msg.value)
            print(f"📥 Inserted collision {msg.value.get('collision_id')} @ {msg.value.get('timestamp')}")
        except Exception as e:
            print(f"❌ Collision insert error: {e}")

# ─── Speeds consumer (live‑only) ───────────────────────────────
def consume_speeds():
    cons = make_consumer(SPD_TOPIC, "speed-live-checker", "latest")
    for msg in cons:
        try:
            speeds_col.insert_one(msg.value)
            print(f"📥 Inserted speed @ {msg.value.get('timestamp')}")
        except Exception as e:
            print(f"❌ Speed insert error: {e}")

if __name__ == "__main__":
    Thread(target=consume_collisions, daemon=True).start()
    Thread(target=consume_speeds,    daemon=True).start()
    print("✅ Consumers are up and running.")
    while True:
        time.sleep(60)
