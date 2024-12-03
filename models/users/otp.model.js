const mongoose = require('mongoose');

// OTP Schema
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Email format validation
    },
    otp: {
      type: String,
      required: true,
      minlength: 6, // OTP length (usually 6 digits)
    },
    expiresAt: {
      type: Date,
      required: true, // When the OTP will expire
    },
    status: {
      type: String,
      enum: ['pending', 'used', 'expired'],
      default: 'pending', // Default status is 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set current date when OTP is generated
    },
  },
  {
    timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
  }
);

// Model to interact with OTPs
const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
