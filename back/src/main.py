from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, conversation

app = FastAPI()

origins = [
    "localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
API routes:
    - /api/v1/chat: Handles user messages and agent replies.
    - /api/v1/conversation: Handles conversation creation and retrieval.
"""
app.include_router(chat.router, prefix="/api/v1/chat")
app.include_router(conversation.router, prefix="/api/v1/conversation")

@app.get("/")
def root():
    return {"message": "Chat API is running"}