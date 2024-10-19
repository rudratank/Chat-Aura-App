import express from "express";
import { signup } from "../controllers/AuthController.js"; // Ensure this path is correct
import {login} from "../controllers/AuthController.js"

const router = express.Router();
router.post("/signup", signup);
router.post("/login",login)

export default router;
