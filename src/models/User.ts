import mongoose from "mongoose";
import * as bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre("save", async function(this: any) {
  if (!this.isModified("password")) {
    return;
  }
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (err: any) {
    throw err;
  }
});

export default mongoose.model("User", userSchema);
