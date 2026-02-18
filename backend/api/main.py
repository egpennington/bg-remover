from fastapi import FastAPI, UploadFile, File
# force rembg's model cache into /tmp which is writable on Render
import os
os.environ["U2NET_HOME"] = "/tmp/.u2net"
from rembg import remove
from PIL import Image
import io
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# End Points
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/message")
def message():
    return{"status": "Rock on!"}

@app.get("/songs")
def songs():
    return {
        "songs": [
            {"artist": "BTS", "title": "Spring Day"},
            {"artist": "BLACKPINK", "title": "How You Like That"},
            {"artist": "IU", "title": "Palette"},
            {"artist": "NewJeans", "title": "Hype Boy"},
            {"artist": "EXO", "title": "Love Shot"},
            {"artist": "TWICE", "title": "Feel Special"},
            {"artist": "Stray Kids", "title": "God's Menu"},
            {"artist": "SEVENTEEN", "title": "Super"},
            {"artist": "IVE", "title": "Love Dive"},
            {"artist": "LE SSERAFIM", "title": "Antifragile"}
        ]
    }

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    image_bytes = await file.read()
    output_bytes = remove(image_bytes)  # returns PNG bytes
    return Response(content=output_bytes, media_type="image/png")

    output = remove(image)

    buffer = io.BytesIO()
    output.save(buffer, format="PNG")
    buffer.seek(0)

    return buffer.getvalue()