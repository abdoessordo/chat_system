// const host = "http://127.0.0.1:8000";
const host = `http://${window.location.hostname}:8000`;
const prefix = "/api/v1";

export const routes = {
  conversation: {
    create: `${host}${prefix}/conversation`,
    get: (conversationId: string) =>
      `${host}${prefix}/conversation/${conversationId}`,
    getAll: () => `${host}${prefix}/conversation`,
  },
  message: {
    create: `${host}${prefix}/message`,
  },
  chat: {
    user: `${host}${prefix}/chat/user`,
    agent: (conversationUUID: string) =>
      `${host}${prefix}/chat/agent?conversation_uuid=${conversationUUID}`,
  },
};
