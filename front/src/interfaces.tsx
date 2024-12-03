export interface Message {
  content: string;
  sender: string;
  timestamp: string;
}

export interface Conversation {
  conversation_uuid: string;
  agent_id: number;
  messages: Message[];
  created_at: string;
  updated_at: string;
}
