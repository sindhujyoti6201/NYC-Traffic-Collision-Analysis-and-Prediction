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

        # Create start and end of day in UTC
        date_start = datetime.utcnow() - timedelta(days=days)
        date_start = datetime(date_start.year, date_start.month, date_start.day)  # start of day
        date_end = date_start + timedelta(days=1)  # next day's start time (exclusive)

        app.logger.info(f"Fetching records between {date_start.isoformat()} and {date_end.isoformat()}")

        results = list(
            collection.find({
                "timestamp": {
                    "$gte": date_start.isoformat(),
                    "$lt": date_end.isoformat()
                }
            })
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

@app.route("/api/realtime-traffic-metrics", methods=["GET"])
def api_realtime_metrics():
    try:
        days = int(request.args.get("days", 5))
        limit = int(request.args.get("limit", 2000))
        now = datetime.utcnow()
        start_time = now - timedelta(days=days)

        # Fetch traffic data
        traffic_data = list(db["traffic_speeds"].find({
            "timestamp": {"$gte": start_time.isoformat()}
        }).limit(limit))

        speeds = [doc.get("speed_mph", 0) for doc in traffic_data if doc.get("speed_mph") is not None]
        average_city_speed = round(sum(speeds) / len(speeds)) if speeds else 0

        valid_streets = [doc for doc in traffic_data if doc.get("speed_mph", 0) > 0]
        most_congested = min(valid_streets, key=lambda x: x["speed_mph"])["street"] if valid_streets else "N/A"

        from collections import Counter
        street_counts = Counter(doc.get("street", "Unknown") for doc in traffic_data)
        busiest_street = street_counts.most_common(1)[0][0] if street_counts else "N/A"

        total_records = len(traffic_data)
        unique_streets = len(set(doc.get("street", "Unknown") for doc in traffic_data))
        avg_vehicles_per_street = round(total_records / unique_streets) if unique_streets > 0 else 0

        active_incidents = db["collisions_ts"].count_documents({
            "timestamp": {"$gte": start_time.isoformat()}
        })

        return jsonify({
            "status": "success",
            "avgSpeed": average_city_speed,
            "activeIncidents": active_incidents,
            "mostCongested": most_congested,
            "busiestStreet": busiest_street,
            "avgVehiclesPerStreet": avg_vehicles_per_street
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/api/realtime-collision-metrics", methods=["GET"])
def api_realtime_collisions():
    try:
        # Get time window from query param OR default to 60 min
        days = int(request.args.get("days", 5))
        now = datetime.utcnow()
        start_time = now - timedelta(days=days)

        # Get all recent collisions
        collisions_cursor = db["collisions_ts"].find({
            "timestamp": {"$gte": start_time.isoformat()}
        })

        collisions_data = list(collisions_cursor)

        # Collisions count
        collisions_count = len(collisions_data)

        # Total injuries
        total_injuries = sum(int(doc.get("injured", "0")) for doc in collisions_data)

        # Most impacted borough
        from collections import Counter
        borough_counts = Counter(doc.get("borough", "Unknown") for doc in collisions_data if doc.get("borough"))
        most_impacted = borough_counts.most_common(1)[0][0] if borough_counts else "N/A"

        return jsonify({
            "status": "success",
            "collisions": collisions_count,
            "totalInjuries": total_injuries,
            "mostImpactedBorough": most_impacted
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
