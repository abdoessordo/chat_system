"""
This file contains the chat router, which handles user messages and agent replies.

Endpoints:
    - POST /user: Handles a user message in a conversation.
    - POST /agent: Handles the agent's reply to a conversation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from models.message import Message
from models.conversation import Conversation, ALL_CONVERSATIONS
from models.responses import AgentResponse
from utils import validate_conversation

from uuid import UUID


router = APIRouter()  


@router.post("/user", response_model=Conversation)
async def user_message(conversation: Conversation):
    """
    Handles a user message in a conversation.
    This endpoint receives a conversation object with a user message and returns the updated conversation with the agent reply.
    This endpoint handle both new and existing conversations. If the conversation is new, it will be created and returned with the agent reply.
    A conversation is considered new if it doesn't have an ID.

    Args:
        conversation (Conversation): The conversation object containing the message.
    Returns:
        Conversation: The updated conversation object.
    Raises:
        HTTPException: If the conversation is not valid.
    """

    # Check if the conversation is valid
    is_valid_conversation = validate_conversation(conversation)
    print("is_valid_conversation", is_valid_conversation)

    # If the conversation is not valid, return an error and the conversation object from the ALL_CONVERSATIONS dictionary
    if not is_valid_conversation:
        raise HTTPException(status_code=400, detail="Cannot send two messages back to back. Please wait for a response.")

    # At this point, the conversation is valid, and is not new (it has at least one message)
    # We update the ALL_CONVERSATIONS dictionary with the new message
    ALL_CONVERSATIONS[conversation.conversation_uuid] = conversation

    return conversation


@router.post("/agent", response_model=AgentResponse)
async def agent_reply(message: Message, conversation_uuid: UUID):
    """
    Handle the agent's reply to a conversation.
    Args:
        message (Message): The message object containing the agent's reply.
        conversation_uuid (UUID): The unique identifier of the conversation.
    Raises:
        HTTPException: If the message sender is not "agent".
        HTTPException: If the conversation does not exist.
        HTTPException: If the conversation is not valid after adding the agent's reply.
    Returns:
        dict: A dictionary containing the reply message content.
    """

    # Check if the message sender is "agent"
    if message.sender != "agent":
        raise HTTPException(status_code=400, detail="Invalid sender")

    # Check if the conversation exists
    if conversation_uuid not in ALL_CONVERSATIONS:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Get the conversation from the ALL_CONVERSATIONS dictionary
    conversation = ALL_CONVERSATIONS[conversation_uuid]

    # Add the agent reply to the conversation
    conversation.messages.append(message)

    print("conversation.messages", conversation.messages)

    # Check if the conversation is valid
    is_valid_conversation = validate_conversation(conversation)

    print("is_valid_conversation", is_valid_conversation)

    # If the conversation is not valid, return an error and the conversation object from the ALL_CONVERSATIONS dictionary
    if not is_valid_conversation:
        # Remove the last message from the conversation
        conversation.messages.pop()
        raise HTTPException(status_code=400, detail="Cannot send two messages back to back. Please wait for a response.")

    return {"reply": message.content}
