import jwt from "jsonwebtoken";

export const generateToken = (id, role, isActive) => {
  return jwt.sign(
    {
      id,
      role,
      isActive,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};
