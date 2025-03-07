import os
import logging
from fastapi import APIRouter, UploadFile, File
from config import UPLOAD_DIRECTORY
from utils import extract_text_from_pdf
from embeddings import generate_embeddings
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handle file uploads and generate embeddings."""
    logger.info(f"Uploading file {file.filename}")
    file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
    
    try:
        with open(file_location, "wb") as f:
            while chunk := file.file.read(4096):
                f.write(chunk)
        logger.info("File stored successfully!")
    except Exception as e:
        logger.error(f"Error writing file: {e}")
        return {"error": "File upload failed"}

    # Process the PDF
    try:
        text = extract_text_from_pdf(file_location)
        documents = [Document(page_content=text)]
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=100)
        chunks = text_splitter.split_documents(documents)

        await generate_embeddings(chunks)
        logger.info("Embeddings generated successfully!")
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        return {"error": "Embedding generation failed"}

    return {"filePath": file_location}
