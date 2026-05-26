import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    questionText: {
      type: String,
      required: true,
    },

    audioUrl: {
      type: String,
      required: true,
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

export default mongoose.model("Lesson", lessonSchema);
