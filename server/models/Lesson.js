import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: false,
    },

    questionText: {
      type: String,
      required: false,
    },

    audioUrl: {
      type: String,
      required: false,
    },

    answerText: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// indexes to speed up common queries
lessonSchema.index({ topicId: 1 });
lessonSchema.index({ order: 1 });
lessonSchema.index({ isPublished: 1 });

export default mongoose.model("Lesson", lessonSchema);
