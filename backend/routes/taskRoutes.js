const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  completeTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", protect, getTasks);

router.post("/", protect, createTask);

router.put("/:id", protect, completeTask);

router.delete("/:id", protect, deleteTask);

module.exports = router;