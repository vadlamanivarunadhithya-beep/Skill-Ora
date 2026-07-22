const express = require("express");

const {
  getStudyLogs,
  createStudyLog,
  deleteStudyLog,
} = require(
  "../controllers/studyLogController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );


const router =
  express.Router();


// ========================================
// GET ALL STUDY LOGS
// GET /api/study-logs
// ========================================

router.get(
  "/",
  authMiddleware,
  getStudyLogs
);


// ========================================
// CREATE STUDY LOG
// POST /api/study-logs
// ========================================

router.post(
  "/",
  authMiddleware,
  createStudyLog
);


// ========================================
// DELETE STUDY LOG
// DELETE /api/study-logs/:id
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteStudyLog
);


module.exports =
  router;