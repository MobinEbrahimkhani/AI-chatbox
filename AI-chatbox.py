# Run the server locally: python -m uvicorn AI-chatbox:app --reload
# Run the server over wifi: python -m uvicorn AI-chatbox:app --host globalIP --port 8000
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai


API_KEY = "AIzaSyCh_LLvoYomDMNG2SkX4V_J8_luUJs9NAY"
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat()


app = FastAPI()


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
    output = chat.send_message(user_input)
    # response = output[0]["generated_text"]
    response = output.text
    response = response.replace('*','')
    return JSONResponse(content={"response": response.strip()})