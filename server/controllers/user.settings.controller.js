import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../services/email.service.js";
import bcrypt from "bcrypt";

// REQUEST EMAIL CHANGE
export const changeEmailRequest = async (req, res) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    return res.status(400).json({ message: "New email is required" });
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 1000 * 60 * 30; // 30 min

    await user.save();

    const link = `http://localhost:5000/api/auth/verify-email/${token}?email=${newEmail}`;

    await sendEmail({
      to: newEmail,
      subject: "Verify your email",
      html: `<p>Click to verify: <a href="${link}">Verify Email</a></p>`,
    });

    res.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("changeEmailRequest failed:", error);
    res.status(500).json({
      message: "Failed to send verification email",
      error: error.message || error,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const { email } = req.query;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid token" });

  user.email = email;
  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;

  await user.save();

  res.json({ message: "Email verified successfully" });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Old password wrong" });

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save({ validateBeforeSave: false });

  res.json({ message: "Password updated" });
};
