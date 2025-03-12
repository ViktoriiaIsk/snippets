import { Request, Response } from "express";
import Snippet from "../models/Snippet";

const decodeCode = (code: string): string => Buffer.from(code, "base64").toString("utf-8");

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const snippets = await Snippet.find();

    const decodedSnippets = snippets.map(snippet => ({
      ...snippet.toObject(),
      code: decodeCode(snippet.code),
    }));

    res.render("dashboard", { snippets: decodedSnippets });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
};
