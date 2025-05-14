# src/inference/predictor.py

import os
from datetime import datetime, timedelta, timezone

import numpy as np
import pandas as pd
from pymongo import MongoClient
from huggingface_hub import hf_hub_download
import joblib
from dotenv import load_dotenv

# ─── Load environment ────────────────────────────────────────────
load_dotenv()

# ─── Configuration ───────────────────────────────────────────────
MONGO_URI   = os.getenv("MONGO_URI", "mongodb://mongodb:27017/")
DB_NAME     = os.getenv("MONGO_DB", "streamingDB")
SPEED_COLL  = "traffic_speeds"

HF_REPO     = os.getenv("HF_MODEL_REPO")
HF_TOKEN    = os.getenv("HF_TOKEN")
MODEL_FILE  = "model.joblib"

# ─── Download & load the model ──────────────────────────────────
_model_path = hf_hub_download(
    repo_id=HF_REPO,
    filename=MODEL_FILE,
    token=HF_TOKEN
)
_model = joblib.load(_model_path)

# ─── Helper functions ──────────────────────────────────────────

def compute_centroid(link_points: str):
    pts = []
    for p in (link_points or "").split():
        try:
            lon, lat = map(float, p.split(","))
            pts.append((lat, lon))
        except Exception:
            continue
    if not pts:
        return np.nan, np.nan
    lats, lons = zip(*pts)
    return float(np.mean(lats)), float(np.mean(lons))

def fetch_speeds_from_mongo(days: int, limit: int) -> pd.DataFrame:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    coll = db[SPEED_COLL]

    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)) \
                .replace(microsecond=0).isoformat()

    cursor = (
        coll.find({"timestamp": {"$gte": cutoff}})
            .sort("timestamp", -1)
            .limit(limit)
    )
    return pd.DataFrame(list(cursor))

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["timestamp"] = pd.to_datetime(df.get("timestamp"), errors="coerce")
    df["month"] = df["timestamp"].dt.month
    df["day"] = df["timestamp"].dt.day
    df["hour"] = df["timestamp"].dt.hour

    centroids = df["coordinates"].apply(lambda s: pd.Series(compute_centroid(s)))
    centroids.columns = ["c_lat", "c_long"]
    df = pd.concat([df, centroids], axis=1)

    df["speed_mph"] = pd.to_numeric(df.get("speed_mph", 0), errors="coerce").fillna(0)

    if "street_code" not in df.columns:
        df["street_code"] = df["street"].astype("category").cat.codes

    FEATURE_COLS = [
        "month",
        "day",
        "hour",
        "street_code",
        "speed_mph",
        "c_lat",
        "c_long",
    ]
    X = df[FEATURE_COLS].astype(float)

    df["crash_score"] = _model.predict(X)

    # (Removed normalization as requested)
    return df

def get_predictions(days: int = 7, limit: int = 5000) -> list[dict]:
    df_raw = fetch_speeds_from_mongo(days, limit)
    df_out = build_features(df_raw)
    # (Commented drop crash_score)
    # df_out = df_out.drop(columns=["crash_score"])
    return df_out.to_dict(orient="records")
