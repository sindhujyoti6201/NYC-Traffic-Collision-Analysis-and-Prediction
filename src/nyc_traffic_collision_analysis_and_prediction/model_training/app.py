from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("MongoSparkApp") \
    .config("spark.mongodb.read.connection.uri", "mongodb://mongo:27017/extracted_data") \
    .getOrCreate()

# Load first collection
df1 = spark.read \
    .format("com.mongodb.spark.sql.DefaultSource") \
    .option("database", "extracted_data") \
    .option("collection", "traffic_data") \
    .load()

# Load second collection
df2 = spark.read \
    .format("com.mongodb.spark.sql.DefaultSource") \
    .option("database", "extracted_data") \
    .option("collection", "collision_data") \
    .load()

df1.show(2)
df2.show(2)
