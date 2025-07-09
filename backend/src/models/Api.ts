import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
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
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // 🔹 Store adminId
});

const Api = mongoose.model("Api", apiSchema);
export default Api;
