// src/routes/applicationRoutes.ts
import express from "express";
import { createApplication, getApplications, updateApplication, deleteApplication } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications);
router.put("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);

export default router;