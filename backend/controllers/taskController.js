const Task = require("../models/Task");

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId
    }).sort({
      createdAt: -1
    });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get tasks",
      error: error.message
    });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { text, date } = req.body;

    if (!text || !date) {
      return res.status(400).json({
        message: "Task text and date are required"
      });
    }

    const task = await Task.create({
      user: req.userId,
      text,
      date
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
};

// Complete / uncomplete task
const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  completeTask,
  deleteTask
};