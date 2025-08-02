import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";

// ✅ App config
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
mongoose.set("strictQuery", true);

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow frontend URL
    credentials: true,
  })
);

// ✅ Fix for Google OAuth window.postMessage issue
app.use(helmet({
  crossOriginOpenerPolicy: false,
}));

// ✅ Root route to verify server status
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running successfully...");
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ API routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);

// ✅ Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
