import { Request, Response } from "express";
import Snippet from "../models/Snippet";


const encodeCode = (code: string): string => Buffer.from(code).toString("base64");

export const createSnippet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;

    if (!title || !code || !language) {
      res.status(400).json({ message: "Title, code, and language are required." });
      return; 
    }

    
    const newSnippet = new Snippet({
      title,
      code: encodeCode(code), 
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
