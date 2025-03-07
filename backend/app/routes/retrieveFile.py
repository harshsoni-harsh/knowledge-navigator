import logging
import os
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from config import UPLOAD_DIRECTORY

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/retrieve-file")
async def retrieve_from_path(filename: str = Query(...)):
    """Retrieve file from storage"""
    logger.info(f"Retrieving file {filename}")
    file_location = os.path.join(UPLOAD_DIRECTORY, filename)
    
    if not os.path.exists(file_location):
        logger.error(f"File not found: {filename}")
        raise HTTPException(status_code=404, detail="File not found")

    if os.path.getsize(file_location) == 0:
        logger.error(f"File {filename} is empty!")
        raise HTTPException(status_code=400, detail="File is empty")

    def file_reader():
        with open(file_location, "rb") as f:
            yield from f 

    try:
        response = StreamingResponse(file_reader(), media_type="application/octet-stream")
        return response

    except Exception as e:
        logger.error(f"Error reading file: {e}")
        raise HTTPException(status_code=500, detail="Error reading file")
