// import { useState } from "react";
// import { motion } from "framer-motion";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import { Copy, Check, RotateCcw, Trash2, Sparkles, User } from "lucide-react";
// import toast from "react-hot-toast";
// import CodeBlock from "./CodeBlock.jsx";
// import TypingIndicator from "./TypingIndicator.jsx";

// function formatTime(value) {
//   if (!value) return "";
//   const date = typeof value === "string" ? new Date(value) : value.toDate?.() || new Date(value);
//   if (Number.isNaN(date.getTime())) return "";
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// export default function MessageBubble({ message, isLast, onDelete, onRegenerate }) {
//   const [copied, setCopied] = useState(false);
//   const isUser = message.role === "user";
//   const isEmpty = message.streaming && !message.content;

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(message.content);
//     setCopied(true);
//     toast.success("Copied to clipboard");
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.25, ease: "easeOut" }}
//       className={`group flex gap-3 px-4 lg:px-0 py-4 ${isUser ? "flex-row-reverse" : ""}`}
//     >
//       <div
//         className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
//           isUser ? "bg-surface-raised text-ink-muted" : "bg-accent text-white"
//         }`}
//       >
//         {isUser ? <User size={15} /> : <Sparkles size={15} />}
//       </div>

//       <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
//         <div
//           className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
//             isUser
//               ? "bg-accent text-white rounded-tr-sm"
//               : "bg-surface-panel border border-surface-border text-ink rounded-tl-sm"
//           }`}
//         >
//           {isEmpty ? (
//             <TypingIndicator />
//           ) : isUser ? (
//             <p className="whitespace-pre-wrap break-words">{message.content}</p>
//           ) : (
//             <div className="msg-markdown break-words">
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 rehypePlugins={[rehypeHighlight]}
//                 components={{
//                   code({ inline, className, children, ...props }) {
//                     if (inline) {
//                       return (
//                         <code className={className} {...props}>
//                           {children}
//                         </code>
//                       );
//                     }
//                     return <CodeBlock className={className}>{children}</CodeBlock>;
//                   },
//                   pre({ children }) {
//                     return <>{children}</>;
//                   },
//                 }}
//               >
//                 {message.content}
//               </ReactMarkdown>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-3 mt-1.5 px-1">
//           <span className="text-[11px] text-ink-faint">{formatTime(message.createdAt)}</span>

//           {!isEmpty && (
//             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//               <button
//                 onClick={handleCopy}
//                 className="text-ink-faint hover:text-ink"
//                 aria-label="Copy message"
//               >
//                 {copied ? <Check size={13} /> : <Copy size={13} />}
//               </button>
//               {!isUser && isLast && (
//                 <button
//                   onClick={onRegenerate}
//                   className="text-ink-faint hover:text-ink"
//                   aria-label="Regenerate response"
//                 >
//                   <RotateCcw size={13} />
//                 </button>
//               )}
//               <button
//                 onClick={() => onDelete(message.id)}
//                 className="text-ink-faint hover:text-red-400"
//                 aria-label="Delete message"
//               >
//                 <Trash2 size={13} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check, RotateCcw, Trash2, Sparkles, User } from "lucide-react";
import toast from "react-hot-toast";
import CodeBlock from "./CodeBlock.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

function formatTime(value) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value.toDate?.() || new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, isLast, onDelete, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isEmpty = message.streaming && !message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group flex gap-3 px-4 lg:px-0 py-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-surface-raised text-ink-muted" : "bg-accent text-white"
        }`}
      >
        {isUser ? <User size={15} /> : <Sparkles size={15} />}
      </div>

      <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-accent text-white rounded-tr-sm"
              : "bg-surface-panel border border-surface-border text-ink rounded-tl-sm"
          }`}
        >
          {isEmpty ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="msg-markdown break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ className, children, ...props }) {
                    // react-markdown v8+ no longer passes an `inline` prop —
                    // fenced code blocks get a `language-xxx` class from
                    // remark/rehype, plain inline `code` spans don't, so we
                    // use that presence to tell them apart instead.
                    const isBlock = /language-(\w+)/.test(className || "");
                    if (!isBlock) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                    return <CodeBlock className={className}>{children}</CodeBlock>;
                  },
                  pre({ children }) {
                    return <>{children}</>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1.5 px-1">
          <span className="text-[11px] text-ink-faint">{formatTime(message.createdAt)}</span>

          {!isEmpty && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="text-ink-faint hover:text-ink"
                aria-label="Copy message"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {!isUser && isLast && (
                <button
                  onClick={onRegenerate}
                  className="text-ink-faint hover:text-ink"
                  aria-label="Regenerate response"
                >
                  <RotateCcw size={13} />
                </button>
              )}
              <button
                onClick={() => onDelete(message.id)}
                className="text-ink-faint hover:text-red-400"
                aria-label="Delete message"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
