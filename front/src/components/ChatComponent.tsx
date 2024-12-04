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
import { fetchMessages } from "../utils";
import { routes } from "../routes";
import { Link } from "react-router-dom";

interface ChatComponentProps {
  isAgent: boolean;
  conversationUUID_input: string;
}

export default function ChatComponent({
  isAgent,
  conversationUUID_input,
}: ChatComponentProps) {

  // State to store the conversation object
  const [conversation, setConversation] = useState<Conversation>({
    conversation_uuid: "",
    agent_id: -1,
    messages: [],
    created_at: "",
    updated_at: "",
  });

  // Inintialize the conversation UUID state with the input value
  const [conversationUUID, setConversationUUID] = useState<string>(
    conversationUUID_input
  );

  // Maximum number of characters allowed in a message
  const MAX_CHARACTERS = 200;

  useEffect(() => {
    /**
     * Fetches a conversation by its UUID. If the UUID is invalid, a new conversation is created.
     * 
     * @param {string} conversationUUID - The UUID of the conversation to fetch.
     * @returns {Promise<Conversation | undefined>} - A promise that resolves to the fetched or newly created conversation.
     * 
     * @throws Will remove the invalid conversation UUID from local storage and create a new conversation if the UUID is invalid.
     */
    const getConversation = async (
      conversationUUID: string
    ): Promise<Conversation | undefined> => {
      try {
        // If conversation UUDI, verify if is valid
        const response = await axios.get(
          routes.conversation.get(conversationUUID!)
        );
        if (response.status === 200) {
          const data = await response.data;
          console.log(data);
          setConversation(data);
        }
      } catch (error) {
        localStorage.removeItem("conversation_uuid");

        // At this point, the conversation UUID is invalid, so we need to create a new one
        const response = await axios.post(routes.conversation.create);

        if (response.status === 200) {
          const data: Conversation = await response.data;
          const local_storage_conversation_uuid = data.conversation_uuid;
          localStorage.setItem(
            "conversation_uuid",
            local_storage_conversation_uuid
          );
          setConversation(data);
          setConversationUUID(data.conversation_uuid);
        }
      }
      return conversation;
    };

    // Load the conversation when the component mounts
    getConversation(conversationUUID_input);

    // Check for new messages every 5 seconds
    const fetchMessagesInterval = setInterval(async () => {
      const newMessagesResponse = await fetchMessages(conversationUUID_input);
      if (newMessagesResponse) {
        setConversation(newMessagesResponse);
      }
    }, 5000);

    return () => clearInterval(fetchMessagesInterval);
  }, [conversationUUID_input]);

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
        sender: isAgent ? "agent" : "user",
        timestamp: new Date().toISOString(),
      },
    ];

    // Update the conversation state
    setConversation({
      ...conversation,
      messages: newMessages,
    });

    // Build body for the post request
    const body = isAgent
      ? {
          sender: "agent",
          content: message,
          timestamp: new Date().toISOString(),
        }
      : {
          conversation_uuid: conversation.conversation_uuid,
          agent_id: conversation.agent_id,
          messages: newMessages,
          created_at: conversation.created_at,
          updated_at: new Date().toISOString(),
        };

    // Send a post request to the backend to save the message
    try {
      await axios.post(
        isAgent ? routes.chat.agent(conversationUUID_input!) : routes.chat.user,
        body
      );
    } catch (error) {
      alert("Cannot two messages back to back. Please wait for a response.");
    }
  };
  return (
    <>
      <div className="debug">
        <small>For debuging purposes</small>
        <div style={{ marginLeft: "20px" }}>
          <small>
            Conversation UUID: <b>{conversationUUID} </b>
          </small>
          <small>
            Role: <b>{isAgent ? "Agent" : "User"}</b>
          </small>
        </div>

        {/* Back Arrow */}
        {isAgent && (
          <div>
            <Link to={`/agent`}>{"<- Back"}</Link>
          </div>
        )}
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
                    direction:
                      msg.sender === (isAgent ? "agent" : "user")
                        ? "outgoing"
                        : "incoming",
                    position: "normal",
                  }}
                />
              ))}
          </MessageList>
          <MessageInput
            placeholder={`Type your message (max ${MAX_CHARACTERS} characters)...`}
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </>
  );
}
