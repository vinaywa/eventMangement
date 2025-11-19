const express = require("express");
const router = express.Router();
const {createParticipant,getParticipantById,getParticipants,updateParticipant,deleteParticipant} = require("../controllers/participantController");
const {isLogin} = require("../middleware/middleware")

router.post("/",isLogin, createParticipant);
router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.put("/:id",isLogin, updateParticipant);
router.delete("/:id",isLogin, deleteParticipant);

module.exports = router;
