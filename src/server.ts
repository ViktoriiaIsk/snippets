// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { notFound } from "./controllers/notFoundController";
import { helloMiddleware } from "./middleware/exampleMiddleware";
import snippetRoutes from "./routes/snippetRoutes";
import mongoose from "mongoose";
import path from "path";
import dashboardRoutes from "./routes/dashboardRoutes";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Routes
app.use("/", dashboardRoutes);
app.use("/api", helloMiddleware);
app.use("/api/snippets", snippetRoutes);
app.all("*", notFound);

// Database connection
try {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Database connection OK");
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}! 🚀`);
});
