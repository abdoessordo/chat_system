import ChatComponent from "../components/ChatComponent";

export default function UserChat() {
  return <ChatComponent isAgent={false} conversationUUID_input={localStorage.getItem("conversation_uuid")!} />;
}
