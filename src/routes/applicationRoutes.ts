// src/routes/applicationRoutes.ts
import express from "express";
import { createApplication } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, createApplication);

export default router;