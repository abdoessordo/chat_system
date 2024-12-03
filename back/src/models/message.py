from pydantic import BaseModel
from datetime import datetime

class Message(BaseModel):
    sender: str  # "user" or "agent"
    content: str
    timestamp: datetime