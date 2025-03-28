from pinecone import Pinecone, ServerlessSpec

from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

def initialize_pinecone(pinecone_api_key, pinecone_environment, index_name,embedding_model):
    """Initializes Pinecone."""
    # pinecone.init(api_key=pinecone_api_key, environment=pinecone_environment)
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




# from pinecone import Pinecone, ServerlessSpec
# from config import pinecone_api_key
# import time


# pc=Pinecone(api_key=pinecone_api_key)

# index_name = "quickstart"

# pc.create_index(
#     name=index_name,
#     dimension=1024, # Replace with your model dimensions
#     metric="cosine", # Replace with your model metric
#     spec=ServerlessSpec(
#         cloud="aws",
#         region="us-east-1"
#     ) 
# )

# data = [
#     {"id": "vec1", "text": "Apple is a popular fruit known for its sweetness and crisp texture."},
#     {"id": "vec2", "text": "The tech company Apple is known for its innovative products like the iPhone."},
#     {"id": "vec3", "text": "Many people enjoy eating apples as a healthy snack."},
#     {"id": "vec4", "text": "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces."},
#     {"id": "vec5", "text": "An apple a day keeps the doctor away, as the saying goes."},
#     {"id": "vec6", "text": "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership."}
# ]

# embeddings = pc.inference.embed(
#     model="multilingual-e5-large",
#     inputs=[d['text'] for d in data],
#     parameters={"input_type": "passage", "truncate": "END"}
# )
# print(embeddings[0])

# # Wait for the index to be ready
# while not pc.describe_index(index_name).status['ready']:
#     time.sleep(1)

# index = pc.Index(index_name)

# vectors = []
# for d, e in zip(data, embeddings):
#     vectors.append({
#         "id": d['id'],
#         "values": e['values'],
#         "metadata": {'text': d['text']}
#     })

# index.upsert(
#     vectors=vectors,
#     namespace="ns1"
# )

# print(index.describe_index_stats())


