from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

from routers import chat, conversation

import socket

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)

origins = [
    "localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Local ip address
    "http://" + socket.gethostbyname(socket.gethostname()) + ":5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("=================================")
print("Allowed origins: ")
for origin in origins:
    print(origin)
print("=================================")


"""
API routes:
    - /api/v1/chat: Handles user messages and agent replies.
    - /api/v1/conversation: Handles conversation creation and retrieval.
"""
app.include_router(chat.router, prefix="/api/v1/chat")
app.include_router(conversation.router, prefix="/api/v1/conversation")


@app.get("/")
# @limiter.limit("1/second")
def root(request: Request):
    return {"message": "Chat API is running"}
