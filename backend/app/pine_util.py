from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

def initialize_pinecone(pinecone_api_key, pinecone_environment, index_name,embedding_model):
    """Initializes Pinecone."""
    pc=Pinecone(api_key=pinecone_api_key)
    
    if index_name not in pc.list_indexes().names():
        pc.create_index(
        name=index_name,
        dimension=embedding_model._client.get_sentence_embedding_dimension(),
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region=pinecone_environment
        )
    )
    index=pc.Index(index_name)
    return index

def get_pinecone_vectorstore(pinecone_api_key, pinecone_environment, index_name,embedding_model):
    """Returns a Pinecone vector store."""
    
    index = initialize_pinecone(pinecone_api_key, pinecone_environment, index_name,embedding_model)
    vector_store = PineconeVectorStore(index, embedding_model, text_key="text")
    return vector_store
