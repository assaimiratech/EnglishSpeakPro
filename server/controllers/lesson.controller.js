import Lesson from "../models/Lesson.js";
import Topic from "../models/Topic.js";

// CREATE LESSON (ADMIN)
export const createLesson = async (req, res) => {
  try {
    const {
      topicId,
      questionText,
      audioUrl,
      answerText,
      order,
      isPremium,
      isPublished,
    } = req.body;

    const lesson = await Lesson.create({
      topicId,
      questionText,
      audioUrl,
      answerText,
      order,
      isPremium,
      isPublished,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublishedLessons = async (req, res) => {
  try {
    const { topicId } = req.query;

    const filter = {
      isPublished: true,
    };

    if (topicId) filter.topicId = topicId;

    const lessons = await Lesson.find(filter)
      .populate("topicId", "title")
      .sort({ order: 1, createdAt: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LESSONS BY TOPIC (PUBLIC)
export const getLessonsByTopic = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      topicId: req.params.topicId,
      isPublished: true,
    }).sort({ order: 1, createdAt: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LESSON (ADMIN)
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LESSON (ADMIN)
export const deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLessons = async (req, res) => {
  try {
    const { page = 1, topicId, search = "" } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (topicId) filter.topicId = topicId;

    if (search) {
      filter.questionText = { $regex: search, $options: "i" };
    }

    const lessons = await Lesson.find(filter)
      .populate("topicId", "title")
      .skip(skip)
      .limit(limit)
      .sort({ order: 1, createdAt: 1 });

    const total = await Lesson.countDocuments(filter);

    res.json({
      lessons,
      total,
      // page: Number(page),
      // pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "Audio uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
