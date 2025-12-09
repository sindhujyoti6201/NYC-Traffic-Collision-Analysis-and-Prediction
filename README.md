# NYC Traffic Collision Analysis and Prediction

A comprehensive real-time data pipeline and web application for analyzing and predicting traffic collisions in New York City. This project integrates data ingestion, stream processing, machine learning predictions, and interactive visualizations.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Data Pipeline](#data-pipeline)
- [Model Training](#model-training)
- [Frontend Application](#frontend-application)
- [Environment Variables](#environment-variables)
- [Docker Services](#docker-services)

## 🎯 Overview

This project provides a complete solution for:
- **Real-time data ingestion** from NYC Open Data APIs (Socrata)
- **Stream processing** using Apache Kafka
- **Data storage** in MongoDB
- **Machine learning predictions** for traffic collisions
- **Interactive web dashboard** for visualization and analysis

The system continuously fetches traffic speed data and collision records, processes them through a Kafka-based pipeline, stores them in MongoDB, and serves predictions and analytics through a Flask API and React frontend.

## 🏗️ Architecture

```
┌─────────────────┐
│  NYC Open Data  │
│   (Socrata API) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Producer     │  ◄─── Fetches data periodically
│   (Flask App)   │      Publishes to Kafka topics
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Apache Kafka   │  ◄─── Message broker
│  (Topics:       │      - raw_collisions
│   collisions,   │      - traffic_speeds
│   speeds)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Consumer     │  ◄─── Consumes from Kafka
│                 │      Writes to MongoDB
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │  ◄─── Collections:
│                 │      - collisions_ts
│                 │      - traffic_speeds
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Flask API      │  ◄─── Serves data & predictions
│  (Port 5002)    │      ML model inference
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │  ◄─── Interactive dashboard
│  (FlowSight)    │      Real-time visualizations
└─────────────────┘
```

## 📁 Project Structure

```
NYC-Traffic-Collision-Analysis-and-Prediction/
├── docker-compose.yaml          # Docker orchestration for all services
├── pyproject.toml               # Python project configuration
├── README.md                    # This file
│
├── dummy_data/                  # Sample data files
│   ├── collision_data.jsonl
│   └── traffic_data.jsonl
│
├── frontend/
│   └── FlowSight/              # React + TypeScript frontend
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   │   ├── Footer.tsx
│       │   │   ├── GoogleMapWithTraffic.tsx
│       │   │   ├── Navbar.tsx
│       │   │   ├── SummaryStats.tsx
│       │   │   ├── ThemeToggle.tsx
│       │   │   └── TrafficTrends.tsx
│       │   ├── pages/          # Page components
│       │   │   ├── Home.tsx
│       │   │   ├── RealTime.tsx
│       │   │   ├── Historical.tsx
│       │   │   ├── Predictions.tsx
│       │   │   ├── Traffic.tsx
│       │   │   ├── Collision.tsx
│       │   │   └── ...
│       │   ├── routes.tsx      # React Router configuration
│       │   ├── App.tsx         # Main app component
│       │   └── theme.ts        # Material-UI theme
│       ├── public/             # Static assets
│       │   └── visualization/ # Visualization scripts
│       ├── package.json
│       └── vite.config.ts
│
└── src/
    └── nyc_traffic_collision_analysis_and_prediction/
        ├── app-server/         # Flask API server
        │   ├── app-server.py   # Main API endpoints
        │   ├── inference_model.py  # ML model inference
        │   ├── Dockerfile
        │   └── requirements.txt
        │
        ├── datapipeline/
        │   ├── Producer/       # Data ingestion service
        │   │   ├── app.py      # Fetches from Socrata API
        │   │   ├── dockerfile
        │   │   └── requirements.txt
        │   │
        │   ├── Consumer/       # Kafka consumer service
        │   │   ├── consumer.py # Consumes & stores in MongoDB
        │   │   ├── dockerfile
        │   │   └── requirements.txt
        │   │
        │   ├── check_latest.sh # Utility scripts
        │   └── check_pipeline.sh
        │
        └── model_training/     # ML model development
            ├── app.py
            ├── inference_model.py
            ├── main.ipynb
            ├── model_training.ipynb
            ├── modeling-dask.ipynb
            ├── modeling-spark.ipynb
            ├── modeling.ipynb
            ├── requirements.txt
            └── README.md
```

## 🛠️ Technology Stack

### Backend
- **Python 3.9-3.10**: Core language
- **Flask**: REST API framework
- **Apache Kafka**: Message streaming platform
- **MongoDB**: NoSQL database for time-series data
- **PySpark**: Distributed data processing (for model training)
- **scikit-learn**: Machine learning models
- **Hugging Face Hub**: Model storage and versioning

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Material-UI (MUI)**: Component library
- **React Router**: Client-side routing
- **Chart.js**: Data visualization
- **Google Maps API**: Map visualizations
- **Vite**: Build tool and dev server

### Infrastructure
- **Docker & Docker Compose**: Containerization
- **Zookeeper**: Kafka coordination
- **Mongo Express**: MongoDB admin UI

### Data Sources
- **NYC Open Data (Socrata)**: 
  - Collision data: `h9gi-nx95` (Motor Vehicle Collisions - Crashes dataset)
  - Traffic speeds: `i4gi-tjb9` (Real-Time Traffic Speed Data dataset)
  
  These are Socrata resource identifiers that uniquely identify each dataset on the NYC Open Data portal. You can access them via:
  - Collisions: `https://data.cityofnewyork.us/resource/h9gi-nx95.json`
  - Speeds: `https://data.cityofnewyork.us/resource/i4gi-tjb9.json`

## ✨ Features

### Real-Time Data Pipeline
- Automated data ingestion from NYC Open Data APIs
- Incremental data fetching with watermark tracking
- Kafka-based message streaming
- Persistent storage in MongoDB

### Analytics & Visualizations
- **Real-time metrics**: Average speed, active incidents, congestion hotspots
- **Historical analysis**: Time-series trends and patterns
- **Interactive maps**: Google Maps integration with traffic overlays
- **Charts and graphs**: Traffic trends, collision patterns

### Machine Learning Predictions
- Collision risk prediction based on traffic patterns
- Model inference via Hugging Face Hub
- Real-time prediction API endpoints

### Web Dashboard
- **Home**: Overview and navigation
- **Real-Time**: Live traffic and collision data
- **Historical**: Past trends and analysis
- **Predictions**: ML model forecasts
- **Data Explorer**: Raw data exploration
- **Dark/Light theme**: User preference support

## 📋 Prerequisites

- **Docker** and **Docker Compose** (latest versions)
- **Node.js** 18+ and **npm** (for frontend development)
- **Python 3.9+** (for local development)
- **Socrata API Token** (for NYC Open Data access)
- **Hugging Face Token** (for model access, if using HF Hub)

## 🚀 Setup and Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NYC-Traffic-Collision-Analysis-and-Prediction
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Socrata API Configuration
SOCRATA_APP_TOKEN=your_socrata_token_here
SPEEDS_RESOURCE=i4gi-tjb9

# Kafka Configuration
KAFKA_ADDR=kafka:9092

# MongoDB Configuration
MONGO_URI=mongodb://mongodb:27017/
MONGO_DB=streamingDB

# Model Configuration (if using Hugging Face)
HF_MODEL_REPO=your-username/your-model-repo
HF_TOKEN=your_huggingface_token_here

# Producer Intervals (in seconds)
COLLISION_INTERVAL=30
SPEEDS_INTERVAL=300

# Enable/Disable Scheduler
ENABLE_SCHEDULER=true
```

### 3. Build and Start Services

Start all services using Docker Compose:

```bash
docker-compose up --build
```

This will start:
- Zookeeper (port 2181)
- Kafka (port 9092)
- MongoDB (port 27017)
- Mongo Express (port 8081) - Web UI for MongoDB
- Kafka Visuals (port 8080) - Kafka monitoring UI
- Producer service (port 5001)
- Consumer service
- Flask API server (port 5002)

### 4. Frontend Setup (Optional - for development)

If you want to run the frontend separately for development:

```bash
cd frontend/FlowSight
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default port).

## 🏃 Running the Project

### Full Stack (Recommended)

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```

2. **Check service status**:
   ```bash
   docker-compose ps
   ```

3. **View logs**:
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f producer
   docker-compose logs -f consumer
   docker-compose logs -f spark-flask-app
   ```

4. **Access services**:
   - Frontend: `http://localhost:5173` (if running locally) or configure reverse proxy
   - API Server: `http://localhost:5002`
   - Mongo Express: `http://localhost:8081`
   - Kafka Visuals: `http://localhost:8080`

### Manual Producer Triggers

If `ENABLE_SCHEDULER=false`, you can manually trigger data ingestion:

```bash
# Trigger collision data fetch
curl -X POST http://localhost:5001/publish_collisions

# Trigger traffic speeds fetch
curl -X POST http://localhost:5001/publish_speeds
```

### Stop Services

```bash
docker-compose down

# Remove volumes (clears data)
docker-compose down -v
```

## 🔌 API Endpoints

### Flask API Server (Port 5002)

#### Health & Info
- `GET /` - Server status and info

#### Data Endpoints
- `GET /api/collisions?days=N&limit=M` - Recent collision data
  - Query params: `days` (default: 5), `limit` (default: 2000)
  
- `GET /api/traffic?days=N&limit=M` - Recent traffic speed data
  - Query params: `days` (default: 5), `limit` (default: 2000)

#### Metrics Endpoints
- `GET /api/realtime-traffic-metrics?days=N&limit=M` - Real-time traffic metrics
  - Returns: average speed, active incidents, most congested street, busiest street, avg vehicles per street

- `GET /api/realtime-collision-metrics?days=N` - Real-time collision metrics
  - Returns: collision count, total injuries, most impacted borough

#### Predictions
- `GET /api/predictions?days=N&limit=M` - ML model predictions
  - Query params: `days` (default: 7), `limit` (default: 5000)
  - Returns: traffic data with predicted crash scores

### Producer Service (Port 5001)

- `GET /health` - Health check
- `POST /publish_collisions` - Manually trigger collision data fetch
- `POST /publish_speeds` - Manually trigger traffic speeds fetch

## 📊 Data Pipeline

### Producer Workflow

1. **Collision Data**:
   - Fetches from Socrata API (`h9gi-nx95`)
   - Filters by watermark timestamp (incremental updates)
   - Transforms and publishes to `raw_collisions` Kafka topic
   - Updates watermark file: `last_ingested_collisions.txt`

2. **Traffic Speed Data**:
   - Fetches from Socrata API (`i4gi-tjb9`)
   - Filters by `data_as_of` timestamp
   - Publishes to `traffic_speeds` Kafka topic
   - Updates watermark file: `last_ingested_speeds.txt`

### Consumer Workflow

1. **Collision Consumer**:
   - Consumes from `raw_collisions` topic
   - Stores in MongoDB collection: `collisions_ts`

2. **Speed Consumer**:
   - Consumes from `traffic_speeds` topic
   - Stores in MongoDB collection: `traffic_speeds`

### Data Schema

**Collision Document**:
```json
{
  "collision_id": "string",
  "timestamp": "ISO8601",
  "lat": float,
  "lon": float,
  "borough": "string",
  "injured": int,
  "killed": int,
  "vehicle_types": ["string"]
}
```

**Traffic Speed Document**:
```json
{
  "timestamp": "ISO8601",
  "street": "string",
  "coordinates": "string (space-separated lat,lon pairs)",
  "speed_mph": float
}
```

## 🤖 Model Training

The model training directory contains Jupyter notebooks for:
- **Data preprocessing** and feature engineering
- **Model training** using scikit-learn, PySpark, or Dask
- **Model evaluation** and validation
- **Model export** for inference

### Training Workflow

1. Load historical data from MongoDB
2. Feature engineering:
   - Temporal features (month, day, hour)
   - Geographic features (centroid coordinates)
   - Street encoding
   - Speed normalization
3. Train model (classification/regression)
4. Export model (joblib format)
5. Upload to Hugging Face Hub (optional)

### Inference

The `inference_model.py` module:
- Downloads model from Hugging Face Hub
- Loads recent traffic data from MongoDB
- Applies feature engineering
- Generates crash risk predictions
- Returns predictions via API

## 🎨 Frontend Application

### Pages

- **Home** (`/`): Landing page with overview and navigation
- **Real-Time** (`/realtime`): Live dashboard
  - `/realtime/traffic`: Traffic speed visualizations
  - `/realtime/collision`: Collision data and maps
- **Historical** (`/historical`): Historical trends and analysis
- **Predictions** (`/predictions`): ML predictions
  - `/predictions/home`: Prediction overview
  - `/predictions/traffic`: Traffic predictions
  - `/predictions/collision`: Collision risk predictions
- **Data Explorer** (`/data-explorer`): Raw data exploration
- **About** (`/about`): Project information
- **Login/Signup** (`/login`, `/signup`): User authentication (localStorage-based)

### Components

- **Navbar**: Navigation with theme toggle
- **GoogleMapWithTraffic**: Interactive map with traffic overlays
- **SummaryStats**: Real-time metrics display
- **TrafficTrends**: Chart visualizations
- **ThemeToggle**: Dark/light mode switcher
- **Footer**: Site footer

### API Integration

The frontend connects to the Flask API server at `http://localhost:5002` (configurable via environment variables).

## 🔧 Environment Variables

### Required
- `SOCRATA_APP_TOKEN`: NYC Open Data API token
- `MONGO_URI`: MongoDB connection string
- `MONGO_DB`: Database name

### Optional
- `KAFKA_ADDR`: Kafka broker address (default: `kafka:9092`)
- `SPEEDS_RESOURCE`: Socrata resource ID for speeds (default: `i4gi-tjb9`)
- `COLLISION_INTERVAL`: Collision fetch interval in seconds (default: 30)
- `SPEEDS_INTERVAL`: Speeds fetch interval in seconds (default: 300)
- `ENABLE_SCHEDULER`: Enable automatic scheduling (default: `true`)
- `HF_MODEL_REPO`: Hugging Face model repository
- `HF_TOKEN`: Hugging Face authentication token

## 🐳 Docker Services

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Zookeeper | 2181 | Kafka coordination |
| Kafka | 9092 | Message broker |
| MongoDB | 27017 | Database |
| Mongo Express | 8081 | MongoDB web UI |
| Kafka Visuals | 8080 | Kafka monitoring |
| Producer | 5001 | Data ingestion API |
| Flask API | 5002 | Main API server |

### Volumes

- `mongo_data`: MongoDB persistent storage
- `zookeeper_data`: Zookeeper data

### Health Checks

Monitor service health:
```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs producer
docker-compose logs consumer
docker-compose logs spark-flask-app
```

## 📝 Notes

- The producer uses watermark files to track the last ingested timestamp, enabling incremental updates
- Kafka consumers use `earliest` offset reset to process all historical messages on first run
- The Flask API server includes CORS support for frontend integration
- Model predictions are generated on-demand from recent traffic data
- Frontend uses localStorage for theme preferences and authentication (demo purposes)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Add your license information here]

## 👥 Authors

- Sindhujyoti Dutta (sd6201@nyu.edu)

---

For detailed information about specific components, refer to the README files in respective subdirectories.
