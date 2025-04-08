import logging
import json
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
from ..prompt_templates import (
    general_prompt,
    suggested_readings_prompt,
    flashcard_prompt,
)
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain_core.runnables.base import RunnableParallel
from langchain.schema.output_parser import StrOutputParser
from models import llm
from embeddings import pinecone_vector_store
from utils import tokenize_and_format, get_tavily_client
import gc, torch

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/retrieve")
async def retrieve_from_path(
    question: str = Query(...),
    prompt_type: str = Query(
        "general", enum=["general", "suggested_readings", "flashcard_prompt"]
    ),
):
    """Retrieve answers from stored embeddings."""

    prompt_map = {
        "general": general_prompt,
        "suggested_readings": suggested_readings_prompt,
        "flashcard_prompt": flashcard_prompt,
    }
    selected_prompt = prompt_map.get(prompt_type, general_prompt)

    async def answer_generator() -> AsyncGenerator[str, None]:
        try:
            logger.info(f"Received question: {question}")

            tavily_lambda = RunnableLambda(lambda q: get_tavily_client(q)['answer'])

            retriever = pinecone_vector_store.as_retriever(search_kwargs={"k": 5})

            parallel_outputs = RunnableParallel({
                "tavily_response": tavily_lambda,
                "pinecone_context": retriever,
                "question": RunnablePassthrough()
            }).invoke(question)

            tavily_response = parallel_outputs.get("tavily_response", "")
            pinecone_context_list = parallel_outputs.get("pinecone_context", [])
            pinecone_context = "\n\n".join([doc.page_content if hasattr(doc, "page_content") else str(doc) for doc in pinecone_context_list])

            if not pinecone_context.strip():
                merged_context = tavily_response
            elif not tavily_response.strip():
                merged_context = pinecone_context
            else:
                # Combine both, but clearly separate them.
                merged_context = f"{pinecone_context}\n\nTavily: {tavily_response}"
            
            chain_input = {
                "question": question,
                "context": merged_context,
                "tavily_response": tavily_response  # Provided in case the prompt needs it separately.
            }

            rag_chain = selected_prompt | llm | StrOutputParser()

            final_response = rag_chain.invoke(chain_input)

            tokens = tokenize_and_format(final_response)
            for token in tokens:
                yield json.dumps({"answer": token}) + "\n"

        except Exception as e:
            logger.error(f"Error in streaming generator: {e}")
            yield json.dumps({"error": "Error generating response"}) + "\n"

    gc.collect()
    torch.cuda.empty_cache()
    return StreamingResponse(answer_generator(), media_type="application/json")
