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
exports.logApiUsage = void 0;
const Api_1 = __importDefault(require("../models/Api")); // Import API model
const logApiUsage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract API ID from request
        const api = yield Api_1.default.findById(id);
        if (api) {
            api.usageCount = (api.usageCount || 0) + 1; // Increment usage count
            yield api.save();
        }
        next(); // Continue to the next middleware or controller
    }
    catch (error) {
        console.error("Error logging API usage:", error);
        next(); // Don't block request even if logging fails
    }
});
exports.logApiUsage = logApiUsage;
