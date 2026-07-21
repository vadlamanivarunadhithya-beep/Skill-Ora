const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// SIGNUP USER
// ===============================
const signup = async (req, res) => {
  try {
    // Get data from request body
    const { username, password, displayName } = req.body;

    // Check if all fields are provided
    if (!username || !password || !displayName) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Convert username to lowercase
    const cleanUsername = username.trim().toLowerCase();

    // Check if username already exists
    const existingUser = await User.findOne({
      username: cleanUsername
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username: cleanUsername,
      password: hashedPassword,
      displayName: displayName.trim()
    });

    // Send successful response
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


// ===============================
// LOGIN USER
// ===============================
const login = async (req, res) => {
  try {
    // Get login data
    const { username, password } = req.body;

    // Check if fields are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // Convert username to lowercase
    const cleanUsername = username.trim().toLowerCase();

    // Find user in MongoDB
    const user = await User.findOne({
      username: cleanUsername
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // Check password
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Send login response
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


// ===============================
// EXPORT FUNCTIONS
// ===============================
module.exports = {
  signup,
  login
};