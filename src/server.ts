import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import appRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Configure DNS to use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);
console.log("🔧 DNS configured to use Google DNS (8.8.8.8, 8.8.4.4)");

// Load .env file
const result = dotenv.config();
if (result.error) {
  console.warn("⚠️  .env file not found:", result.error.message);
} else {
  console.log("✅ .env file loaded successfully");
}

// Debug: Log if environment variables are loaded
console.log("🔍 Environment variables status:");
console.log(
  "   MONGO_URI:",
  process.env.MONGO_URI ? "✅ Loaded" : "❌ Not loaded",
);
console.log(
  "   JWT_SECRET:",
  process.env.JWT_SECRET ? "✅ Loaded" : "❌ Not loaded",
);
console.log(
  "   OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Not loaded",
);
console.log("   PORT:", process.env.PORT || "5000 (default)");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", appRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    const mongoUri =
      "mongodb+srv://1122rahulchoudhary_db_user:Rahul@cluster0.0v50nq2.mongodb.net/jobs_db";
    if (!mongoUri) {
      console.error("MONGO_URI is not defined in .env file");
      return;
    }
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error instanceof Error ? error.message : error,
    );
    console.log("⚠️  Continuing without database. Some features may not work.");
    // Don't exit, allow the server to run without DB for now
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
