
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

// The API key is read only from process.env on the server. It is never sent
// to, or accepted from, the frontend in any request payload.
const genAI = new GoogleGenerativeAI(env.ai.apiKey);

const SYSTEM_PROMPT =
  "You are a helpful, concise AI assistant embedded in a chat product. " +
  "Format code using markdown fenced code blocks with a language tag.";

function getModel() {
  return genAI.getGenerativeModel({
    model: env.ai.model, // e.g. "gemini-3.6-flash"
    systemInstruction: SYSTEM_PROMPT,
  });
}

// Gemini uses role "model" for assistant turns (not "assistant"), and
// requires the conversation to start on a "user" turn.
function toGeminiContents(history) {
  return history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

/**
 * history: array of { role: "user" | "assistant", content: string }
 * Returns the full assistant reply as a string.
 */
export async function getChatCompletion(history) {
  const model = getModel();
  const result = await model.generateContent({
    contents: toGeminiContents(history),
  });
  return result.response.text();
}
