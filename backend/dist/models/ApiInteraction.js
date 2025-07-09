"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiInteractionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    apiId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Api", required: true },
    interactionType: {
        type: String,
        enum: ['view_docs', 'copy_endpoint', 'quick_integrate', 'bookmark', 'unbookmark'],
        required: true
    },
    metadata: {
        searchQuery: String, // What user searched to find this API
        position: Number, // Position in search results
        sessionId: String, // Track user session
        userAgent: String, // Browser info
        timestamp: { type: Date, default: Date.now }
    }
}, { timestamps: true });
// Index for efficient queries
apiInteractionSchema.index({ userId: 1, apiId: 1 });
apiInteractionSchema.index({ apiId: 1, interactionType: 1 });
apiInteractionSchema.index({ createdAt: -1 });
const ApiInteraction = mongoose_1.default.model("ApiInteraction", apiInteractionSchema);
exports.default = ApiInteraction;
