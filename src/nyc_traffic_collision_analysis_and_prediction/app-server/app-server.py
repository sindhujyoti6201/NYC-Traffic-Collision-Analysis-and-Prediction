from flask import Flask, jsonify
from pymongo import MongoClient
from pyspark.sql import SparkSession

app = Flask(__name__)

# MongoDB settings
MONGO_URI = "mongodb://mongodb:27017/"
DB_NAME = "streamingDB"
COLLECTION_NAME = "collisions_ts"

# Initialize MongoDB client
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

# Initialize Spark session with Mongo connector
spark = SparkSession.builder \
    .appName("MongoDB-Spark-App") \
    .config("spark.jars", "/app/jars/mongo-spark-connector_2.12-10.3.0.jar") \
    .config("spark.mongodb.read.connection.uri", f"{MONGO_URI}{DB_NAME}.{COLLECTION_NAME}") \
    .getOrCreate()

@app.route("/")
def home():
    return jsonify({"status": "server running", "info": "Use /analyze to trigger Spark job"})

@app.route("/analyze")
def analyze_data():
    try:
        # Read Mongo data into Spark DataFrame
        df = spark.read.format("mongo").load()
        count = df.count()
        schema = df.schema.json()

        return jsonify({
            "status": "success",
            "records_in_mongo": count,
            "schema": schema
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
