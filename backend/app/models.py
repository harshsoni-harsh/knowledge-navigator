import torch, gc, os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()
gc.collect()
torch.cuda.empty_cache()

groq_api_key = os.environ.get("GROQ_API_KEY")
groq_model_name = os.environ.get("GROQ_MODEL_NAME")
llm = ChatGroq(
    groq_api_key=groq_api_key,
    model_name=groq_model_name
)