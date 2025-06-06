# Run the server locally: uvicorn FastAPI_project:app --reload
# Run the server over wifi: uvicorn FastAPI_project:app --host 172.31.4.24 --port 8000
# ip: 172.31.4.24
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from transformers import pipeline
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Load GPT2 pipeline
generator = pipeline("text-generation", model="gpt2", device=-1)

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