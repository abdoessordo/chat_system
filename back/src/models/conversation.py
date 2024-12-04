from pydantic import BaseModel
from .message import Message
from datetime import datetime
from uuid import UUID
from random import choice


class Conversation(BaseModel):
    conversation_uuid: UUID
    agent_id: int
    messages: list[Message]
    created_at: datetime
    updated_at: datetime

    def generate_agent_welcome_message(self) -> Message:
        """
        Generates a welcome message from the agent.
        Returns:
            Message: An instance of the Message class containing the agent's welcome message, 
                    the sender set to "agent", the content randomly chosen from a list of 
                    predefined welcome messages, and the current timestamp.
        """

        welcome_messages = [
            "Hello! How can I help you today?",
            "Hi! How can I assist you today?",
            "Hey! How can I help you today?",
        ]

        return Message(
            sender="agent",
            content=choice(welcome_messages),
            timestamp=datetime.now(),
        )


ALL_CONVERSATIONS: dict[UUID, Conversation] = {}
