FROM python:3.10-slim

WORKDIR /app

COPY app.py .
COPY requirements.txt .

RUN pip install flask confluent-kafka requests

EXPOSE 5000

CMD ["python", "app.py"]
