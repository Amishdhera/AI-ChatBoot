import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { postChat, postChatStream, regenerate } from "../controllers/chatController.js";

const router = Router();

router.post("/", requireAuth, postChat);
router.post("/stream", requireAuth, postChatStream);
router.post("/regenerate", requireAuth, regenerate);

export default router;
