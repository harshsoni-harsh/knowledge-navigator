import pdfplumber
import logging
import os
from dotenv import load_dotenv
from tavily import TavilyClient

logger = logging.getLogger(__name__)

def tokenize_and_format(text):
    tokens = text.replace('\n\n', '<br/><br/>').replace('\n', '<br/>').replace(' ', '&nbsp;').split()    
    return tokens

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def get_tavily_client(question):
    load_dotenv()
    tavily_api_key = os.environ.get("TAVILY_API_KEY")

    tavily_client = TavilyClient(api_key=tavily_api_key)
    response = tavily_client.search(query=question,include_answer=True)

    return response
