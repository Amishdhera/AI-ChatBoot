
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import chatRoutes from "./routes/chatRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Some AI provider SDKs (including @google/generative-ai's streaming client)
// can reject an internal promise that our request-level try/catch blocks
// never see, which would otherwise crash the entire server. Log and survive
// instead of taking the whole process — and every other user's request —
// down over one bad stream chunk.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandled rejection]", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaught exception]", err);
});

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please slow down." },
});
app.use("/api", limiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`AI Chatbot backend listening on port ${env.port} [${env.nodeEnv}]`);
});
