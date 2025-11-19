const Event = require("../models/Event");
const User = require("../models/User");

//create event means as an organizer you can create event 
exports.createEvent = async (req, res) => {
  const { title, organizer } = req.body;

  const validUser = await User.findById(organizer);
  // console.log(validUser);

  if (!validUser) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  if (validUser.role === "participant") {
    return res.json({
      success: false,
      message: "Participant cannot be organizers",
    });
  }

  const existingEvent = await Event.findOne({ title, organizer });
  if (existingEvent) {
    return res.json({
      success: false,
      message: "This organiser already has an event with this title",
    });
  }

  const event = new Event(req.body);
  await event.save();

  return res.json({
    success: true,
    data: event,
  });
};


exports.getEvents = async (req, res) => {
  const events = await Event.find();

  return { events }; 
};


exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    return { event };  // return data, DO NOT send response
  }

  return { event: null };
};



exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (event) {
    return res.json({
      success: true,
      data: event,
    });
  }

  return res.json({
    success: false,
    message: "Event not found",
  });
};


exports.deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (event) {
    return res.json({
      success: true,
      message: "Event deleted",
    });
  }

  return res.json({
    success: false,
    message: "Event not found",
  });
};
