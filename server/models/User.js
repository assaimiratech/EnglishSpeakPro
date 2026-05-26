import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]+$/, "WhatsApp number must contain only digits"],
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
      trim: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    forgotPasswordOtp: {
      type: String,
      default: null,
    },

    forgotPasswordOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
