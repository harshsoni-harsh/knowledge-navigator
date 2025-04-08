# For testing purposes only

from logging import getLogger
from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
from crewai.tools import tool
from embeddings import pinecone_vector_store
from utils import get_tavily_client
from ..config import GROQ_API_KEY, GROQ_MODEL
from pydantic import BaseModel

logger = getLogger(__name__)

class RetrieveInput(BaseModel):
    query: str

@tool
def retrieve_from_vectorstore(query: str) -> list:
    """Retrieves top 3 relevant documents from the internal knowledge base."""
    logger.info(f"Vectorstore search for: {query}")
    return pinecone_vector_store.similarity_search(query, k=3)

@tool
def search_web(query: str) -> str:
    """Performs a real-time web search using the Tavily client."""
    try:
        result = get_tavily_client(query)
        return result.get("answer", "No answer found.")
    except Exception as e:
        logger.error(f"Web search failed: {e}")
        return "Error during web search."

tools = [retrieve_from_vectorstore, search_web]


# Define Agents
retriever_agent = Agent(
    role="Retriever",
    goal="Get knowledge base insights",
    llm=ChatGroq(model_name=GROQ_MODEL, api_key=GROQ_API_KEY, provider="groq"),
    tools=[retrieve_from_vectorstore],
    memory=False,
    verbose=True,
    backstory="Knows everything about the internal knowledge base."
)

websearch_agent = Agent(
    role="Searcher",
    goal="Find real-time info from the web",
    tools=[search_web],
    llm=ChatGroq(model_name=GROQ_MODEL, api_key=GROQ_API_KEY, provider="groq"),
    memory=False,
    verbose=True,
    backstory="Keeps up with the most recent data available online."
)

writer_agent = Agent(
    role="Synthesizer",
    goal="Create insightful and accurate answers",
    tools=[],
    llm=ChatGroq(model_name=GROQ_MODEL, api_key=GROQ_API_KEY, provider="groq"),
    memory=False,
    verbose=True,
    backstory="Combines insights to answer clearly."
)

# Define Tasks
crew = Crew(
    agents=[retriever_agent, websearch_agent, writer_agent],
    tasks=[
        Task(
            description="Fetch relevant internal documents about {question}",
            agent=retriever_agent,
            expected_output="""
            A list of the top 3 most relevant internal documents related to the question.
            Format:
            [
              {
                "title": "Document Title",
                "content": "Summary or excerpt of the document",
                "source": "Knowledge base location or URL"
              },
              ...
            ]
            """
        ),
        Task(
            description="Search the internet for recent updates on {question}",
            agent=websearch_agent,
            expected_output="""
            A concise summary of recent and relevant information found online.
            Format:
            {
              "summary": "Brief summary of online findings",
              "sources": [
                {"title": "Source Title", "url": "https://example.com"},
                ...
              ]
            }
            """
        ),
        Task(
            description="Write a final answer using retrieved and searched context",
            agent=writer_agent,
            expected_output="""
            A well-structured final answer that combines internal and online data to respond to the question.
            Format:
            {
              "answer": "Full synthesized response",
              "used_sources": ["Internal Document Titles or IDs", "Web Source Titles or URLs"]
            }
            """
        ),
    ],
    process=Process.sequential
)

