import type { Request, Response } from "express";
import Application from "../models/Application.js";
import { parseJobDescription, generateResumePoints } from "../services/aiService.js";

export const createApplication = async (req: any, res: Response) => {
  try {
    const { jd } = req.body;

    if (!jd) {
      return res.status(400).json({ msg: "Job description is required" });
    }

    const parsed = await parseJobDescription(jd);
    const suggestions = await generateResumePoints(jd);

    const app = new Application({
      userId: req.user.userId,
      jobDescription: jd,
      resumePoints: suggestions,
      ...parsed
    });

    await app.save();

    res.json({ app, suggestions });
  } catch (err: any) {
    console.error("❌ Error creating application:", err.message);
    res.status(500).json({ msg: err.message || "Error creating application" });
  }
};

export const getApplications = async (req: any, res: Response) => {
  try {
    const applications = await Application.find({ userId: req.user.userId }).sort({ dateApplied: -1 });
    res.json(applications);
  } catch (err: any) {
    console.error("❌ Error fetching applications:", err.message);
    res.status(500).json({ msg: "Error fetching applications" });
  }
};

export const updateApplication = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const app = await Application.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateData,
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ msg: "Application not found" });
    }

    res.json(app);
  } catch (err: any) {
    console.error("❌ Error updating application:", err.message);
    res.status(500).json({ msg: "Error updating application" });
  }
};

export const deleteApplication = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const app = await Application.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

    if (!app) {
      return res.status(404).json({ msg: "Application not found" });
    }

    res.json({ msg: "Application deleted successfully" });
  } catch (err: any) {
    console.error("❌ Error deleting application:", err.message);
    res.status(500).json({ msg: "Error deleting application" });
  }
};