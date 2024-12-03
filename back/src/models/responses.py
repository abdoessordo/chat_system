from pydantic import BaseModel
from .conversation import Conversation

class AgentResponse(BaseModel):
    reply: str

class UserMessage(BaseModel):
    conversation: Conversation
