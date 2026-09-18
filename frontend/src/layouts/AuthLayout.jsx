import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full bg-surface flex">
      {/* Brand side */}
      <div className="hidden lg:flex w-[42%] relative overflow-hidden border-r border-surface-border">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, rgb(var(--accent-soft)) 0%, transparent 55%), rgb(var(--bg))",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles size={17} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold text-ink">Nova</span>
          </div>

          <div className="max-w-sm">
            <h1 className="font-display text-3xl font-semibold text-ink leading-tight mb-4">
              A calmer way to work with AI.
            </h1>
            <p className="text-ink-muted leading-relaxed">
              Nova keeps every conversation organized, private, and exactly
              where you left it — synced securely to your account.
            </p>
          </div>

          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Nova. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles size={17} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold text-ink">Nova</span>
          </div>

          {eyebrow && (
            <span className="text-xs font-medium text-accent">{eyebrow}</span>
          )}
          <h2 className="font-display text-2xl font-semibold text-ink mt-1 mb-2">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-ink-muted mb-8">{subtitle}</p>}

          {children}
        </motion.div>
      </div>
    </div>
  );
}
