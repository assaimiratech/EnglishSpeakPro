import User from "../models/User.js";
import bcrypt from "bcrypt";

// GET ALL USERS (ADMIN)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 }); // newest first

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to fetch users",
    });
  }
};

// CREATE USER (ADMIN)
export const createUser = async (req, res) => {
  const { name, email, password, whatsapp, country, city } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    whatsapp,
    country: country || "",
    city: city || "",
    password: hashedPassword,
    role: "user", // 🔥 FORCE ROLE
  });

  res.status(201).json(user);
};

// UPDATE USER (ADMIN)
export const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    let updateData = { ...rest };

    // only hash if password is provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password"); // NEVER return password

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER (ADMIN)
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
