import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Pencil,
  Trash2,
  Settings,
  LogOut,
  X,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { logoutUser } from "../../services/authService";
import ConfirmModal from "../common/ConfirmModal.jsx";

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    conversations,
    conversationsLoading,
    activeId,
    startNewChat,
    openConversation,
    rename,
    remove,
  } = useChat();

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter((c) => c.title?.toLowerCase().includes(q));
  }, [conversations, query]);

  const handleNewChat = async () => {
    await startNewChat();
    navigate("/chat");
    onClose?.();
  };

  const handleSelect = (id) => {
    openConversation(id);
    navigate(`/chat/${id}`);
    onClose?.();
  };

  const startRename = (conv) => {
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const commitRename = async (id) => {
    const title = editValue.trim();
    setEditingId(null);
    if (title) await rename(id, title);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await remove(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    navigate("/chat");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] shrink-0 border-r border-surface-border bg-surface-panel flex flex-col
          transform transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
<div className="flex items-center justify-between px-5 h-16 border-b border-surface-border bg-surface/50 backdrop-blur-sm">
  {/* Left: Logo + Brand */}
  <div className="flex items-center gap-3">
    {/* Logo Icon */}
    <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-sm shadow-accent/30">
      <Sparkles size={16} className="text-white" strokeWidth={2.5} />
    </div>

    {/* Brand Name */}
    <div className="flex flex-col leading-none">
      <span className="font-display text-[15px] font-semibold text-ink tracking-tight">
        Nova
      </span>
      <span className="text-[10px] text-ink-muted font-medium mt-0.5">
        by Ameet Kumar Dhera
      </span>
    </div>
  </div>

  {/* Right: Close Button (Mobile) */}
  <button
    onClick={onClose}
    aria-label="Close sidebar"
    className="lg:hidden p-2 -mr-1 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors duration-150"
  >
    <X size={18} />
  </button>
</div>

        {/* New chat */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 rounded-xl border border-surface-border bg-surface-raised hover:border-accent/50 hover:bg-accent-soft px-3.5 py-2.5 text-sm font-medium text-ink transition-colors"
          >
            <Plus size={16} />
            New chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full rounded-lg bg-surface border border-surface-border pl-8 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent/60"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {conversationsLoading ? (
            <div className="px-2 py-3 text-xs text-ink-faint">Loading chats…</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-ink-faint">
              {query ? "No matching conversations." : "No conversations yet."}
            </div>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map((conv) => (
                <li key={conv.id}>
                  <div
                    className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer text-sm transition-colors
                      ${
                        activeId === conv.id
                          ? "bg-accent-soft text-ink"
                          : "text-ink-muted hover:bg-surface-raised hover:text-ink"
                      }`}
                    onClick={() => editingId !== conv.id && handleSelect(conv.id)}
                  >
                    <MessageSquare size={15} className="shrink-0 opacity-70" />

                    {editingId === conv.id ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename(conv.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => commitRename(conv.id)}
                        className="flex-1 bg-transparent border-b border-accent outline-none text-sm"
                      />
                    ) : (
                      <span className="flex-1 truncate">{conv.title}</span>
                    )}

                    {editingId !== conv.id && (
                      <span className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(conv);
                          }}
                          className="p-1 rounded text-ink-faint hover:text-ink hover:bg-surface-border"
                          aria-label="Rename conversation"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDelete(conv);
                          }}
                          className="p-1 rounded text-ink-faint hover:text-red-400 hover:bg-surface-border"
                          aria-label="Delete conversation"
                        >
                          <Trash2 size={13} />
                        </button>
                      </span>
                    )}
                    {editingId === conv.id && (
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          commitRename(conv.id);
                        }}
                        className="p-1 text-accent"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User */}
        <div className="border-t border-surface-border p-3">
          <div className="flex items-center gap-2.5 px-1 mb-2">
            <div className="h-8 w-8 rounded-full bg-accent-soft text-accent flex items-center justify-center text-sm font-semibold shrink-0">
              {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-ink truncate">{user?.displayName || "User"}</p>
              <p className="text-xs text-ink-faint truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors"
            >
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-muted hover:bg-surface-raised hover:text-red-400 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </aside>

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete conversation?"
        description={`"${pendingDelete?.title}" and all its messages will be permanently deleted.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
