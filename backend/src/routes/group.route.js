import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getGroups,
  addGroupMembers,
  leaveGroup,
  removeMember,
  deleteGroup,
  updateGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", isAuthenticated, createGroup);
router.get("/", isAuthenticated, getGroups);
router.post("/:groupId/members", isAuthenticated, addGroupMembers);
router.post("/leave/:groupId", isAuthenticated, leaveGroup);
router.delete("/:groupId/members/:memberId", isAuthenticated, removeMember);
router.delete("/:groupId", isAuthenticated, deleteGroup);
router.put("/:groupId", isAuthenticated, updateGroup);

export default router; 