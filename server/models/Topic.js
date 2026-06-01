import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// indexes to speed up lookups and sorting
topicSchema.index({ title: 1 });
topicSchema.index({ isPublished: 1 });
topicSchema.index({ order: 1 });
export default mongoose.model("Topic", topicSchema);
