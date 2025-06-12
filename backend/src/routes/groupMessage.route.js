import express from "express";
import { sendGroupMessage, getGroupMessages } from "../controllers/groupMessage.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send/:groupId", isAuthenticated, sendGroupMessage);
router.get("/chat/:groupId", isAuthenticated, getGroupMessages);

export default router; 