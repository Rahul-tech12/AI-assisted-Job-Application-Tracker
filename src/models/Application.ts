import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  company: String,
  role: String,
  skills: [String],
  niceToHave: [String],
  seniority: String,
  location: String,
  resumePoints: [String],
  status: {
    type: String,
    enum: ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"],
    default: "Applied"
  },
  notes: String,
  dateApplied: { type: Date, default: Date.now },
  jobDescription: String
});

export default mongoose.model("Application", applicationSchema);