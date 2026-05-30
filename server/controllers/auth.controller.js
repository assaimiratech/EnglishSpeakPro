import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../services/email.service.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, whatsapp, country, city } = req.body;

    const normalizedWhatsapp = String(whatsapp || "").trim();
    if (!normalizedWhatsapp || !/^[0-9]+$/.test(normalizedWhatsapp)) {
      return res.status(400).json({
        message: "WhatsApp number is required and must contain only digits",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      whatsapp: normalizedWhatsapp,
      country: country || "",
      city: city || "",
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account is suspended. Please contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        theme: user.theme,
        whatsapp: user.whatsapp,
        country: user.country,
        city: user.city,
        settings: user.settings,
        status: user.isActive, // optional but good to send
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMe = async (req, res) => {
  res.json({
    data: req.user, // from JWT middleware
  });
};

// UPDATE PROFILE (authenticated user)
export const updateProfile = async (req, res) => {
  try {
    const { name, whatsapp, email, theme, country, city } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (whatsapp !== undefined) {
      const normalizedWhatsapp = String(whatsapp).trim();
      if (!normalizedWhatsapp || !/^[0-9]+$/.test(normalizedWhatsapp)) {
        return res.status(400).json({
          message: "WhatsApp number is required and must contain only digits",
        });
      }
      updates.whatsapp = normalizedWhatsapp;
    }
    if (country !== undefined) updates.country = country;
    if (city !== undefined) updates.city = city;
    if (theme !== undefined) updates.theme = theme;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      updates.email = email;
      updates.emailVerified = false;
      updates.emailVerificationToken = null;
      updates.emailVerificationExpires = null;
    }

    const updatedUser =
      updates && Object.keys(updates).length > 0
        ? await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            {
              new: true,
              runValidators: true,
              context: "query",
            },
          ).select("-password")
        : await User.findById(req.user.id).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 15 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "OTP and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.forgotPasswordOtp !== otp ||
      !user.forgotPasswordOtpExpires ||
      user.forgotPasswordOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordOtp = null;
    user.forgotPasswordOtpExpires = null;

    await user.save();

    res.json({ message: "Password reset success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
