import logging
import json
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.runnables.base import RunnableParallel
from langchain.schema.output_parser import StrOutputParser
from models import llm
from embeddings import vector_store
from utils import tokenize_and_format
import gc, torch

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/retrieve")
async def retrieve_from_path(question: str = Query(...)):
    """Retrieve answers from stored embeddings."""
    async def answer_generator() -> AsyncGenerator[str, None]:
        try:
            logger.info(f"Received question: {question}")

            prompt = ChatPromptTemplate.from_template("""
                <|system|>
                    You are an assistant designed to help with question-answering tasks. Use the following pieces of retrieved context to provide a concise and accurate answer to the question. Keep your response to a maximum of ten sentences.
                    If you don't know the answer, just say "I do not know." Don't make up an answer. Answer without repeating the labels or unnecessary text.
                    Context: {context}
                    <|user|> Question: {question} <|assistant|> Answer:
            """)

            retriever = vector_store.as_retriever(search_kwargs={"k": 3})

            rag_chain = (
                RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
                | prompt
                | llm
                | StrOutputParser()
            )

            result = rag_chain.invoke(question)

            answer_start = result.find("Answer:")
            if answer_start != -1:
                result = result[answer_start + len("Answer:"):].strip()

            tokens = tokenize_and_format(result)

            for token in tokens:
                yield json.dumps({"answer": token}) + "\n"

        except Exception as e:
            logger.error(f"Error in streaming generator: {e}")
            yield json.dumps({"error": str(e)}) + "\n"

    gc.collect()
    torch.cuda.empty_cache()
    return StreamingResponse(answer_generator(), media_type="application/json")
