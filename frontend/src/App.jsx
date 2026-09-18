import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ChatDashboardPage from "./pages/ChatDashboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgb(var(--bg-raised))",
            color: "rgb(var(--text))",
            border: "1px solid rgb(var(--border))",
            fontSize: "0.875rem",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/chat/:conversationId?"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <ChatDashboardPage />
              </ChatProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <SettingsPage />
              </ChatProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
