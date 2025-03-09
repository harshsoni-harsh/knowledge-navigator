import os
import dotenv
from groq import Groq

dotenv.load_dotenv('.env')

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# chat_completion = client.chat.completions.create(
#     messages=[
#         {
#             "role": "user",
#             "content": "Explain the importance of fast language models",
#         }
#     ],
#     model="llama-3.3-70b-versatile",
# )

# print(chat_completion.choices[0].message.content)


# Import the Pinecone library
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import time

# Initialize a Pinecone client with your API key
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

# Define a sample dataset where each item has a unique ID, text, and category
data = [
    {
        "id": "rec1",
        "text": "Apples are a great source of dietary fiber, which supports digestion and helps maintain a healthy gut.",
        "category": "digestive system" 
    },
    {
        "id": "rec2",
        "text": "Apples originated in Central Asia and have been cultivated for thousands of years, with over 7,500 varieties available today.",
        "category": "cultivation"
    },
    {
        "id": "rec3",
        "text": "Rich in vitamin C and other antioxidants, apples contribute to immune health and may reduce the risk of chronic diseases.",
        "category": "immune system"
    },
    {
        "id": "rec4",
        "text": "The high fiber content in apples can also help regulate blood sugar levels, making them a favorable snack for people with diabetes.",
        "category": "endocrine system"
    }
]

def generate_embeddings(text: list[str], input_type):
    return pc.inference.embed(
        model="multilingual-e5-large",
        inputs=text,
        parameters={
            "input_type": input_type, 
            "truncate": "END"
        }
    )

# Convert the text into numerical vectors that Pinecone can index
embeddings = generate_embeddings([d["text"] for d in data], "passage")
embeddings_data = embeddings.embeddings_list.data

# generate records
records = [
    {
        "id": f"{i}",
        "values": embeddings_data[i]["values"]
    }
    for i in range(len(embeddings_data))
]

index = pc.Index("kn")

# print(records)
index.upsert(vectors=records)

q = generate_embeddings(["what contains high fiber"], "query").embeddings_list.data[0]["values"]
print(q)
r = index.query(vector=q, top_k=2)

print(r)
