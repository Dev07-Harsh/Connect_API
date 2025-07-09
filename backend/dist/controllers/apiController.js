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
exports.getMyApis = exports.rejectAPI = exports.approveAPI = exports.deleteAPI = exports.updateAPI = exports.getAllAPIs = exports.createAPI = void 0;
const Api_1 = __importDefault(require("../models/Api"));
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const geminiService_1 = require("../services/geminiService");
const Api_2 = __importDefault(require("../models/Api"));
// Define Zod schema for API validation
const apiSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters long"),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters long"),
    category: zod_1.z.string().min(3, "Category must be at least 3 characters long"),
    price: zod_1.z.number().min(0, "Price must be a positive number"),
    usage: zod_1.z.string(),
    documentationUrl: zod_1.z.string().url("Invalid URL format"),
    endpoint: zod_1.z.string().url("Invalid endpoint URL format"), // Add this
    provider: zod_1.z.string().min(3, "Provider name must be at least 3 characters"), // Add this
});
const createAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, category, price, usage, documentationUrl, endpoint, provider } = req.body;
        if (!endpoint || !provider) {
            res.status(400).json({ message: "Missing required fields: endpoint and provider" });
            return;
        }
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id; // 🔹 Get Admin ID from middleware
        if (!adminId) {
            res.status(403).json({ message: "Unauthorized: Admin ID missing" });
            return;
        }
        // 🔹 Generate vector embedding for the API description
        const embedding = yield (0, geminiService_1.generateEmbedding)(description);
        // 🔹 Create and save the API record with adminId
        const newApi = yield Api_1.default.create({
            name,
            description,
            category,
            price,
            usage,
            documentationUrl,
            endpoint,
            provider,
            embedding,
            adminId, // ✅ Assign the admin ID
        });
        res.status(201).json(newApi);
    }
    catch (error) {
        console.error("🔥 Error creating API:", error);
        res.status(500).json({ message: "Error creating API", error: error.message });
    }
});
exports.createAPI = createAPI;
// Get all APIs
const getAllAPIs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const page = parseInt((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.trim()) || 1;
        const limit = parseInt((_b = req.query.limit) === null || _b === void 0 ? void 0 : _b.trim()) || 10;
        const skip = (page - 1) * limit;
        // Extract filter query parameters and trim them
        const name = (_c = req.query.name) === null || _c === void 0 ? void 0 : _c.trim();
        const category = (_d = req.query.category) === null || _d === void 0 ? void 0 : _d.trim();
        const minPrice = (_e = req.query.minPrice) === null || _e === void 0 ? void 0 : _e.trim();
        const maxPrice = (_f = req.query.maxPrice) === null || _f === void 0 ? void 0 : _f.trim();
        let filter = {};
        if (name)
            filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
        if (category)
            filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = parseInt(minPrice);
            if (maxPrice)
                filter.price.$lte = parseInt(maxPrice);
        }
        console.log("Generated filter:", JSON.stringify(filter, null, 2)); // Debugging log
        const apis = yield Api_1.default.find(filter).skip(skip).limit(limit);
        const total = yield Api_1.default.countDocuments(filter);
        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            apis,
        });
    }
    catch (error) {
        console.error("🔥 Error fetching APIs:", error);
        res.status(500).json({ message: "Error fetching APIs" });
    }
});
exports.getAllAPIs = getAllAPIs;
// Update API with Zod validation
const updateAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        id = id.trim(); // Remove unwanted whitespace
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid API ID format" });
            return;
        }
        const existingApi = yield Api_1.default.findById(id);
        if (!existingApi) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        let updatedFields = req.body;
        // 🔹 Check if the description is updated and regenerate embeddings
        if (updatedFields.description && updatedFields.description !== existingApi.description) {
            const newEmbedding = yield (0, geminiService_1.generateEmbedding)(updatedFields.description);
            updatedFields.embedding = newEmbedding;
        }
        const updatedApi = yield Api_1.default.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true,
        });
        res.json(updatedApi);
    }
    catch (error) {
        console.error("🔥 Error updating API:", error);
        res.status(500).json({ message: "Error updating API", error: error.message });
    }
});
exports.updateAPI = updateAPI;
// Delete API
const deleteAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        id = id.trim(); // Remove unwanted whitespace
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid API ID format" });
            return;
        }
        const deletedApi = yield Api_1.default.findByIdAndDelete(id);
        if (!deletedApi) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        res.json({ message: "API deleted successfully" });
    }
    catch (error) {
        console.error("🔥 Error deleting API:", error);
        res.status(500).json({ message: "Error deleting API", error: error.message });
    }
});
exports.deleteAPI = deleteAPI;
// Approve API
const approveAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const api = yield Api_2.default.findByIdAndUpdate(id, { status: "approved" }, { new: true });
        if (!api) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        res.status(200).json({ message: "API approved successfully", api });
    }
    catch (error) {
        res.status(500).json({ message: "Error approving API", error });
    }
});
exports.approveAPI = approveAPI;
// Reject API
const rejectAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const api = yield Api_2.default.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
        if (!api) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        res.status(200).json({ message: "API rejected successfully", api });
    }
    catch (error) {
        res.status(500).json({ message: "Error rejecting API", error });
    }
});
exports.rejectAPI = rejectAPI;
const getMyApis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id; // ✅ Get Admin ID from middleware
        if (!adminId) {
            res.status(403).json({ message: "Unauthorized: Admin ID missing" });
            return;
        }
        // 🔹 Fetch all APIs created by this admin
        const myApis = yield Api_1.default.find({ adminId });
        res.status(200).json({ success: true, data: myApis });
    }
    catch (error) {
        console.error("🔥 Error fetching APIs:", error);
        res.status(500).json({ message: "Error fetching APIs", error: error.message });
    }
});
exports.getMyApis = getMyApis;
