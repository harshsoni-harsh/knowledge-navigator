from fastapi import APIRouter
from .upload import router as upload_router
from .retrieval import router as retrieval_router
from .retrieveFile import router as file_retrieval_router

router = APIRouter()

router.include_router(upload_router, tags=["Upload"])
router.include_router(retrieval_router, tags=["Retrieval"])
router.include_router(file_retrieval_router, tags=["File Retrieval"])