import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIRECTORY = os.path.join(BASE_DIR, "data/rag-uploads")
MODEL_DIRECTORY = os.path.join(BASE_DIR, "data/models")
TOKENIZER_DIRECTORY = os.path.join(BASE_DIR, "data/tokenizers")
CACHE_DIR = os.path.join(BASE_DIR, "cache")

# Model Config
MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

# Ensure directories exist
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
os.makedirs(MODEL_DIRECTORY, exist_ok=True)
os.makedirs(TOKENIZER_DIRECTORY, exist_ok=True)
