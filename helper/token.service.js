
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'yourAccessTokenSecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourRefreshTokenSecret';

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.userId, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.userId, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
};
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
const generateNewAccessToken = (refreshToken) => {
  const user = verifyRefreshToken(refreshToken);
  return generateAccessToken({ userId: user.userId, email: user.email });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateNewAccessToken,
};
