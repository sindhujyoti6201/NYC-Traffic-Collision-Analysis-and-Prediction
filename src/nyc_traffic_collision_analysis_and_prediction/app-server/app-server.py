from flask import Flask, jsonify, request
from pymongo import MongoClient
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB settings
MONGO_URI = "mongodb://mongodb:27017/"
DB_NAME = "streamingDB"

# Initialize MongoDB client
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

@app.route("/")
def home():
    return jsonify({
        "status": "server running",
        "info": "Use /api/collisions or /api/traffic with optional ?days=N&limit=M query parameters"
    })

def get_recent_data(collection_name, days=5, limit=2000):
    try:
        app.logger.info(f"Fetching data from collection: {collection_name}")
        collection = db[collection_name]
        now = datetime.utcnow()
        start_time = (now - timedelta(days=days)).replace(microsecond=0).isoformat()
        app.logger.info(f"Fetching records from {start_time} to {now.isoformat()}")

        results = list(
            collection.find({"timestamp": {"$gte": start_time}})
                      .sort("timestamp", -1)
                      .limit(limit)
        )

        app.logger.info(f"Found {len(results)} records")
        # Clean ObjectId for JSON serialization
        for doc in results:
            doc["_id"] = str(doc["_id"])

        return {
            "status": "success",
            "collection": collection_name,
            "records_found": len(results),
            "data": results
        }
    except Exception as e:
        return {
            "status": "error",
            "collection": collection_name,
            "message": str(e)
        }

@app.route("/api/realtime-metrics", methods=["GET"])
def api_realtime_metrics():
    try:
        days = int(request.args.get("days", 5))
        limit = int(request.args.get("limit", 2000))
        now = datetime.utcnow()
        start_time = now - timedelta(days=days)

        # Fetch traffic data
        traffic_cursor = db["traffic_speeds"].find({
            "timestamp": {"$gte": start_time.isoformat()}
        }).limit(limit)

        traffic_data = list(traffic_cursor)
        speeds = [doc.get("speed_mph", 0) for doc in traffic_data if doc.get("speed_mph") is not None]
        avg_speed = round(sum(speeds) / len(speeds)) if speeds else 0

        # Most congested street (lowest non-zero speed)
        valid_streets = [doc for doc in traffic_data if doc.get("speed_mph", 0) > 0]
        most_congested = min(valid_streets, key=lambda x: x["speed_mph"])["street"] if valid_streets else "N/A"

        # Fetch collisions data
        active_incidents = db["collisions_ts"].count_documents({
            "timestamp": {"$gte": start_time.isoformat()}
        })

        return jsonify({
            "status": "success",
            "avgSpeed": avg_speed,
            "activeIncidents": active_incidents,
            "mostCongested": most_congested
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/api/collisions", methods=["GET"])
def api_recent_collisions():
    days = int(request.args.get("days", 5))
    limit = int(request.args.get("limit", 2000))
    return jsonify(get_recent_data("collisions_ts", days=days, limit=limit))

@app.route("/api/traffic", methods=["GET"])
def api_recent_traffic():
    days = int(request.args.get("days", 5))
    limit = int(request.args.get("limit", 2000))
    return jsonify(get_recent_data("traffic_speeds", days=days, limit=limit))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
