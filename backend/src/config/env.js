import dotenv from "dotenv";

dotenv.config();

const required = [
  "AI_API_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // Fail fast and loud rather than silently running with broken credentials.
  console.error(
    `[config] Missing required environment variables: ${missing.join(", ")}\n` +
      "Copy backend/.env.example to backend/.env and fill in real values."
  );
  process.exit(1);
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
  ai: {
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || "gemini-2.0-flash",
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // .env stores literal "\n" sequences; convert back to real newlines.
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
  },
};
