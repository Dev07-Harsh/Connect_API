"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    usage: { type: String },
    documentationUrl: { type: String, required: true },
    endpoint: { type: String, required: true },
    provider: { type: String, required: true },
    embedding: { type: [Number] },
    usageCount: { type: Number, default: 0 },
    adminId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Admin", required: true }, // 🔹 Store adminId
});
const Api = mongoose_1.default.model("Api", apiSchema);
exports.default = Api;
