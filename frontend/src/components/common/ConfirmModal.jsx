import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface-panel p-6 shadow-soft"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-4">
              <AlertTriangle size={20} />
            </div>
            <h3 id="confirm-modal-title" className="font-display text-lg font-semibold text-ink mb-1.5">
              {title}
            </h3>
            <p className="text-sm text-ink-muted mb-6">{description}</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
