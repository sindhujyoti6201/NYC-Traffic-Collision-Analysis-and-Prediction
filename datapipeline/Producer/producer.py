# producer/producer_test.py

import os
import json
import time
import threading
import shutil
from pathlib import Path
from dotenv import load_dotenv
from sodapy import Socrata
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
from flask import Flask

# ─── Config & env ─────────────────────────────────────────────
root            = Path(__file__).parent
load_dotenv(dotenv_path=root.parent / '.env')

COLLISIONS_RES  = "h9gi-nx95"
SPEEDS_RES      = os.getenv("SPEEDS_RESOURCE", "i4gi-tjb9")
APP_TOKEN       = os.getenv("SOCRATA_APP_TOKEN")
KAFKA_ADDR      = os.getenv("KAFKA_ADDR", "kafka:9092")

COL_TOPIC       = "raw_collisions"
SPD_TOPIC       = "traffic_speeds"

COLLISION_INT   = 30     # seconds between collision fetches
SPEEDS_INT      = 300    # seconds between speed fetches

# ─── Watermark file for collisions ─────────────────────────────
WATERMARK_FILE  = root / "last_ingested.txt"

# Auto‑heal if a directory is mounted by mistake
if WATERMARK_FILE.exists() and WATERMARK_FILE.is_dir():
    print(f"⚠️  Removing directory at {WATERMARK_FILE}")
    shutil.rmtree(WATERMARK_FILE)

def get_last_timestamp() -> str:
    try:
        if WATERMARK_FILE.is_file():
            return WATERMARK_FILE.read_text().strip()
    except Exception:
        pass
    return "2020-01-01T00:00:00"

def set_last_timestamp(ts: str):
    if WATERMARK_FILE.exists() and WATERMARK_FILE.is_dir():
        shutil.rmtree(WATERMARK_FILE)
    WATERMARK_FILE.write_text(ts)

# ─── Kafka producer ─────────────────────────────────
def make_producer(addr: str) -> KafkaProducer:
    while True:
        try:
            p = KafkaProducer(
                bootstrap_servers=[addr],
                value_serializer=lambda v: json.dumps(v).encode("utf-8")
            )
            print(f"✅ Connected to Kafka at {addr}")
            return p
        except NoBrokersAvailable:
            print(f"⏳ Kafka not ready at {addr}, retrying in 5 s…")
            time.sleep(5)

producer = make_producer(KAFKA_ADDR)

# ─── Socrata client ────────────────────────────────────────────
socrata = Socrata("data.cityofnewyork.us", APP_TOKEN, timeout=30)

# ─── Fetch & publish collisions ─────────────────────────────────
def fetch_and_publish_collisions():
    last_ts = get_last_timestamp()
    print(f"🔄 [Collisions] fetching since {last_ts}")
    API_MAX, offset, total = 50000, 0, 0
    max_ts = last_ts
    date0, time0 = last_ts.split("T", 1)
    where = (
        f"(crash_date > '{date0}') OR "
        f"(crash_date = '{date0}' AND crash_time > '{time0}')"
    )
    select = ",".join([
        "collision_id","crash_date","crash_time",
        "latitude","longitude","borough",
        "vehicle_type_code1","vehicle_type_code2",
        "vehicle_type_code_3","vehicle_type_code_4","vehicle_type_code_5"
    ])

    while True:
        rows = socrata.get(
            COLLISIONS_RES, where=where, select=select,
            limit=API_MAX, offset=offset,
            order="crash_date ASC, crash_time ASC"
        )
        if not rows:
            break

        for r in rows:
            date_part = r["crash_date"].split("T",1)[0]
            parts = [p.zfill(2) for p in r["crash_time"].split(":")]
            parts += ["00"] * (3 - len(parts))
            iso_ts = f"{date_part}T{':'.join(parts)}"
            max_ts = max(max_ts, iso_ts)

            lat, lon = r.get("latitude"), r.get("longitude")
            if lat is None or lon is None:
                continue

            event = {
                "collision_id":  r["collision_id"],
                "timestamp":     iso_ts,
                "lat":           float(lat),
                "lon":           float(lon),
                "borough":       r.get("borough"),
                "vehicle_types": [
                    r.get("vehicle_type_code1"),
                    r.get("vehicle_type_code2"),
                    r.get("vehicle_type_code_3"),
                    r.get("vehicle_type_code_4"),
                    r.get("vehicle_type_code_5"),
                ]
            }
            producer.send(COL_TOPIC, event)
            total += 1

        producer.flush()
        offset += API_MAX
        time.sleep(0.1)

    set_last_timestamp(max_ts)
    print(f"✅ [Collisions] published {total} events, new watermark={max_ts}")
    threading.Timer(COLLISION_INT, fetch_and_publish_collisions).start()

# ─── Fetch & publish traffic speeds ─────────────────────────────
def fetch_and_publish_speeds():
    print("🔄 [Speeds] fetching latest traffic speeds…")
    rows = socrata.get(
        SPEEDS_RES,
        select="speed,link_name,data_as_of",
        order="data_as_of DESC",
        limit=10000
    )
    print(f"🔢 [Speeds] retrieved {len(rows)} rows")
    published = 0
    for r in rows:
        try:
            event = {
                "timestamp": r["data_as_of"],
                "street":    r.get("link_name"),
                "speed_mph": float(r.get("speed") or 0)
            }
            producer.send(SPD_TOPIC, event)
            published += 1
        except Exception as e:
            print(f"❌ [Speeds] skip row due to {e}")
    producer.flush()
    print(f"✅ [Speeds] published {published} events")
    threading.Timer(SPEEDS_INT, fetch_and_publish_speeds).start()

# ─── Flask health endpoint ─────────────────────────────────────
app = Flask(__name__)

@app.route("/health")
def health():
    return "OK", 200

if __name__ == "__main__":
    # start both loops immediately
    fetch_and_publish_collisions()
    fetch_and_publish_speeds()
    app.run(host="0.0.0.0", port=5000)
