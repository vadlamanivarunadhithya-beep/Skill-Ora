const User = require("../models/User");


// ========================================
// XP REWARDS
// ========================================

const XP_REWARDS = {
  TASK_COMPLETED: 10,
  STUDY_30_MINUTES: 5,
  STUDY_60_MINUTES: 10,
  DAILY_GOAL: 5,
};


// ========================================
// REQUIRED XP FOR NEXT LEVEL
// ========================================

const getRequiredXP = (level) => {
  return 100 + (level - 1) * 150;
};


// ========================================
// ADD XP TO USER
// ========================================

const addXP = async (userId, amount) => {
  try {

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }


    // Add XP

    user.xp += amount;


    // Check level up

    let levelUp = false;

    while (
      user.xp >= getRequiredXP(user.level)
    ) {

      user.level += 1;

      levelUp = true;

    }


    // Save updated user

    await user.save();


    return {
      xp: user.xp,
      level: user.level,
      levelUp: levelUp,
    };


  } catch (error) {

    console.error(
      "XP SYSTEM ERROR:",
      error
    );

    throw error;

  }
};


// ========================================
// CALCULATE STUDY XP
// ========================================

const calculateStudyXP = (duration) => {

  const minutes = Number(duration);


  if (minutes >= 60) {
    return XP_REWARDS.STUDY_60_MINUTES;
  }


  if (minutes >= 30) {
    return XP_REWARDS.STUDY_30_MINUTES;
  }


  return 0;
};


// ========================================
// EXPORT EVERYTHING
// ========================================

module.exports = {
  XP_REWARDS,
  getRequiredXP,
  addXP,
  calculateStudyXP,
};