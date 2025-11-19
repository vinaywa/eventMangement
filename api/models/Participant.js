const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
   user: {
    type: String,   
    required: true
  },
  event: {
   type: String,   
  required: true
  },
  status: {
    type: String,
    default: "registered"
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Participant", participantSchema);
