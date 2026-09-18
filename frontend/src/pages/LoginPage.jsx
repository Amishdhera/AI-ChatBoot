import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout.jsx";
import TextField from "../components/common/TextField.jsx";
import Button from "../components/common/Button.jsx";
import { loginUser } from "../services/authService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await loginUser(form);
      toast.success("Welcome back!");
      navigate("/chat");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Password"
          isPassword
          autoComplete="current-password"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
              className="rounded border-surface-border accent-accent"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-accent hover:text-accent-hover">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-muted text-center">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-accent hover:text-accent-hover font-medium">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
