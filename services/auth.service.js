const User = require('../models/User'); 
const tokenService = require('../helper/token.service');
const { sendToQueue } = require('../helper/sqs.service')
const bcrypt = require('bcryptjs');

const emailSignup = async (body) => {
  const { userName, email, password } = body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { status: 'error', message: 'Email already in use' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const otp = generateOTP();
    const otpRecord = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    });

    await otpRecord.save();
    const otpMessage = {
      type: 'sendsignupverificationEmail', 
      email: email,                         
      otp: otp,                        
    };
    await sendToQueue(otpMessage);
    return {
      message: 'OTP has been sent to your email',
    };
  } catch (err) {
    console.error(err);
    throw new Error('Error during signup: ' + err.message);
  }
};


const emailLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return 'User not found';
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return 'Invalid credentials';
    }
    const accessToken = tokenService.generateAccessToken({ email: user.email, userId: user._id });
    const refreshToken = tokenService.generateRefreshToken({ email: user.email, userId: user._id });
    return { accessToken, refreshToken };
  } catch (err) {
   throw new Error ('Error during login: ' + err.message);
  }
};
  const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send('No refresh token provided');
    }
    try {
      const user = tokenService.verifyRefreshToken(token);
      const newAccessToken = tokenService.generateAccessToken({ email: user.email, userId: user.userId });

      return { accessToken: newAccessToken };
    } catch (err) {
      res.status(403).send('Invalid or expired refresh token');
    }
  };

module.exports = {
  emailSignup,
  emailLogin,
  refreshToken,
};
