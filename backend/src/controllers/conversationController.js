import * as store from "../services/firestoreService.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getConversations(req, res, next) {
  try {
    const conversations = await store.listConversations(req.user.uid);
    res.json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
}

export async function getConversationById(req, res, next) {
  try {
    const { id } = req.params;
    const conversation = await store.getConversation(req.user.uid, id);
    const messages = await store.listMessages(req.user.uid, id);
    res.json({
      success: true,
      conversation: { id: conversation.id, title: conversation.title },
      messages,
    });
  } catch (err) {
    next(err);
  }
}

export async function createConversation(req, res, next) {
  try {
    const title = (req.body?.title || "New chat").trim().slice(0, 100);
    const conversation = await store.createConversation(req.user.uid, title);
    res.status(201).json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
}

export async function updateConversation(req, res, next) {
  try {
    const { id } = req.params;
    const title = (req.body?.title || "").trim().slice(0, 100);
    if (!title) throw new AppError("Title is required.", 400);
    const conversation = await store.renameConversation(req.user.uid, id, title);
    res.json({ success: true, conversation });
  } catch (err) {
    next(err);
  }
}

export async function removeConversation(req, res, next) {
  try {
    const { id } = req.params;
    await store.deleteConversation(req.user.uid, id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function removeMessage(req, res, next) {
  try {
    const { conversationId, messageId } = req.params;
    await store.deleteMessage(req.user.uid, conversationId, messageId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
