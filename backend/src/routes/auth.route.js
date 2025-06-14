import express from "express";
import { getCurrentUser, login, logout, signUp, updateProfile, deleteAccount } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', isAuthenticated, updateProfile);
router.get('/current-user', isAuthenticated, getCurrentUser);
router.delete('/delete-account', isAuthenticated, deleteAccount);

export default router;