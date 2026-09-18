import { motion } from "framer-motion";
import {
  Code2,
  FileText,
  Bug,
  Lightbulb,
  BookOpenText,
  LayoutTemplate,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PROMPTS = [
  {
    icon: BookOpenText,
    label: "Explain a concept",
    text: "Explain how closures work in JavaScript, with a simple example.",
  },
  {
    icon: Code2,
    label: "Write code",
    text: "Write a JavaScript function that debounces another function.",
  },
  {
    icon: LayoutTemplate,
    label: "Build a component",
    text: "Create a reusable React button component with variants and loading state.",
  },
  {
    icon: Bug,
    label: "Debug my code",
    text: "Help me debug why my useEffect hook runs twice on mount.",
  },
  {
    icon: FileText,
    label: "Summarize text",
    text: "Summarize the following text into three concise bullet points:\n\n",
  },
  {
    icon: Lightbulb,
    label: "Generate ideas",
    text: "Give me 5 creative feature ideas for a personal finance app.",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function SuggestedPrompts({ onPick }) {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl font-semibold text-ink mb-2">
          {getGreeting()}, {firstName}
        </h2>
        <p className="text-ink-muted">How can I help you today?</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {PROMPTS.map((p, i) => (
          <motion.button
            key={p.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            onClick={() => onPick(p.text)}
            className="text-left rounded-xl border border-surface-border bg-surface-panel p-4 hover:border-accent/50 hover:bg-accent-soft transition-colors"
          >
            <p.icon size={18} className="text-accent mb-3" />
            <p className="text-sm font-medium text-ink mb-1">{p.label}</p>
            <p className="text-xs text-ink-faint line-clamp-2">{p.text}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
