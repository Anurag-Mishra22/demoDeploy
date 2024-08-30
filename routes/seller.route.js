import express from "express";
import { seller, getSeller } from "../controllers/seller.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post('/create', verifyToken, seller);
router.get('/:email', verifyToken, getSeller);

export default router;
