import express from "express";
import { createSnippet } from "../controllers/snippetController";

const router = express.Router();

// POST /api/snippets
router.post("/", createSnippet);

export default router;
