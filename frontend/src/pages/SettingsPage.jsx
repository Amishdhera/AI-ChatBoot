import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon, User, ShieldCheck, LogOut, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { changePassword, deleteAccount, logoutUser } from "../services/authService.js";
import TextField from "../components/common/TextField.jsx";
import Button from "../components/common/Button.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-panel p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
          <Icon size={17} />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
          {description && <p className="text-sm text-ink-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pwForm);
      toast.success("Password updated");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your password to confirm.");
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteAccount({ currentPassword: deletePassword });
      toast.success("Account deleted");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="h-16 border-b border-surface-border flex items-center px-4 lg:px-8 gap-3">
        <button
          onClick={() => navigate("/chat")}
          className="p-2 rounded-lg text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors"
          aria-label="Back to chat"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-base font-semibold text-ink">Settings</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 lg:px-0 py-8 space-y-6">
        <SettingsSection icon={User} title="Account" description="Your profile information.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ink-faint mb-1">Name</p>
              <p className="text-sm text-ink">{user?.displayName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-1">Email</p>
              <p className="text-sm text-ink">{user?.email}</p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={theme === "dark" ? Moon : Sun}
          title="Appearance"
          description="Choose how Nova looks on this device."
        >
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                theme === "dark"
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-surface-border text-ink-muted hover:text-ink"
              }`}
            >
              <Moon size={15} /> Dark
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                theme === "light"
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-surface-border text-ink-muted hover:text-ink"
              }`}
            >
              <Sun size={15} /> Light
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={ShieldCheck}
          title="Change password"
          description="Choose a strong password you don't use elsewhere."
        >
          <form onSubmit={handleChangePassword} className="space-y-4">
            <TextField
              label="Current password"
              isPassword
              autoComplete="current-password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            />
            <TextField
              label="New password"
              isPassword
              autoComplete="new-password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            />
            <TextField
              label="Confirm new password"
              isPassword
              autoComplete="new-password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            />
            <Button type="submit" loading={pwLoading}>
              Update password
            </Button>
          </form>
        </SettingsSection>

        <SettingsSection icon={LogOut} title="Session">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={15} /> Log out
          </Button>
        </SettingsSection>

        <SettingsSection
          icon={Trash2}
          title="Delete account"
          description="This permanently deletes your account and all conversations. This cannot be undone."
        >
          <div className="space-y-4">
            <TextField
              label="Confirm your password"
              isPassword
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
              Delete my account
            </Button>
          </div>
        </SettingsSection>
      </div>

      <ConfirmModal
        open={confirmingDelete}
        title="Delete your account?"
        description="All your conversations and account data will be permanently removed. This action cannot be undone."
        confirmLabel="Delete account"
        loading={deleteLoading}
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
