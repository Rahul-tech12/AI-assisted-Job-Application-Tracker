import User from "../models/User.js";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const user = new User({ name, email, password });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return { user: { id: user._id, name, email }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isValidPassword = await bcryptjs.compare(password, user.password);
  if (!isValidPassword) throw new Error("Invalid password");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return { user: { id: user._id, name: user.name, email }, token };
};
