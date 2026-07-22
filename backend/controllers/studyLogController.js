const StudyLog = require("../models/StudyLog");


// ========================================
// GET ALL STUDY LOGS
// ========================================

const getStudyLogs = async (req, res) => {
  try {
    const logs = await StudyLog.find({
      user: req.user.id,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json(logs);

  } catch (error) {

    console.error(
      "GET STUDY LOGS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load study history",
      error: error.message,
    });
  }
};


// ========================================
// CREATE STUDY LOG
// ========================================

const createStudyLog = async (req, res) => {
  try {

    const {
      topic,
      duration,
      notes,
      date,
    } = req.body;


    if (
      !topic ||
      !duration ||
      !date
    ) {

      return res.status(400).json({
        message:
          "Topic, duration and date are required",
      });
    }


    const log =
      await StudyLog.create({

        topic:
          topic.trim(),

        duration:
          Number(duration),

        notes:
          notes
            ? notes.trim()
            : "",

        date,

        user:
          req.user.id,

      });


    res.status(201).json({

      message:
        "Study session added successfully",

      log,

    });

  } catch (error) {

    console.error(
      "CREATE STUDY LOG ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to add study session",

      error:
        error.message,

    });
  }
};


// ========================================
// DELETE STUDY LOG
// ========================================

const deleteStudyLog = async (
  req,
  res
) => {

  try {

    const log =
      await StudyLog.findOneAndDelete({

        _id:
          req.params.id,

        user:
          req.user.id,

      });


    if (!log) {

      return res.status(404).json({

        message:
          "Study session not found",

      });
    }


    res.status(200).json({

      message:
        "Study session deleted successfully",

    });

  } catch (error) {

    console.error(
      "DELETE STUDY LOG ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete study session",

      error:
        error.message,

    });
  }
};


module.exports = {

  getStudyLogs,

  createStudyLog,

  deleteStudyLog,

};