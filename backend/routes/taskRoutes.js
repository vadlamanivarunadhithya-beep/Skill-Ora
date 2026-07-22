const express = require("express");

const {
  getTasks,
  createTask,
  completeTask,
  deleteTask,
} = require(
  "../controllers/taskController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ========================================
// GET ALL TASKS
// GET /api/tasks
// ========================================

router.get(
  "/",
  authMiddleware,
  getTasks
);


// ========================================
// CREATE TASK
// POST /api/tasks
// ========================================

router.post(
  "/",
  authMiddleware,
  createTask
);


// ========================================
// COMPLETE / UNCOMPLETE TASK
// PUT /api/tasks/:id
// ========================================

router.put(
  "/:id",
  authMiddleware,
  completeTask
);


// ========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteTask
);


module.exports = router;