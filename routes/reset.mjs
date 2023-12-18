import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import crypto from "crypto";
import express from "express";
import nodemailer from "nodemailer";

// routes/reset.js

const router = express.Router();

router.post('/reset', async (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error generating reset token' });
    }

    const token = buffer.toString('hex');
    const code = Math.floor(Math.random() * 9000) + 1000; // Random code from 1000 to 9999

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'No account with that email found' });
      }

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // set up email data
      let mailOptions = {
        to: user.email,
        from: 'sidki.amri@esprit.tn',
        subject: 'A request for a new password in Reduce trash',
        text: `
          You are receiving this because you (or someone else) have requested the reset of the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:
          ${code} // Updated link with token and code
          If you did not request this, please ignore this email and your password will remain unchanged.
        `,
      };

      // send mail with defined transport object
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sidki.amri@esprit.tn',
          pass: 'nqjewojcbcpqvsob',
        },
      });

      transporter.sendMail(mailOptions, function(err) {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Failed to send email' });
        }

        res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions. '+token +code});
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing request' });
    }
  });
});

router.post('/reset/pass', async (req, res) => {
    try {
      const { password, confirm,code } = req.body;
  
      const user = await User.findOne({
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      }
  
      if (password !== confirm) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }

      // Check if the code matches the randomly generated code
     
  
      user.password =password;
      user.resetPasswordExpires = undefined;
      user.resetPasswordCode = undefined; // Clear the code
  
      await user.save();
  
      res.status(200).json({ message: 'Your password has been changed.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing request' });
    }
});

export default router;
