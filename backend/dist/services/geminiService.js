"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
function generateEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield embeddingModel.embedContent(text); // Corrected function call
            if (!result.embedding || !result.embedding.values) {
                throw new Error("Embedding response is missing values.");
            }
            return result.embedding.values; // Extract the actual embedding array
        }
        catch (error) {
            console.error("❌ Error generating embedding:", error);
            throw new Error("Failed to generate embedding");
        }
    });
}
