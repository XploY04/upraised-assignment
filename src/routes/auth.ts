import express from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new IMF agent
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 * @desc Login an IMF agent
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /api/auth/profile
 * @desc Get current agent profile
 * @access Private
 */
router.get("/profile", authenticateToken, getProfile);

export default router;
