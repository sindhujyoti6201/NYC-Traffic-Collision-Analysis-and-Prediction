# consumer/consumer.py

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
def make_consumer(topic, group_id, offset_reset):
    while True:
        try:
            c = KafkaConsumer(
                topic,
                bootstrap_servers=[KAFKA_ADDR],
                group_id=group_id,            
                auto_offset_reset=offset_reset,
                enable_auto_commit=True,
                value_deserializer=lambda m: json.loads(m.decode("utf-8"))
            )
            print(f"✅ {group_id} connected to Kafka, subscribed to {topic}")
            return c
        except NoBrokersAvailable:
            print(f"⏳ {group_id} cannot connect to Kafka at {KAFKA_ADDR}, retrying in 5s…")
            time.sleep(5)

# ─── Collision consumer (historical + incremental) ─────────────
def consume_collisions():
    # Read from the very beginning on first ever run; then only new messages
    cons = make_consumer(COL_TOPIC, group_id="collision-consumer", offset_reset="earliest")
    for msg in cons:
        try:
            collisions_col.insert_one(msg.value)
            print(f"📥 Inserted collision {msg.value.get('collision_id')} @ {msg.value.get('timestamp')}")
        except Exception as e:
            print(f"❌ Collision insert error: {e}")

# ─── Speeds consumer (historical + incremental) ────────────────
def consume_speeds():
    # Now backfill all speeds as well, then pick up new ones
    cons = make_consumer(SPD_TOPIC, group_id="speed-consumer", offset_reset="earliest")
    for msg in cons:
        try:
            speeds_col.insert_one(msg.value)
            print(f"📥 Inserted speed @ {msg.value.get('timestamp')}")
        except Exception as e:
            print(f"❌ Speed insert error: {e}")

if __name__ == "__main__":
    print("Starting consumers...")
    # Start the consumers in separate threads
    Thread(target=consume_collisions, daemon=True).start()
    Thread(target=consume_speeds,    daemon=True).start()
    print("✅ Consumers are up and running.")
    while True:
        time.sleep(60)
