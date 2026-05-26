import Topic from "../models/Topic.js";
import Lesson from "../models/Lesson.js";

// CREATE TOPIC (ADMIN ONLY)
export const createTopic = async (req, res) => {
  try {
    const { title, description, isPremium, order, isPublished } = req.body;

    const topic = await Topic.create({
      title,
      description,
      isPremium,
      order,
      isPublished: isPublished ?? false, // important
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.aggregate([
      {
        $match: {
          isPublished: true,
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "topicId",
          as: "lessons",
        },
      },
      {
        $addFields: {
          lessonCount: { $size: "$lessons" },
        },
      },
      {
        $project: {
          lessons: 0,
        },
      },
    ]);

    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopicsAdmin = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TOPIC (ADMIN)
export const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TOPIC (ADMIN)
export const deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
