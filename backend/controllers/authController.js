const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        xp: user.xp,
        level: user.level,
        completedTasks: user.completedTasks,
        streak: user.streak,
        lastStudyDate: user.lastStudyDate
      }
    });

  } catch (error) {
    console.error("GET ME ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message
    });
  }
};


const signup = async (req, res) => {
  try {
    const {
      username,
      password,
      displayName
    } = req.body;

    if (!username || !password || !displayName) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const cleanUsername =
      username.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        username: cleanUsername
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        username: cleanUsername,
        password: hashedPassword,
        displayName: displayName.trim()
      });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        xp: user.xp,
        level: user.level,
        completedTasks: user.completedTasks,
        streak: user.streak
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      message: "Signup failed",
      error: error.message
    });
  }
};


const login = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const cleanUsername =
      username.trim().toLowerCase();

    const user =
      await User.findOne({
        username: cleanUsername
      });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token =
      jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        xp: user.xp,
        level: user.level,
        completedTasks: user.completedTasks,
        streak: user.streak
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};


module.exports = {
  getMe,
  signup,
  login
};