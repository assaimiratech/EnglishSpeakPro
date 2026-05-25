import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "EnglishSpeakPro" },

    heroContent: { type: String, default: "" },

    whatsappNumber: { type: String, default: "" },

    coursePrice: {
      type: Number,
      default: 0, // LKR
    },

    currency: {
      type: String,
      default: "LKR",
    },

    discount: {
      enabled: { type: Boolean, default: false },
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: { type: Number, default: 0 },
    },

    clarityId: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Settings", settingsSchema);
