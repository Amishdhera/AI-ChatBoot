import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/chat/Sidebar.jsx";
import TopNavbar from "../components/chat/TopNavbar.jsx";
import MessageBubble from "../components/chat/MessageBubble.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";
import SuggestedPrompts from "../components/chat/SuggestedPrompts.jsx";
import ScrollToBottomButton from "../components/chat/ScrollToBottomButton.jsx";
import { useChat } from "../context/ChatContext.jsx";

export default function ChatDashboardPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {
    conversations,
    activeId,
    messages,
    messagesLoading,
    isGenerating,
    loadConversations,
    openConversation,
    sendMessage,
    stopGenerating,
    regenerate,
    deleteMessageById,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (conversationId && conversationId !== activeId) {
      openConversation(conversationId);
    }
  }, [conversationId, activeId, openConversation]);

  useEffect(() => {
    if (activeId && activeId !== conversationId) {
      navigate(`/chat/${activeId}`, { replace: true });
    }
  }, [activeId, conversationId, navigate]);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom("auto");
  }, [activeId, scrollToBottom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 200) scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distanceFromBottom > 300);
  };

  const handleSend = (text) => {
    setInputValue("");
    sendMessage(text);
  };

  const activeConversation = conversations.find((c) => c.id === activeId);
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="h-screen flex bg-surface overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          title={activeConversation?.title}
          isGenerating={isGenerating}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="flex-1 relative overflow-hidden">
          {!activeId && messages.length === 0 && !messagesLoading ? (
            <SuggestedPrompts onPick={setInputValue} />
          ) : (
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto"
            >
              <div className="max-w-3xl mx-auto px-2 lg:px-4">
                {messagesLoading ? (
                  <div className="py-10 text-center text-sm text-ink-faint">
                    Loading conversation…
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <MessageBubble
                        key={m.id}
                        message={m}
                        isLast={m.id === lastAssistantId}
                        onDelete={deleteMessageById}
                        onRegenerate={regenerate}
                      />
                    ))}
                  </AnimatePresence>
                )}
                <div ref={bottomRef} className="h-4" />
              </div>
            </div>
          )}

          <ScrollToBottomButton
            visible={showScrollButton}
            onClick={() => scrollToBottom()}
          />
        </div>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isGenerating={isGenerating}
          onStop={stopGenerating}
        />
      </div>
    </div>
  );
}
