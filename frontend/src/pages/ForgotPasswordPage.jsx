import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout.jsx";
import TextField from "../components/common/TextField.jsx";
import Button from "../components/common/Button.jsx";
import { resetPassword } from "../services/authService.js";
import toast from "react-hot-toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Reset password"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-surface-border bg-surface-panel p-5"
          >
            <CheckCircle2 className="text-emerald-400 mb-2" size={22} />
            <p className="text-sm text-ink">
              If an account exists for <span className="font-medium">{email}</span>,
              a password reset link is on its way.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              error={error}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full">
              Send reset link
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="mt-6 text-sm text-ink-muted text-center">
        <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
