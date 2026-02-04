// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    message: { type: String },
    type: { type: String, enum: ['contact', 'application'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
