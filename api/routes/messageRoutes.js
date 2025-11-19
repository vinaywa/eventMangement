const express = require("express");
const router = express.Router();
const redis = require("redis");
const Event = require("../models/Event");
const Participant = require("../models/Participant");
const messageQueue = require("../queue/messageQueue");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Simple Redis publisher
const pub = redis.createClient({ url: "redis://127.0.0.1:6379" });
pub.connect();

// Middleware to check login using your existing logic
const { isLogin } = require("../middleware/middleware");

// Send message to event room
router.post("/:eventId", isLogin, async (req, res) => {
    const eventId = req.params.eventId;
    const { message } = req.body;

    let userId = req.userId;  

    // Find user
    let user = await User.findById(userId);

    // Check if organizer
    let event = await Event.findById(eventId);
    if (!event) {
        return res.json({ success: false, message: "Event not found" });
    }

    let isOrganizer = (String(event.organizer) === String(userId));

    // Check participation
    let isParticipant = await Participant.findOne({
        user: String(userId),
        event: String(eventId),
    });

    if (!isOrganizer && !isParticipant) {
        return res.json({
            success: false,
            message: "Only organizer or participants can send message",
        });
    }

    // Publish message to Redis
    let payload = {
        eventId,
        userId,
        senderName: user.name,
        message,
        time: new Date()
    };

    await pub.publish("event_messages", JSON.stringify(payload));

    await messageQueue.add("sendMessage", {
    eventId,
    userId,
    message,
    senderName: user.name
    });

    res.json({
        success: true,
        message: "Message sent"
    });
});


module.exports = router;
