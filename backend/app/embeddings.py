
from langchain_huggingface import HuggingFaceEmbeddings
from pine_util import get_pinecone_vectorstore
from config import CACHE_DIR, pinecone_api_key, pinecone_environment, neo4j_uri, neo4j_username, neo4j_password, aura_instanceid, aura_instancename

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
