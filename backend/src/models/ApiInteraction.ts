import mongoose from "mongoose";

const apiInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  apiId: { type: mongoose.Schema.Types.ObjectId, ref: "Api", required: true },
  interactionType: { 
    type: String, 
    enum: ['view_docs', 'copy_endpoint', 'quick_integrate', 'bookmark', 'unbookmark'],
    required: true 
  },
  metadata: {
    searchQuery: String,        // What user searched to find this API
    position: Number,           // Position in search results
    sessionId: String,          // Track user session
    userAgent: String,          // Browser info
    timestamp: { type: Date, default: Date.now }
  }
}, { timestamps: true });

// Index for efficient queries
apiInteractionSchema.index({ userId: 1, apiId: 1 });
apiInteractionSchema.index({ apiId: 1, interactionType: 1 });
apiInteractionSchema.index({ createdAt: -1 });

const ApiInteraction = mongoose.model("ApiInteraction", apiInteractionSchema);
export default ApiInteraction;
