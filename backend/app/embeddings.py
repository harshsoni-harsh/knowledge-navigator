
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from pine_util import get_pinecone_vectorstore
from config import CACHE_DIR, pinecone_api_key, pinecone_environment

INDEX_NAME = "knowledge-navigator"

# Load embedding model
embeder = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en", cache_folder=CACHE_DIR)

pinecone_vector_store = get_pinecone_vectorstore(
    pinecone_api_key=pinecone_api_key,
    pinecone_environment=pinecone_environment,
    index_name=INDEX_NAME,
    embedding_model=embeder
)

async def generate_embeddings(chunks):
    await pinecone_vector_store.aadd_documents(chunks)

# vector_store = Chroma(
#     embedding_function=embeder,
#     persist_directory="./chroma_langchain_db",
#     collection_name="test_collection"
# )

# async def generate_embeddings(chunks):
#     """Generate embeddings and store them in a ChromaDB vectorstore."""
#     await vector_store.aadd_documents(chunks)
