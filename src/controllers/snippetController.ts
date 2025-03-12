import { Request, Response } from "express";
import Snippet from "../models/Snippet";

// Encode code to base64
const encodeCode = (code: string) => Buffer.from(code).toString("base64");

// POST /api/snippets
export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;

    if (!title || !code || !language) {
      return res.status(400).json({ message: "Title, code, and language are required." });
    }

    const newSnippet = new Snippet({
      title,
      code: encodeCode(code), // Encode code
      language,
      tags,
      expiresIn,
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null, // TTL
    });

    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(500).json({ message: "Error creating snippet", error });
  }
};
