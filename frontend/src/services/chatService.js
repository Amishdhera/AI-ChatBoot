import api from "./api";
import { auth } from "../firebase/config";

export async function fetchConversations() {
  const { data } = await api.get("/conversations");
  return data.conversations;
}

export async function fetchConversation(id) {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
}

export async function createConversation(title = "New chat") {
  const { data } = await api.post("/conversations", { title });
  return data.conversation;
}

export async function renameConversation(id, title) {
  const { data } = await api.put(`/conversations/${id}`, { title });
  return data.conversation;
}

export async function deleteConversation(id) {
  await api.delete(`/conversations/${id}`);
}

export async function deleteMessage(conversationId, messageId) {
  await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
}

export async function sendMessage(conversationId, message) {
  const { data } = await api.post("/chat", { conversationId, message });
  return data.message;
}

export async function regenerateResponse(conversationId) {
  const { data } = await api.post("/chat/regenerate", { conversationId });
  return data.message;
}

/**
 * Streams a chat response via Server-Sent Events.
 * onToken(delta) fires per chunk, onDone(fullMessage) fires at the end.
 * Returns an object with an abort() method to stop generation early.
 */
export function streamMessage(conversationId, message, { onToken, onDone, onError }) {
  const controller = new AbortController();

  (async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${baseURL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId, message }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to reach the AI service.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const raw of events) {
          const lines = raw.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event:"));
          const dataLine = lines.find((l) => l.startsWith("data:"));
          if (!eventLine || !dataLine) continue;
          const eventName = eventLine.replace("event:", "").trim();
          const payload = JSON.parse(dataLine.replace("data:", "").trim());

          if (eventName === "token") onToken?.(payload.delta);
          if (eventName === "done") onDone?.(payload);
          if (eventName === "error") onError?.(new Error(payload.error));
          if (eventName === "aborted") onDone?.({ aborted: true });
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") onError?.(err);
    }
  })();

  return { abort: () => controller.abort() };
}
