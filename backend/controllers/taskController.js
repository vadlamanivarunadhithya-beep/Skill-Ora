const Task = require("../models/Task");

const {
  addXP,
  XP_REWARDS,
} = require("../utils/xpSystem");


// ========================================
// GET TASKS
// ========================================

const getTasks = async (req, res) => {
  try {

    const userId = req.user.id;

    const tasks = await Task.find({
      user: userId,
    }).sort({
      date: 1,
      createdAt: -1,
    });

    res.status(200).json(tasks);

  } catch (error) {

    console.error(
      "GET TASKS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to load tasks",
      error: error.message,
    });

  }
};


// ========================================
// CREATE TASK
// ========================================

const createTask = async (req, res) => {
  try {

    const {
      text,
      date,
    } = req.body;


    // Validate input

    if (!text || !date) {

      return res.status(400).json({
        message:
          "Task text and date are required",
      });

    }


    // Create task

    const task = await Task.create({

      text:
        text.trim(),

      date:
        date,

      completed:
        false,

      user:
        req.user.id,

    });


    // Send response

    res.status(201).json({

      message:
        "Task created successfully",

      task:
        task,

    });

  } catch (error) {

    console.error(
      "CREATE TASK ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create task",

      error:
        error.message,

    });

  }
};


// ========================================
// COMPLETE / UNCOMPLETE TASK
// ========================================

const completeTask = async (
  req,
  res
) => {

  try {

    // Find task belonging to
    // logged-in user

    const task = await Task.findOne({

      _id:
        req.params.id,

      user:
        req.user.id,

    });


    // Check task

    if (!task) {

      return res.status(404).json({

        message:
          "Task not found",

      });

    }


    // ====================================
    // CHECK OLD STATUS
    // ====================================

    const wasCompleted =
      task.completed;


    // ====================================
    // TOGGLE TASK STATUS
    // ====================================

    task.completed =
      !task.completed;


    // Save task

    await task.save();


    // ====================================
    // XP RESULT
    // ====================================

    let xpResult = null;


    // ====================================
    // AWARD XP WHEN TASK IS COMPLETED
    // ====================================

    if (
      !wasCompleted &&
      task.completed
    ) {

      xpResult = await addXP(

        req.user.id,

        XP_REWARDS.TASK_COMPLETED

      );


      // Show XP result
      // in backend terminal

      console.log(
        "⭐ XP AWARDED:",
        xpResult
      );

    }


    // ====================================
    // RESPONSE
    // ====================================

    res.status(200).json({

      message:
        "Task status updated successfully",

      task:
        task,

      xp:
        xpResult,

    });


  } catch (error) {

    console.error(
      "COMPLETE TASK ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to update task",

      error:
        error.message,

    });

  }
};


// ========================================
// DELETE TASK
// ========================================

const deleteTask = async (
  req,
  res
) => {

  try {

    // Find and delete task
    // belonging to logged-in user

    const task =
      await Task.findOneAndDelete({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    // Check task

    if (!task) {

      return res.status(404).json({

        message:
          "Task not found",

      });

    }


    // Response

    res.status(200).json({

      message:
        "Task deleted successfully",

    });


  } catch (error) {

    console.error(
      "DELETE TASK ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete task",

      error:
        error.message,

    });

  }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

  getTasks,

  createTask,

  completeTask,

  deleteTask,

};