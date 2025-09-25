const Participant = require("../models/Participant");
const User = require("../models/User");

exports.createParticipant = async (req, res) => {
  const { user, event } = req.body;

  // Check if participant already exists
  const existingParticipant = await Participant.findOne({ user, event });
  if (existingParticipant) {
    return res.json({
      success: false,
      message: "User is already registered for this event",
    });
  }

  const existingUser = await User.findOne({ name: user });
  if (!existingUser) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  if (existingUser.role === "organizer") {
    return res.json({
      success: false,
      message: "Organizers cannot be participants",
    });
  }

  const participant = new Participant(req.body);
  await participant.save();

  return res.json({
    success: true,
    data: participant,
  });
};


exports.getParticipants = async (req, res) => {
  const participants = await Participant.find();
  return res.json({
    success: true,
    data: participants,
  });
};


exports.getParticipantById = async (req, res) => {
  const participant = await Participant.findById(req.params.id);

  if (participant) {
    return res.json({
      success: true,
      data: participant,
    });
  }

  return res.json({
    success: false,
    message: "Participant not found",
  });
};


exports.updateParticipant = async (req, res) => {
  const participant = await Participant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (participant) {
    return res.json({
      success: true,
      data: participant,
    });
  }

  return res.json({
    success: false,
    message: "Participant not found",
  });
};

exports.deleteParticipant = async (req, res) => {
  const participant = await Participant.findByIdAndDelete(req.params.id);

  if (participant) {
    return res.json({
      success: true,
      message: "Participant deleted",
    });
  }

  return res.json({
    success: false,
    message: "Participant not found",
  });
};
