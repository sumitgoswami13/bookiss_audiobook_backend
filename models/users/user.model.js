const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  loginType: {
    type: String,
    enum: ['email', 'google', 'facebook'], 
    default: 'email',
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default to the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set the default to the current date
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to false, user needs to verify their email
  },
  isPremium: {
    type: Boolean,
    default: false, // Default to false, meaning the user does not have premium
  },
  premiumExpiry: {
    type: Date,
    required: false, // This will be set if the user is premium
  },
  profileImage: {
    type: String, // This will store the URL of the profile image
    required: false, // Not required initially
  },
});

// Middleware to automatically update the `updatedAt` field when the document is modified
userSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }

  if (this.isModified('password')) {
    const saltRounds = 10;
    bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return next(err); 
      }
      this.password = hashedPassword; 
      next();
    });
  } else {
    next();
  }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
