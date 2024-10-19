import express from "express";
import { signup } from "../controllers/AuthController.js"; // Ensure this path is correct

const router = express.Router();
router.post("/signup", signup);

export default router;
