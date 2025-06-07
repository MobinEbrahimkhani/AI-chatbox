# Run the server locally: python -m uvicorn AI-chatbox:app --reload
# Run the server over wifi: python -m uvicorn AI-chatbox:app --host globalIP --port 8000
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from transformers import pipeline
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Load AI pipeline
generator = pipeline("text-generation", model="EleutherAI/gpt-neo-125M", device=-1)

# Static (HTML/CSS/JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("static/index.html", "r") as f:
        return f.read()

@app.post("/generate")
async def generate_text(request: Request):
    data = await request.json()
    user_input = data.get("prompt", "")
    output = generator(user_input, max_length=100, num_return_sequences=1)
    response = output[0]["generated_text"]
    return JSONResponse(content={"response": response.strip()})