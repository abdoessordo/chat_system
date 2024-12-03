import { useState, useEffect } from "react";
import axios from "axios";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { Conversation } from "../interfaces";
import { routes } from "../routes";
import { fetchMessages } from "../utils";

export default function UserChat() {
  // State to store the conversation UUID, used to fetch messages
  const [conversationUUID, setConversationUUID] = useState<string>("");

  // State to store the conversation object
  const [conversation, setConversation] = useState<Conversation>({
    conversation_uuid: "",
    agent_id: -1,
    messages: [],
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    /**
     * Fetches the conversation data from the server.
     *
     * This function first attempts to retrieve the conversation UUID from local storage.
     * If a UUID is found, it verifies its validity by making a GET request to the server.
     * If the UUID is valid, the conversation data is set in the state.
     *
     * If the UUID is not found or is invalid, a new conversation is created by making a POST request to the server.
     * The new conversation UUID is then stored in local storage and the conversation data is set in the state.
     *
     * @returns {Promise<Conversation | undefined>} The conversation data if successful, otherwise undefined.
     */
    const getConversation = async (): Promise<Conversation | undefined> => {
      // Get convesation UUID from local storage
      let local_storage_conversation_uuid =
        localStorage.getItem("conversation_uuid");

      try {
        // If found, verify if the conversation UUID is valid
        const response = await axios.get(
          routes.conversation.get(local_storage_conversation_uuid!)
        );
        if (response.status === 200) {
          const data = await response.data;
          console.log(data);
          setConversation(data);
          setConversationUUID(data.conversation_uuid);
        }
      } catch (error) {
        localStorage.removeItem("conversation_uuid");

        // At this point, the conversation UUID is invalid, so we need to create a new one
        const response = await axios.post(routes.conversation.create);

        if (response.status === 200) {
          const data: Conversation = await response.data;
          local_storage_conversation_uuid = data.conversation_uuid;
          localStorage.setItem(
            "conversation_uuid",
            local_storage_conversation_uuid
          );
          setConversation(data);

          // Set the conversation UUID state, will be used later to fetch for new messages
          setConversationUUID(data.conversation_uuid);
        }
      }
      return conversation;
    };

    // Load the conversation when the component mounts
    getConversation();

    // Check for new messages every 5 seconds
    const fetchMessagesInterval = setInterval(async () => {
      const newMessagesResponse = await fetchMessages(conversationUUID);
      if (newMessagesResponse) {
        setConversation(newMessagesResponse);
      }
    }, 5000);

    return () => clearInterval(fetchMessagesInterval);
  }, [conversationUUID]);

  /**
   * Handles sending a message in the chat conversation.
   *
   * This function updates the conversation state with the new message and sends
   * a POST request to the backend to save the message. If an error occurs during
   * the request, an alert is shown to the user.
   *
   * @param {string} message - The message content to be sent.
   * @returns {Promise<void>} A promise that resolves when the message has been sent and the state updated.
   */
  const handleSend = async (message: string): Promise<void> => {
    // Create new messages array with the new message
    const newMessages = [
      ...(conversation.messages || []),
      {
        content: message,
        sender: "user",
        timestamp: new Date().toISOString(),
      },
    ];

    // Update the conversation state
    setConversation({
      ...conversation,
      messages: newMessages,
    });

    // Send a post request to the backend to save the message
    try {
      await axios.post(routes.chat.user, {
        conversation_uuid: conversation.conversation_uuid,
        agent_id: conversation.agent_id,
        messages: newMessages,
        created_at: conversation.created_at,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      alert("Cannot two messages back to back. Please wait agent to respond.");
    }
  };
  return (
    <>
      <div className="debug">
        <small>For debuging purposes</small>
        <div style={{ marginLeft: "20px"}}>
          <small>
            Conversation UUID: <b>{conversationUUID} </b>
          </small>
          <small>
            Role: <b>User</b>
          </small>
        </div>
      </div>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {conversation.messages?.length > 0 &&
              conversation.messages.map((msg, index) => (
                <Message
                  key={index}
                  model={{
                    message: msg.content,
                    sentTime: new Date(msg.timestamp).toLocaleTimeString(),
                    sender: msg.sender,
                    direction: msg.sender === "user" ? "outgoing" : "incoming",
                    position: "normal",
                  }}
                />
              ))}
          </MessageList>
          <MessageInput
            placeholder="Type your message..."
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </>
  );
}
