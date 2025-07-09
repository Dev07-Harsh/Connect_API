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
exports.getUserInteractionHistory = exports.getUserBookmarks = exports.toggleBookmark = exports.trackApiInteraction = exports.tryAPI = exports.trendingAPI = exports.searchAPIs = exports.userLogin = exports.userSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const Api_1 = __importDefault(require("../models/Api"));
const ApiInteraction_1 = __importDefault(require("../models/ApiInteraction"));
const UserBookmark_1 = __importDefault(require("../models/UserBookmark"));
const embeddingService_1 = require("../services/embeddingService");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
// ✅ User Signup
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Create new user (no password hashing)
        const newUser = new User_1.default({ name, email, password });
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // Save user only after token generation succeeds
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully", token });
    }
    catch (error) {
        console.error("Signup Error:", error); // Log the full error
        res.status(400).json({ message: "Signup failed", error });
    }
});
exports.userSignup = userSignup;
// ✅ User Login
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || user.password !== password) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid input", error });
    }
});
exports.userLogin = userLogin;
// Function to compute cosine similarity
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}
// User API search function
const searchAPIs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.body; // User input
        if (!query) {
            res.status(400).json({ message: "Search query is required" });
            return;
        }
        // 1️⃣ Check if the query directly matches an API name
        const exactMatchAPIs = yield Api_1.default.find({ name: { $regex: query, $options: "i" } });
        if (exactMatchAPIs.length > 0) {
            res.json({ message: "Exact match found", apis: exactMatchAPIs });
            return;
        }
        // 2️⃣ Convert user input into embeddings
        const userEmbedding = yield (0, embeddingService_1.generateUserEmbedding)(query);
        // 3️⃣ Retrieve all APIs with embeddings
        const allAPIs = yield Api_1.default.find({ embedding: { $exists: true, $ne: null } });
        // 4️⃣ Calculate similarity scores, filter by threshold, sort and slice
        const threshold = 0.7; // Only return APIs with similarity above this value
        const scoredAPIs = allAPIs
            .map(api => (Object.assign(Object.assign({}, api.toObject()), { similarity: cosineSimilarity(userEmbedding, api.embedding) })))
            .filter(api => api.similarity >= threshold) // Filter out low similarity results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5); // Return top 5 results
        res.json({ message: "Relevant APIs found", apis: scoredAPIs });
    }
    catch (error) {
        console.error("Error searching APIs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchAPIs = searchAPIs;
const trendingAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trendingApis = yield Api_1.default.find().sort({ usageCount: -1 }).limit(10);
        res.status(200).json(trendingApis);
    }
    catch (error) {
        console.error("Error fetching trending APIs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.trendingAPI = trendingAPI;
const tryAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the API id from the URL parameters
        const { id } = req.params;
        // Find the API details in the database
        const apiData = yield Api_1.default.findById(id);
        if (!apiData) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        // Increment the usage count for this API
        yield Api_1.default.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
        // Forward the request to the actual external API endpoint
        // This example assumes a GET request; adjust method, headers, etc. as needed
        const externalResponse = yield (0, axios_1.default)({
            method: req.method, // Use the same HTTP method as the incoming request
            url: apiData.endpoint, // External API endpoint stored in your DB
            headers: req.headers, // Optionally forward headers (filter if needed)
            params: req.query, // Forward query parameters (for GET requests)
            data: req.body, // For POST/PUT requests, forward the body
        });
        // Return the external API's response to the client
        res.status(externalResponse.status).json(externalResponse.data);
    }
    catch (error) {
        console.error("Error in tryAPI endpoint:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.tryAPI = tryAPI;
// 📊 Track API Interactions
const trackApiInteraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { apiId, interactionType, metadata } = req.body;
        // Validate interaction type
        const validTypes = ['view_docs', 'copy_endpoint', 'quick_integrate', 'bookmark', 'unbookmark'];
        if (!validTypes.includes(interactionType)) {
            res.status(400).json({ message: "Invalid interaction type" });
            return;
        }
        // Check if API exists
        const api = yield Api_1.default.findById(apiId);
        if (!api) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        // Create interaction record
        const interaction = new ApiInteraction_1.default({
            userId,
            apiId,
            interactionType,
            metadata: Object.assign(Object.assign({}, metadata), { userAgent: req.headers['user-agent'], timestamp: new Date() })
        });
        yield interaction.save();
        // Update API usage count for certain interactions
        if (['view_docs', 'quick_integrate'].includes(interactionType)) {
            yield Api_1.default.findByIdAndUpdate(apiId, { $inc: { usageCount: 1 } });
        }
        res.status(201).json({
            message: "Interaction tracked successfully",
            redirectUrl: interactionType === 'view_docs' ? api.documentationUrl : null
        });
    }
    catch (error) {
        console.error("Error tracking interaction:", error);
        res.status(500).json({ message: "Failed to track interaction" });
    }
});
exports.trackApiInteraction = trackApiInteraction;
// ⭐ Bookmark Management
const toggleBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { apiId, note, tags } = req.body;
        console.log("Toggle bookmark - UserId:", userId, "ApiId:", apiId);
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        if (!apiId) {
            res.status(400).json({ message: "API ID is required" });
            return;
        }
        // Check if API exists
        const api = yield Api_1.default.findById(apiId);
        if (!api) {
            res.status(404).json({ message: "API not found" });
            return;
        }
        // Check if bookmark already exists
        const existingBookmark = yield UserBookmark_1.default.findOne({ userId, apiId });
        console.log("Existing bookmark:", existingBookmark);
        if (existingBookmark) {
            // Remove bookmark
            yield UserBookmark_1.default.deleteOne({ userId, apiId });
            // Track unbookmark interaction
            yield new ApiInteraction_1.default({
                userId,
                apiId,
                interactionType: 'unbookmark',
                metadata: { userAgent: req.headers['user-agent'] }
            }).save();
            res.json({ message: "API removed from bookmarks", bookmarked: false });
        }
        else {
            // Add bookmark
            const bookmark = new UserBookmark_1.default({ userId, apiId, note, tags });
            yield bookmark.save();
            // Track bookmark interaction
            yield new ApiInteraction_1.default({
                userId,
                apiId,
                interactionType: 'bookmark',
                metadata: { userAgent: req.headers['user-agent'] }
            }).save();
            res.json({ message: "API bookmarked successfully", bookmarked: true });
        }
    }
    catch (error) {
        console.error("Error toggling bookmark:", error);
        res.status(500).json({
            message: "Failed to toggle bookmark",
            error: error.message
        });
    }
});
exports.toggleBookmark = toggleBookmark;
// 📚 Get User Bookmarks
const getUserBookmarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("Fetching bookmarks for user:", userId);
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const bookmarks = yield UserBookmark_1.default.find({ userId })
            .populate('apiId')
            .sort({ createdAt: -1 });
        console.log("Found bookmarks:", bookmarks.length);
        res.json({
            message: "Bookmarks retrieved successfully",
            bookmarks: bookmarks.map(bookmark => (Object.assign(Object.assign({}, bookmark.toObject()), { api: bookmark.apiId })))
        });
    }
    catch (error) {
        console.error("Error fetching bookmarks:", error);
        res.status(500).json({
            message: "Failed to fetch bookmarks",
            error: error.message
        });
    }
});
exports.getUserBookmarks = getUserBookmarks;
// 📈 Get User Interaction History
const getUserInteractionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { limit = 50, offset = 0 } = req.query;
        console.log("Fetching interaction history for user:", userId);
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const interactions = yield ApiInteraction_1.default.find({ userId })
            .populate('apiId')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(offset));
        const totalCount = yield ApiInteraction_1.default.countDocuments({ userId });
        console.log("Found interactions:", interactions.length, "Total:", totalCount);
        res.json({
            message: "Interaction history retrieved successfully",
            interactions: interactions.map(interaction => (Object.assign(Object.assign({}, interaction.toObject()), { api: interaction.apiId }))),
            pagination: {
                total: totalCount,
                limit: Number(limit),
                offset: Number(offset),
                hasMore: Number(offset) + Number(limit) < totalCount
            }
        });
    }
    catch (error) {
        console.error("Error fetching interaction history:", error);
        res.status(500).json({
            message: "Failed to fetch interaction history",
            error: error.message
        });
    }
});
exports.getUserInteractionHistory = getUserInteractionHistory;
