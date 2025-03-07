from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from config import CACHE_DIR

# Load embedding model
embeder = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en", cache_folder=CACHE_DIR)

vector_store = Chroma(
    embedding_function=embeder,
    persist_directory="./chroma_langchain_db",
    collection_name="test_collection"
)

async def generate_embeddings(chunks):
    """Generate embeddings and store them in a ChromaDB vectorstore."""
    await vector_store.aadd_documents(chunks)
