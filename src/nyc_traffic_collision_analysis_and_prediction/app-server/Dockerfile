FROM python:3.9-slim

# Install Java, bash (needed for Spark), and procps (for ps command)
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk-headless bash procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV JAVA_HOME=/usr
ENV PATH="$JAVA_HOME/bin:$PATH"
ENV PYSPARK_PYTHON=python3

WORKDIR /app

# Install Python dependencies
COPY jars/* /app/jars/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code
COPY . .

EXPOSE 5002
CMD ["python", "app-server.py"]
