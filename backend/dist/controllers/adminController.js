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
exports.adminLogin = exports.adminSignup = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// ✅ Admin Signup
// ✅ Admin Signup with JWT Token
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = adminSchema.parse(req.body);
        // Check if admin exists
        const existingAdmin = yield Admin_1.default.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: "Admin already exists" });
            return;
        }
        // Create new admin
        const newAdmin = yield Admin_1.default.create({ name, email, password });
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, email: newAdmin.email, role: newAdmin.role, name: newAdmin.name }, process.env.JWT_SECRET);
        res.status(201).json({ message: "Admin registered successfully", token });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid input", error: error.message });
    }
});
exports.adminSignup = adminSignup;
// ✅ Admin Login
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield Admin_1.default.findOne({ email });
        if (!admin || admin.password !== password) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: "admin", name: admin.name }, process.env.JWT_SECRET);
        res.json({ message: "Login successful", token });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid input", error });
    }
});
exports.adminLogin = adminLogin;
