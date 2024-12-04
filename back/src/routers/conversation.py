"""
This file contains the conversation router.

Endpoints:
    - GET /: Returns all conversations.
    - GET /{conversation_uuid}: Returns a conversation by ID.
    - POST /: Creates a new conversation.
    - DELETE /delete/all: Deletes all conversations.
"""

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from models.conversation import Conversation, ALL_CONVERSATIONS
from uuid import UUID, uuid4
from datetime import datetime
from random import randint

router = APIRouter()


@router.get("/", response_model=dict[UUID, Conversation])
async def get_all_conversations() -> dict[UUID, Conversation]:
    """
    Retrieves all conversations.
    Returns:
        ALL_CONVERSATIONS: A dictionary containing all conversations.
    """
    # Order the conversations by last to be updated
    return ALL_CONVERSATIONS


@router.get("/{conversation_uuid}", response_model=Conversation)
async def get_conversation(conversation_uuid: UUID) -> Conversation:
    """
    Retrieve a conversation by its UUID.
    Args:
        conversation_uuid (UUID): The unique identifier of the conversation to retrieve.
    Returns:
        Conversation: The conversation data corresponding to the given UUID.
    Raises:
        HTTPException: If no conversation is found with the given UUID, a 404 error is raised.
    """

    try:
        # Find the conversation with the given ID
        return ALL_CONVERSATIONS[conversation_uuid]
    except KeyError:
        raise HTTPException(status_code=404, detail="Conversation not found")


@router.post("/", response_model=Conversation)
async def create_conversation() -> Conversation:
    """
    Creates a new conversation.
    This function generates a unique conversation UUID, assigns a dummy agent ID,
    and creates a new conversation instance with the current timestamp. The new
    conversation is then added to the global dictionary of all conversations.
    Returns:
        Conversation: The newly created conversation instance.
    """

    # Generate a new conversation_uuid and verify it doesn't exist
    conversation_uuid = uuid4()
    while conversation_uuid in ALL_CONVERSATIONS:
        conversation_uuid = uuid4()

    # Dummy agent id for now
    agent_id = randint(1, 10)

    # Create a new conversation
    conversation = Conversation(
        conversation_uuid=conversation_uuid,
        agent_id=agent_id,
        messages=[],
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    # Add a welcome message from the agent
    conversation.messages.append(conversation.generate_agent_welcome_message())

    # Add the conversation to the list of all conversations
    ALL_CONVERSATIONS[conversation_uuid] = conversation

    return conversation


@router.delete("/delete/all")
async def delete_all_conversations():
    """
    Deletes all conversations.
    This function clears the `ALL_CONVERSATIONS` list, effectively deleting all stored conversations.
    Returns:
        dict: A dictionary containing a message indicating that all conversations have been deleted.
    """

    ALL_CONVERSATIONS.clear()
    return {"message": "All conversations deleted"}
