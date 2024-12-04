'''
This file contains utility functions that are used in the backend.

Functions:
    - generate_agent_reply: Generate an agent reply for a user message
    - validate_conversation: Validate a conversation object
'''

from models.conversation import Conversation


def validate_conversation(conversation: Conversation) -> bool:
    """
    A valid conversation should y is required to be a series of alternate "user" and "agent" messages. If
    that is not the case - for example, two consecutive "user" messages - the history
    should be considered invalid.

    Args:
        - conversation: The conversation object to validate

    Returns:
        - valid: True if the conversation is valid, False otherwise
    """

    valid = True

    # Check if the conversation is empty
    if not conversation.messages:
        return valid

    # Check if the conversation has alternating "user" and "agent" messages
    if len(conversation.messages) > 1 and conversation.messages[-1].sender == conversation.messages[-2].sender:
        valid = False

    return valid
