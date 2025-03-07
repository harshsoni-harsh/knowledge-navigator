import uvicorn
import os, sys

sys.path.insert(0, os.path.join(os.path.abspath(os.path.dirname(__file__)), 'app'))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)