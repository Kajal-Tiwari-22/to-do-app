import express from 'express';
import { loginUser, registerUser,getUser, googleAuthUser } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

router.post("/login",loginUser);
router.post("/register",registerUser);
router.post("/google-auth", googleAuthUser);
router.get("/getuser", requireAuth, getUser)

export default router;
