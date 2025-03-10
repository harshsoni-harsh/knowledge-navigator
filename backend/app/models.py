import torch, gc, os
from transformers import AutoTokenizer
from config import MODEL_ID
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

# Cleanup GPU memory
gc.collect()
torch.cuda.empty_cache()

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

groq_api_key = os.environ.get("GROQ_API_KEY")
llm = ChatGroq(
    groq_api_key=groq_api_key,
    model_name='mixtral-8x7b-32768'
)