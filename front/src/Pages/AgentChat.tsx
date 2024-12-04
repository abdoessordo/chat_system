import { useParams } from "react-router-dom";
import ChatComponent from "../components/ChatComponent";

export default function AgentChat() {
  // Get convesation UUID from url
  const { conversationUUID } = useParams<{ conversationUUID: string }>();

  return <ChatComponent isAgent={true} conversationUUID_input={conversationUUID!} />;
}
