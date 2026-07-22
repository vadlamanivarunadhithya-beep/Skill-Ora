const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================================
    // XP SYSTEM
    // ================================

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);


// ================================
// HASH PASSWORD BEFORE SAVING
// ================================

userSchema.pre(
  "save",
  async function (next) {

    // If password hasn't changed,
    // don't hash it again

    if (!this.isModified("password")) {
      return next();
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );

    next();
  }
);


// ================================
// CHECK PASSWORD
// ================================

userSchema.methods.comparePassword =
  async function (enteredPassword) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


module.exports =
  mongoose.model(
    "User",
    userSchema
  );