"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const apiController_1 = require("../controllers/apiController");
const router = express_1.default.Router();
// ✅ Public Routes
router.post("/signup", adminController_1.adminSignup);
router.post("/login", adminController_1.adminLogin);
router.post("/createApi", adminMiddleware_1.verifyAdmin, apiController_1.createAPI);
router.put("/updateApi/:id", adminMiddleware_1.verifyAdmin, apiController_1.updateAPI);
router.delete("/deleteApi/:id", adminMiddleware_1.verifyAdmin, apiController_1.deleteAPI);
router.put("/apis/:id/approve", adminMiddleware_1.verifyAdmin, apiController_1.approveAPI);
router.put("/apis/:id/reject", adminMiddleware_1.verifyAdmin, apiController_1.rejectAPI);
router.get("/my-apis", adminMiddleware_1.verifyAdmin, apiController_1.getMyApis);
// ✅ Protected Route Example
router.get("/dashboard", adminMiddleware_1.verifyAdmin, (req, res) => {
    const authReq = req; // Cast req to 'any' to avoid TS errors
    res.json({ message: "Welcome Admin!", admin: authReq.admin });
});
exports.default = router;
