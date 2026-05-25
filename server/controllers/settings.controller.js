import Settings from "../models/Settings.js";

// GET SETTINGS
export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
};

// UPDATE SETTINGS (ADMIN)
export const updateSettings = async (req, res) => {
  const settings = await Settings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });

  res.json(settings);
};
