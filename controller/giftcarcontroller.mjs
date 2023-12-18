import GiftCard from "../models/giftcard.mjs";
import User from "../models/user.mjs";

export const addGiftCard = async (req, res) => {
    try {
      const { image } = req.body;

      const userId = req.body.userId;
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      const maxGiftValue = 100; // Maximum value of the gift card
      const giftValue = Math.floor(Math.random() * (user.points + maxGiftValue)) + 1; // Random value between user's current points and the maximum value
      const newGiftCard = new GiftCard({
        code: generateGiftCardCode(),
        point: giftValue,
        redeemed: false,
        createdBy: userId,
        image:image

      });
      await newGiftCard.save();
      user.points -= giftValue;
      await user.save();
      res.status(200).json({ message: 'Gift card added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error adding gift card', error: err });
    }
  };
  
  // Function to generate a unique gift card code
  function generateGiftCardCode() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
// POST method to redeem a gift card
// Takes in the gift card code and the user id as inputs
// If the gift card value is less than or equal to the user's current points, the user's points are updated and the gift card is marked as redeemed
// If the gift card value is greater than the user's current points, a new gift card is generated and the user is notified that redemption was unsuccessful
const redeemGiftCard = async (req, res) => {
  try {
    const { code, userId } = req.body;
    const giftCard = await GiftCard.findOne({ code });
    const user = await User.findById(userId);

    if (!giftCard) {
      return res.status(404).json({ message: 'Gift card not found' });
    }

    if (giftCard.redeemed) {
      return res.status(400).json({ message: 'Gift card already redeemed' });
    }

    if (giftCard.point > user.points) {
      // Generate a new gift card with a value less than or equal to the user's current points
      const newGiftValue = Math.floor(Math.random() * user.points) + 1;
 
      return res.status(400).json({ message: `Redemption unsuccessful. A new gift card with ${newGiftValue} points has been generated.` });
    }

    // Update user points and mark gift card as redeemed
    user.points -= giftCard.point;
    await user.save();
    giftCard.redeemed = true;
    await giftCard.save();
    return res.status(200).json({ message: 'Gift card redemption successful' });
  } catch (err) {
    return res.status(500).json({ message: 'Error redeeming gift card', error: err });
  }
}

export { redeemGiftCard };

export const getGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find();
    res.status(200).json(giftCards);
  } catch (err) {
    res.status(500).json({ message: 'Error getting gift cards', error: err });
  }
};

export const getGiftCardsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const giftCards = await GiftCard.find({ createdBy: userId });
    res.status(200).json(giftCards);
  } catch (err) {
    res.status(500).json({ message: 'Error getting gift cards by user ID', error: err });
  }
};
