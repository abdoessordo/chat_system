from pydantic import BaseModel
from .message import Message
from datetime import datetime
from uuid import UUID

class Conversation(BaseModel):
    conversation_uuid: UUID
    agent_id: int
    messages: list[Message]
    created_at: datetime
    updated_at: datetime

ALL_CONVERSATIONS: dict[UUID, Conversation] = {}

