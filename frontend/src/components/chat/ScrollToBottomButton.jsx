import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function ScrollToBottomButton({ visible, onClick }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={onClick}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-surface-raised border border-surface-border px-3.5 py-2 text-xs text-ink shadow-soft hover:border-accent/50 transition-colors"
        >
          <ArrowDown size={13} />
          Scroll to bottom
        </motion.button>
      )}
    </AnimatePresence>
  );
}
