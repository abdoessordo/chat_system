from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal


class Message(BaseModel):
    sender: Literal["user", "agent"]  # Only "user" or "agent" allowed
    # Validate that the message content is between 1 and 200 characters
    content: str = Field(..., min_length=1, max_length=200)
    timestamp: datetime
