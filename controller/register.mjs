import User from "../models/user.mjs";
import auth from "../middelware/Auth.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendVerificationCode } from "../utils/sms.mjs";

export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).send('Email already in use');
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const sendVerificationCodeToPhone = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const user = await User.findOne({ phoneNumber });
      if (user) {
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        user.verificationCode = verificationCode;
        await user.save();
        await sendVerificationCode(user._id, verificationCode);
        res.sendStatus(200);
      } else {
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const newUser = new User({
          phoneNumber,
          verificationCode,
        });
        await newUser.save();
        await sendVerificationCode(newUser._id, verificationCode);
        res.sendStatus(200);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
};

export const verifyCode = async (req, res) => {
    try {
      const { phoneNumber, code } = req.body;
      const user = await User.findOne({ phoneNumber });
      if (user && user.verificationCode === code) {
        user.verificationCode = '';
        await user.save();
        res.sendStatus(200);
      } else {
        res.status(401).send('Invalid verification code');
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
};

export const registerUser = async (req, res) => {
  try {
    const { phoneNumber, email, name, dateOfBirth, password, code } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res.status(401).send('Invalid verification code');
      return;
    }

    user.email = email;
    user.name = name;
    user.dateOfBirth = dateOfBirth;
    user.password = password;
    await user.save();

    res.status(201).json({
      id: user._id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      password: user.password,
      points: user.points

    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
export const updatePhoneNumber = async (req, res) => {
    try {
      const { userId, phoneNumber } = req.body;
      const user = await User.findById(userId);
      if (user) {
        user.phoneNumber = phoneNumber;
        await user.save();
        res.sendStatus(200);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send('User not found');
      return;
    }
    if (user.password !== password) {
      res.status(401).send('Invalid password');
      return;
    }
    res.status(200).json({
      id: user._id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      password: user.password,
      points: user.points
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
export async function updateAvatar(userId, avatar) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatar },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(`Could not update avatar for user ${userId}: ${error.message}`);
  }
}
export function forgotPassword(req, res) {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Aucun utilisateur trouvé avec cet email." });
      }
      const code = Math.floor(Math.random() * 10000);
      user.resetPasswordCode = code;
      user.resetPasswordExpires = Date.now() + 360000; // 1 hour
      user
        .save()
        .then((updatedUser) => {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "sidki.amri@esprit.tn",
              pass: "nqjewojcbcpqvsob",
            },
          });
          const mailOptions = {
            from: "Sidki",
            to: email,
            subject: "Mot de passe oublié",
            html: `
              <!doctype html>
              <html lang="en-US">
                <head>
                  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                  <title>Reset Password Email Template</title>
                  <meta name="description" content="Reset Password Email Template.">
                  <style type="text/css">
                      a:hover {text-decoration: underline !important;}
                  </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                  <!--100% body table-->
                  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                      style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                      <tr>
                          <td>
                              <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                  align="center" cellpadding="0" cellspacing="0">
                                  <tr>
                                      <td style="height:80px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="text-align:center;">
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:20px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td>
                                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                              style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                              <tr>
                                                  <td style="height:40px;">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td style="padding:0 35px;">
                                                      <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans
                                                      -serif;">Réinitialisation du mot de passe</h1>
                                                      <span
                                                                                                             style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:2px solid #cecece;width:100%;"></span>
                                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                      Vous avez demandé la réinitialisation de votre mot de passe. Voici votre code de réinitialisation:
                                                      </p>
                                                      <h2
                                                                                                             style="color:#1e1e2d; font-weight:500; margin:0;font-size:28px;font-family:'Rubik',sans-serif;letter-spacing:1px;">
                                                      ${code}</h2>
                                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                      Ce code n'est valable que pendant une heure. Si vous n'avez pas demandé de réinitialisation de
                                                      mot de passe, ignorez simplement cet e-mail.
                                                      </p>
                                                      </td>
                                                      </tr>
                                                      <tr>
                                                      <td style="height:40px;"> </td>
                                                      </tr>
                                                      </table>
                                                      </td>
                                                      </tr>
                                                      <tr>
                                                      <td style="height:20px;"> </td>
                                                      </tr>
                                                      <tr>
                                                      <td style="text-align:center;">
                                                      <p style="font-size:14px; color:#455056; line-height:18px; margin:0 0 0;">
                                                      ©<strong>ReduceTrash</strong></p>
                                                      </td>
                                                      </tr>
                                                      <tr>
                                                      <td style="height:80px;"> </td>
                                                      </tr>
                                                      </table>
                                                      </td>
                                                      </tr>
                                                      </table>
                                                      <!--/100% body table-->
                                                      </body>
                                                      </html>
                                                      `,
                                                      };
                                                      transporter.sendMail(mailOptions, (error, info) => {
                                                      if (error) {
                                                      console.log(error);
                                                      return res
                                                      .status(500)
                                                      .json({ message: "Une erreur s'est produite lors de l'envoi du mail." });
                                                      }
                                                      console.log("Message sent: %s", info.messageId);
                                                      return res.json({ message: "Un code a été envoyé à votre adresse email." });
                                                      });
                                                      })
                                                      .catch((error) => {
                                                      console.log(error);
                                                      return res
                                                      .status(500)
                                                      .json({ message: "Une erreur s'est produite lors de la réinitialisation du mot de passe." });
                                                      });
                                                      })
                                                      .catch((error) => {
                                                      console.log(error);
                                                      return res
                                                      .status(500)
                                                      .json({ message: "Une erreur s'est produite lors de la recherche de l'utilisateur." });
                                                      });
                                                      }

///////////////////reset password/////////////////////////////////////
// Verify if the reset code is valid
export function verifyCodeemail(req, res) {
  const { email, resetCode } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Aucun utilisateur trouvé avec cet email." });
      }
      if (user.resetPasswordCode !== resetCode) {
        return res
          .status(401)
          .json({ message: "Le code de réinitialisation est invalide." });
      }
      if (user.resetPasswordExpires < Date.now()) {
        return res
          .status(401)
          .json({ message: "Le code de réinitialisation a expiré." });
      }
      res.status(200).json({ message: "Le code de réinitialisation est valide." });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Une erreur s'est produite lors de la vérification du code de réinitialisation." });
    });
}

// Reset the password for the user
export function resetPassword(req, res) {
  const { email, code, password } = req.body;

  User.findOne({ email, resetPasswordCode: code })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: "Le code de réinitialisation du mot de passe est invalide ou a expiré." });
      }

      user.password = password;
      user.resetPasswordCode = null;
      user.resetPasswordExpires = null;

      user.save()
        .then(() => {
          return res
            .status(200)
            .json({ message: "Le mot de passe a été réinitialisé avec succès." });
        })
        .catch((err) => {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Une erreur est survenue lors de la réinitialisation du mot de passe." });
        });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Une erreur est survenue lors de la réinitialisation du mot de passe." });
    });
}