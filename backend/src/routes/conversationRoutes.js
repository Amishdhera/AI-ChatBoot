import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  removeConversation,
  removeMessage,
} from "../controllers/conversationController.js";

const router = Router();

router.get("/", requireAuth, getConversations);
router.post("/", requireAuth, createConversation);
router.get("/:id", requireAuth, getConversationById);
router.put("/:id", requireAuth, updateConversation);
router.delete("/:id", requireAuth, removeConversation);
router.delete("/:conversationId/messages/:messageId", requireAuth, removeMessage);

export default router;
