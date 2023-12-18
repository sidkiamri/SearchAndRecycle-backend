import express from "express";
import { addGiftCard, getGiftCards, getGiftCardsByUserId, redeemGiftCard } from "../controller/giftcarcontroller.mjs";

const router = express.Router();

router.post('/addGiftCard', addGiftCard);
router.post('/redeemGiftCard', redeemGiftCard);
router.get('/giftcards', getGiftCards);
router.get('/giftcards/:userId', getGiftCardsByUserId);

export default router;
