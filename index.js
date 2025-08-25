import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import empRoutes from "./routes/empRoutes.js"
import db from "./config/db.js";
import recruiterRoutes from "./routes/recruiterRoutes.js"
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emp",empRoutes);
 app.use("/api/recruiter", recruiterRoutes)

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
