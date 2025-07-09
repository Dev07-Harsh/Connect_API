"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userBookmarkSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    apiId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Api", required: true },
    note: { type: String, maxlength: 500 }, // Optional user note
    tags: [{ type: String }], // User-defined tags
}, { timestamps: true });
// Ensure unique bookmarks per user-api combination
userBookmarkSchema.index({ userId: 1, apiId: 1 }, { unique: true });
userBookmarkSchema.index({ userId: 1, createdAt: -1 });
const UserBookmark = mongoose_1.default.model("UserBookmark", userBookmarkSchema);
exports.default = UserBookmark;
