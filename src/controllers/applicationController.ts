import type { Request, Response } from "express";
import Application from "../models/Application.js";
import { parseJobDescription, generateResumePoints } from "../services/aiService.js";

export const createApplication = async (req: any, res: Response) => {
  try {
    const { jd } = req.body;

    const parsed = await parseJobDescription(jd);
    const suggestions = await generateResumePoints(jd);

    const app = new Application({
      userId: req.user.id,
      ...parsed
    });

    await app.save();

    res.json({ app, suggestions });
  } catch (err) {
    res.status(500).json({ msg: "Error creating application" });
  }
};