FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    build-essential \
    libffi-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


RUN pip install -r requirements.txt

CMD ["python", "run.py"]
