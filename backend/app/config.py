import os
from dotenv import load_dotenv

load_dotenv()

tavily_api_key = os.environ.get("TAVILY_API_KEY")
pinecone_api_key = os.environ.get("PINECONE_API_KEY")
pinecone_environment = os.environ.get("PINECONE_ENVIRONMENT")
neo4j_uri = os.environ.get("NEO4J_URI")
neo4j_username = os.environ.get("NEO4J_USERNAME")
neo4j_password = os.environ.get("NEO4J_PASSWORD")
aura_instanceid = os.environ.get("AURA_INSTANCEID")
aura_instancename = os.environ.get("AURA_INSTANCENAME")

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
