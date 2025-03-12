import express from "express";
import { createSnippet, getSnippets, getSnippetById, updateSnippet } from "../controllers/snippetController";

const router = express.Router();

// POST /api/snippets
router.post("/", createSnippet);

// GET /api/snippets
router.get("/", getSnippets);

// GET /api/snippets/:id
router.get("/:id", getSnippetById);

// PUT /api/snippets/:id
router.put("/:id", updateSnippet);

export default router;
