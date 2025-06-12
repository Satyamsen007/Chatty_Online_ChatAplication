import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  sendFriendRequest,
  getFriendRequests,
  handleFriendRequest,
  getFriends,
  getSentFriendRequests
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/send/:receiverId", isAuthenticated, sendFriendRequest);
router.get("/", isAuthenticated, getFriendRequests);
router.get("/sent", isAuthenticated, getSentFriendRequests);
router.put("/:requestId", isAuthenticated, handleFriendRequest);
router.get("/friends", isAuthenticated, getFriends);

export default router; 