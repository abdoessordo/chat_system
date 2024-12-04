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

    def add_message(self, sender: str, content: str, timestamp: datetime) -> None:
        """
        Add a new message to the conversation.
        Args:
            - sender (str): The sender of the message, either "user" or "agent".
            - content (str): The content of the message.
            - timestamp (datetime): The timestamp of the message.
        """
        message = Message(sender=sender, content=content, timestamp=timestamp)
        self.messages.append(message)
        self.updated_at = timestamp

ALL_CONVERSATIONS: dict[UUID, Conversation] = {}

