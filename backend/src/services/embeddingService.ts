import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export async function generateUserEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent(text); // Corrected function call

    if (!result.embedding || !result.embedding.values) {
      throw new Error("Embedding response is missing values.");
    }

    return result.embedding.values; // Extract the actual embedding array
  } catch (error) {
    console.error("❌ Error generating user embedding:", error);
    throw new Error("Failed to generate user embedding");
  }
}
