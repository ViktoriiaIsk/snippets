import express from "express";
import { createSnippet, getSnippets } from "../controllers/snippetController";

const router = express.Router();

// POST /api/snippets
router.post("/", createSnippet);

// GET /api/snippets
router.get("/", getSnippets);
export default router;
