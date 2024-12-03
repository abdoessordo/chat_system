import axios from "axios";
import { routes } from "./routes";

/**
 * Fetches messages for a given conversation.
 *
 * @param {string} conversation_id - The ID of the conversation to fetch messages for.
 * @returns {Promise<any>} A promise that resolves to the messages data if the request is successful.
 */
export const fetchMessages = async (conversation_id: string): Promise<any> => {
  if (!conversation_id) {
    return;
  }

  const response = await axios.get(routes.conversation.get(conversation_id));
  if (response.status === 200) {
    return await response.data;
  }
};
