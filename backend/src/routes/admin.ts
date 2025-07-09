import express from "express";
import { adminSignup, adminLogin } from "../controllers/adminController";
import { verifyAdmin } from "../middleware/adminMiddleware";
import { Request, Response } from "express";
import {
  createAPI,
  updateAPI,
  deleteAPI,
  approveAPI,
  rejectAPI,
  getMyApis// New controllers
} from "../controllers/apiController";
const router = express.Router();

// ✅ Public Routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

router.post("/createApi", verifyAdmin, createAPI);
router.put("/updateApi/:id", verifyAdmin, updateAPI);
router.delete("/deleteApi/:id", verifyAdmin, deleteAPI);

router.put("/apis/:id/approve", verifyAdmin, approveAPI);
router.put("/apis/:id/reject", verifyAdmin, rejectAPI);
router.get("/my-apis", verifyAdmin, getMyApis);
// ✅ Protected Route Example
router.get("/dashboard", verifyAdmin, (req: Request, res: Response) => {
  const authReq = req as any; // Cast req to 'any' to avoid TS errors
  res.json({ message: "Welcome Admin!", admin: authReq.admin });
});

export default router;
