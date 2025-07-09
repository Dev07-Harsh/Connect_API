import mongoose from "mongoose";

const userBookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  apiId: { type: mongoose.Schema.Types.ObjectId, ref: "Api", required: true },
  note: { type: String, maxlength: 500 },  // Optional user note
  tags: [{ type: String }],                // User-defined tags
}, { timestamps: true });

// Ensure unique bookmarks per user-api combination
userBookmarkSchema.index({ userId: 1, apiId: 1 }, { unique: true });
userBookmarkSchema.index({ userId: 1, createdAt: -1 });

const UserBookmark = mongoose.model("UserBookmark", userBookmarkSchema);
export default UserBookmark;
