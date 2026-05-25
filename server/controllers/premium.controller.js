import PremiumRequest from "../models/PremiumRequest.js";
import User from "../models/User.js";

// USER: CREATE REQUEST
export const createPremiumRequest = async (req, res) => {
  try {
    const { name, email, whatsapp, message } = req.body;

    const request = await PremiumRequest.create({
      userId: req.user._id,
      name,
      email,
      whatsapp,
      message,
    });

    res.status(201).json({
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET ALL REQUESTS
export const getAllRequests = async (req, res) => {
  try {
    const requests = await PremiumRequest.find()
      .populate("userId", "name email whatsapp")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: UPDATE STATUS + APPROVE USER
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await PremiumRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    // If approved → unlock user premium
    if (status === "approved") {
      await User.findByIdAndUpdate(request.userId, {
        isPremium: true,
      });
    }

    res.json({
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
