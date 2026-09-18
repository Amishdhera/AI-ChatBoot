import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout.jsx";
import TextField from "../components/common/TextField.jsx";
import Button from "../components/common/Button.jsx";
import { registerUser } from "../services/authService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = "Enter your full name.";
    }
    if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Account created — welcome to Nova!");
      navigate("/chat");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Free to use. No credit card required."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          label="Full name"
          autoComplete="name"
          value={form.fullName}
          error={errors.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
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
          autoComplete="new-password"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <TextField
          label="Confirm password"
          isPassword
          autoComplete="new-password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-muted text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
