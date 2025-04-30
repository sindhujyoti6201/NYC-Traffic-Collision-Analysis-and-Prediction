from flask import Flask, jsonify
import requests
from confluent_kafka import Producer
import os
import json

app = Flask(__name__)
API_URL = "https://data.cityofnewyork.us/resource/h9gi-nx95.json?$limit=10"

conf = {
    'bootstrap.servers': os.getenv("BOOTSTRAP_SERVERS", "localhost:9092")
}
producer = Producer(conf)

def acked(err, msg):
    if err:
        print(f"❌ Delivery failed: {err}")
    else:
        print(f"✅ Delivered: {msg.value().decode('utf-8')}")

@app.route("/publish", methods=["POST"])
def publish():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        data = response.json()

        for item in data:
            producer.produce("collision-data", value=json.dumps(item), callback=acked)
            producer.poll(0)

        producer.flush()
        return jsonify({"status": "success", "count": len(data)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return "Kafka Producer App is running."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
