import User from "../models/user.mjs";
import twilio from "twilio";

const accountSid = "AC7d5c5dea68f6e0facf51f4e95a0e7512";
const authToken = "0d8a33bc97fbbca99fa3112cbdde4689";
const messagingServiceSid = "MG46496d3492056db7af64b54d43d8432a"; // Replace with your messaging service SID

const client = twilio(accountSid, authToken, { messagingServiceSid });

export const sendVerificationCode = async (userId, code) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      await client.messages.create({
        body: `Your verification code is ${code}`,
        messagingServiceSid,
        to: user.phoneNumber,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
