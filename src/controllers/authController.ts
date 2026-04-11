import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }
    
    const result = await registerUser(name, email, password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const result = await loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ msg: err.message });
  }
};
