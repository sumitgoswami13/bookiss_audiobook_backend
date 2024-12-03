Backend README

Overview

This repository contains the backend code for an audiobook server. The backend is built using Node.js and Express.js and provides APIs for user authentication, audiobook management, and other related functionalities. It uses MongoDB as the database and includes additional services like SQS for messaging and OTP-based email verification.

Features

User Management: Signup, login, and email verification using OTP.

Token-Based Authentication: JWT access and refresh tokens for secure user sessions.

Database: MongoDB with Mongoose for data modeling.

Queue Management: Amazon SQS for handling OTP email notifications.

Secure Passwords: Password hashing with bcrypt.

Prerequisites

Node.js: Install the latest LTS version from Node.js.

MongoDB: Ensure MongoDB is installed and running. Alternatively, use MongoDB Atlas.

AWS SQS: Set up an SQS queue for OTP messaging.

Environment Variables: Set up a .env file in the project root with the following keys:
