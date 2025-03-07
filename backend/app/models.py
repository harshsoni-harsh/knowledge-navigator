import torch
import gc
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, GenerationConfig
from config import MODEL_ID, CACHE_DIR
from langchain_huggingface import HuggingFacePipeline

# Cleanup GPU memory
gc.collect()
torch.cuda.empty_cache()

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID, 
    cache_dir=CACHE_DIR, 
    device_map="auto",
    trust_remote_code=True,
)

tokenizer.pad_token = tokenizer.eos_token

# Define generation configuration
generation_config = GenerationConfig(
    max_new_tokens=1000,
    do_sample=False,
    num_beams=1,
    repetition_penalty=1.2,
    bos_token_id=tokenizer.bos_token_id,
    eos_token_id=tokenizer.eos_token_id,
    pad_token_id=tokenizer.eos_token_id
)

# Set up text generation pipeline
pipe = pipeline(
    model=model,
    tokenizer=tokenizer,
    task="text-generation",
    generation_config=generation_config
)

hf_pipe = HuggingFacePipeline(pipeline=pipe, model_kwargs={"generation_config": generation_config})