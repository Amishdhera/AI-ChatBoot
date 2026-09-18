import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 text-center px-6">
      <span className="font-display text-6xl font-semibold text-ink">404</span>
      <p className="text-ink-muted max-w-sm">
        This page doesn&apos;t exist. It may have been moved or the link is incorrect.
      </p>
      <Link to="/chat">
        <Button>Back to chat</Button>
      </Link>
    </div>
  );
}
