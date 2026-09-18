
import * as store from "../services/firestoreService.js";
import { getChatCompletion } from "../services/aiService.js";
import { AppError } from "../middleware/errorHandler.js";

const MAX_MESSAGE_LENGTH = 8000;
const CONTEXT_WINDOW = 20; // last N messages sent to the model

function validateChatBody(body) {
  const { conversationId, message } = body || {};
  if (!conversationId || typeof conversationId !== "string") {
    throw new AppError("conversationId is required.", 400);
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new AppError("message is required.", 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new AppError(
      `message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
      400
    );
  }
  return { conversationId, message: message.trim() };
}

// POST /api/chat  (non-streaming)
export async function postChat(req, res, next) {
  try {
    const { conversationId, message } = validateChatBody(req.body);
    const uid = req.user.uid;

    // Ownership check happens inside addMessage/listMessages.
    await store.addMessage(uid, conversationId, { role: "user", content: message });

    const fullHistory = (await store.listMessages(uid, conversationId)).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const reply = await getChatCompletion(fullHistory.slice(-CONTEXT_WINDOW));

    const saved = await store.addMessage(uid, conversationId, {
      role: "assistant",
      content: reply,
    });

    res.json({
      success: true,
      message: { id: saved.id, role: "assistant", content: reply },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/chat/stream (Server-Sent Events, token-by-token)
export async function postChatStream(req, res, next) {
  try {
    const { conversationId, message } = validateChatBody(req.body);
    const uid = req.user.uid;

    const savedUserMessage = await store.addMessage(uid, conversationId, {
      role: "user",
      content: message,
    });
    const history = (await store.listMessages(uid, conversationId)).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    const send = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Tell the client the real Firestore id for the user message right away,
    // so it can replace its temporary client-side id (fixes delete/copy
    // actions on the user message 404ing before the assistant reply lands).
    send("user_message", { id: savedUserMessage.id });

    try {
      // The @google/generative-ai SDK's real streaming parser
      // (generateContentStream) intermittently throws "Failed to parse
      // stream" on some responses. To avoid that entirely, fetch the
      // complete reply with the plain (non-streaming) call, then drip-feed
      // it to the client in small chunks so the UI still gets the
      // token-by-token typing effect.
      const fullText = await getChatCompletion(history.slice(-CONTEXT_WINDOW));

      const CHUNK_SIZE = 4; // characters per tick
      const CHUNK_DELAY_MS = 12;
      for (let i = 0; i < fullText.length; i += CHUNK_SIZE) {
        if (controller.signal.aborted) break;
        send("token", { delta: fullText.slice(i, i + CHUNK_SIZE) });
        await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
      }

      if (controller.signal.aborted) {
        send("aborted", {});
      } else {
        const saved = await store.addMessage(uid, conversationId, {
          role: "assistant",
          content: fullText,
        });
        send("done", { id: saved.id, content: fullText });
      }
    } catch (streamErr) {
      if (controller.signal.aborted) {
        send("aborted", {});
      } else {
        // Log the real cause server-side (never sent to the browser) so it
        // shows up in this terminal instead of only a generic message.
        console.error("[chat stream] AI provider call failed:", streamErr);
        send("error", { error: "AI generation failed. Please try again." });
      }
    } finally {
      res.end();
    }
  } catch (err) {
    next(err);
  }
}

// POST /api/chat/regenerate — removes the last assistant message and re-generates
export async function regenerate(req, res, next) {
  try {
    const { conversationId } = req.body || {};
    if (!conversationId) throw new AppError("conversationId is required.", 400);
    const uid = req.user.uid;

    const messages = await store.listMessages(uid, conversationId);
    const lastAssistantIndex = [...messages]
      .reverse()
      .findIndex((m) => m.role === "assistant");

    if (lastAssistantIndex === -1) {
      throw new AppError("No assistant response to regenerate.", 400);
    }
    const target = messages[messages.length - 1 - lastAssistantIndex];
    if (target.role === "assistant") {
      await store.deleteMessage(uid, conversationId, target.id);
    }

    const history = (await store.listMessages(uid, conversationId)).map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const reply = await getChatCompletion(history.slice(-CONTEXT_WINDOW));
    const saved = await store.addMessage(uid, conversationId, {
      role: "assistant",
      content: reply,
    });

    res.json({
      success: true,
      message: { id: saved.id, role: "assistant", content: reply },
    });
  } catch (err) {
    next(err);
  }
}
