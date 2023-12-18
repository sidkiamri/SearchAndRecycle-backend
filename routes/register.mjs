import express from "express";

import {
  checkEmailAvailability,
  sendVerificationCodeToPhone,
  verifyCode,
  registerUser,
  updatePhoneNumber,
  loginUser,
  updateAvatar,
  forgotPassword,
  verifyCodeemail,
  resetPassword
} from '../controller/register.mjs';

const router = express.Router();

router.post('/check-email-availability', checkEmailAvailability);
router.post('/send-verification-code', sendVerificationCodeToPhone);
router.post('/verify-code', verifyCode);
router.post('/', registerUser);
router.put('/users/:userId/phone-number', updatePhoneNumber);
router.post('/login', loginUser);
router.put('/users/:userId/avatar', async (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;

  try {
    const updatedUser = await updateAvatar(userId, avatar);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/sendemailcode',forgotPassword);
router.post('/verifycodeemail',verifyCodeemail);
router.post('/resetpassword',resetPassword);
export default router;
