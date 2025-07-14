import express from "express";
import {
  getAllGadgets,
  getGadgetById,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestructGadget,
} from "../controllers/gadgetController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = express.Router();

/**
 * @route GET /api/gadgets
 * @desc Get all gadgets with optional status filter
 * @query status - Filter by gadget status (Available, Deployed, Destroyed, Decommissioned)
 * @access Private
 */
router.get("/", authenticateToken, getAllGadgets);

/**
 * @route GET /api/gadgets/:id
 * @desc Get a specific gadget by ID
 * @access Private
 */
router.get("/:id", authenticateToken, getGadgetById);

/**
 * @route POST /api/gadgets
 * @desc Create a new gadget
 * @access Private - Admin only
 */
router.post("/", authenticateToken, requireRole(["admin"]), createGadget);

/**
 * @route PATCH /api/gadgets/:id
 * @desc Update an existing gadget
 * @access Private - Admin only
 */
router.patch("/:id", authenticateToken, requireRole(["admin"]), updateGadget);

/**
 * @route DELETE /api/gadgets/:id
 * @desc Decommission a gadget (soft delete)
 * @access Private - Admin only
 */
router.delete("/:id", authenticateToken, requireRole(["admin"]), deleteGadget);

/**
 * @route POST /api/gadgets/:id/self-destruct
 * @desc Trigger self-destruct sequence for a gadget
 * @access Private - Agent and Admin
 */
router.post("/:id/self-destruct", authenticateToken, selfDestructGadget);

export default router;
