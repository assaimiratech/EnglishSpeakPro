import User from "../models/User.js";
import Topic from "../models/Topic.js";
import Lesson from "../models/Lesson.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const premiumUsers = await User.countDocuments({
      role: "user",
      isPremium: true,
    });

    const totalTopics = await Topic.countDocuments();
    const totalLessons = await Lesson.countDocuments();

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const signupUsers = await User.find({
      role: "user",
      createdAt: { $gte: weekStart },
    }).select("createdAt");

    const loginUsers = await User.find({
      role: "user",
      lastLogin: { $gte: weekStart },
    }).select("lastLogin");

    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt lastLogin");

    const signupsByDay = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const label = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        day: label,
        count: 0,
      };
    });

    signupUsers.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      const dayIndex = Math.floor(
        (createdAt - weekStart) / (1000 * 60 * 60 * 24),
      );
      if (dayIndex >= 0 && dayIndex < signupsByDay.length) {
        signupsByDay[dayIndex].count += 1;
      }
    });

    const loginsByDay = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const label = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        day: label,
        count: 0,
      };
    });

    loginUsers.forEach((user) => {
      const lastLogin = new Date(user.lastLogin);
      const dayIndex = Math.floor(
        (lastLogin - weekStart) / (1000 * 60 * 60 * 24),
      );
      if (dayIndex >= 0 && dayIndex < loginsByDay.length) {
        loginsByDay[dayIndex].count += 1;
      }
    });

    const activeUsersLast7Days = await User.countDocuments({
      role: "user",
      lastLogin: { $gte: weekStart },
    });

    res.json({
      totalUsers,
      premiumUsers,
      totalTopics,
      totalLessons,
      activeUsersLast7Days,
      weeklySignups: signupsByDay,
      weeklyLogins: loginsByDay,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
