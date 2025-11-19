const express = require("express");
const router = express.Router();
const {createEvent,getEventById,getEvents,updateEvent,deleteEvent} = require("../controllers/eventController");
const {isLogin} = require("../middleware/middleware")

router.post("/",isLogin, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/:id",isLogin, updateEvent);
router.delete("/:id",isLogin, deleteEvent);

module.exports = router;
