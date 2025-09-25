const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
     type: String, required: true 
  },
  email: {
     type: String, required: true, unique: true 
  },
  password: {
     type: String, required: true 
  },
  role: {
     type: String, enum: ['organizer', 'participant'], default: 'participant' 
  },
  createdAt: { type: Date, default: Date.now }
});

const model=mongoose.model('User', userSchema);

module.exports = model;
