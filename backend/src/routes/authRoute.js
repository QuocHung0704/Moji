import express from 'express';
import { signIn, signUp } from '../controller/authController.js';

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

export default router;