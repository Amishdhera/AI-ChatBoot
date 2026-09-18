import { createContext, useContext, useCallback, useState } from "react";
import toast from "react-hot-toast";
import * as chatService from "../services/chatService";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamController, setStreamController] = useState(null);

  const loadConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const list = await chatService.fetchConversations();
      setConversations(list);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  const openConversation = useCallback(async (id) => {
    setActiveId(id);
    setMessagesLoading(true);
    setMessages([]);
    try {
      const data = await chatService.fetchConversation(id);
      setMessages(data.messages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const startNewChat = useCallback(async () => {
    try {
      const conversation = await chatService.createConversation("New chat");
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(conversation.id);
      setMessages([]);
      return conversation;
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  }, []);

  const rename = useCallback(async (id, title) => {
    try {
      await chatService.renameConversation(id, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const remove = useCallback(
    async (id) => {
      try {
        await chatService.deleteConversation(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeId === id) {
          setActiveId(null);
          setMessages([]);
        }
        toast.success("Conversation deleted");
      } catch (err) {
        toast.error(err.message);
      }
    },
    [activeId]
  );

  const deleteMessageById = useCallback(
    async (messageId) => {
      if (!activeId) return;
      try {
        await chatService.deleteMessage(activeId, messageId);
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } catch (err) {
        toast.error(err.message);
      }
    },
    [activeId]
  );

  const touchConversationOrder = useCallback((id) => {
    setConversations((prev) => {
      const found = prev.find((c) => c.id === id);
      if (!found) return prev;
      return [found, ...prev.filter((c) => c.id !== id)];
    });
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      let conversationId = activeId;
      if (!conversationId) {
        const conv = await startNewChat();
        if (!conv) return;
        conversationId = conv.id;
      }

      const tempUserMsg = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };
      const tempAssistantMsg = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        streaming: true,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempUserMsg, tempAssistantMsg]);
      setIsGenerating(true);
      touchConversationOrder(conversationId);

      const controller = chatService.streamMessage(conversationId, text, {
        onToken: (delta) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempAssistantMsg.id
                ? { ...m, content: m.content + delta }
                : m
            )
          );
        },
        onDone: (payload) => {
          setIsGenerating(false);
          setStreamController(null);
          if (payload?.aborted) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempAssistantMsg.id ? { ...m, streaming: false } : m
              )
            );
            return;
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempAssistantMsg.id
                ? { ...m, id: payload.id, streaming: false }
                : m
            )
          );
        },
        onError: (err) => {
          setIsGenerating(false);
          setStreamController(null);
          toast.error(err.message || "The AI failed to respond.");
          setMessages((prev) => prev.filter((m) => m.id !== tempAssistantMsg.id));
        },
      });

      setStreamController(controller);
    },
    [activeId, startNewChat, touchConversationOrder]
  );

  const stopGenerating = useCallback(() => {
    streamController?.abort();
    setIsGenerating(false);
  }, [streamController]);

  const regenerate = useCallback(async () => {
    if (!activeId) return;
    setIsGenerating(true);
    try {
      setMessages((prev) => {
        const lastAssistantIdx = [...prev]
          .reverse()
          .findIndex((m) => m.role === "assistant");
        if (lastAssistantIdx === -1) return prev;
        const idx = prev.length - 1 - lastAssistantIdx;
        return prev.slice(0, idx);
      });
      const reply = await chatService.regenerateResponse(activeId);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [activeId]);

  const value = {
    conversations,
    conversationsLoading,
    activeId,
    messages,
    messagesLoading,
    isGenerating,
    loadConversations,
    openConversation,
    startNewChat,
    rename,
    remove,
    deleteMessageById,
    sendMessage,
    stopGenerating,
    regenerate,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
