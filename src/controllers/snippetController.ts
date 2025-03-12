import { Request, Response } from "express";
import mongoose from "mongoose";
import Snippet from "../models/Snippet";

const encodeCode = (code: string): string => Buffer.from(code).toString("base64");
const decodeCode = (code: string): string => Buffer.from(code, "base64").toString("utf-8");

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
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : null,
    });

    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(500).json({ message: "Error creating snippet", error });
  }
};

export const updateSnippet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, code, language, tags } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid snippet ID" });
        return;
      }
  
      const snippet = await Snippet.findById(id);
      if (!snippet) {
        res.status(404).json({ message: "Snippet not found" });
        return;
      }
  
      snippet.title = title || snippet.title;
      snippet.code = code ? encodeCode(code) : snippet.code;
      snippet.language = language || snippet.language;
      snippet.tags = tags || snippet.tags;
      snippet.updatedAt = new Date();
  
      await snippet.save();
      res.status(200).json({
        ...snippet.toObject(),
        code: decodeCode(snippet.code),
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating snippet", error });
    }
  };

export const getSnippets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, tags, page = "1", limit = "10", sort = "createdAt", order = "desc" } = req.query;

    const filter: any = {};
    if (language) filter.language = { $regex: new RegExp(language as string, "i") };
    if (tags) filter.tags = { $all: (tags as string).split(",") };

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;
    const sortOrder = order === "desc" ? -1 : 1;

    const snippets = await Snippet.find(filter)
      .sort({ [sort as string]: sortOrder })
      .skip(skip)
      .limit(pageSize);

    const decodedSnippets = snippets.map(snippet => ({
      ...snippet.toObject(),
      code: decodeCode(snippet.code),
    }));

    res.status(200).json(decodedSnippets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching snippets", error });
  }
};

export const getSnippetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid snippet ID" });
        return;
      }
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      res.status(404).json({ message: "Snippet not found" });
      return;
    }

    if (snippet.expiresAt && snippet.expiresAt < new Date()) {
      res.status(410).json({ message: "Snippet has expired" });
      return;
    }

    res.status(200).json({
      ...snippet.toObject(),
      code: decodeCode(snippet.code),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching snippet", error });
  }
};
