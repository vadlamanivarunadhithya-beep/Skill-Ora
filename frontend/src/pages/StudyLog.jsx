import { useEffect, useState } from "react";
import {
  getStudyLogs,
  createStudyLog,
  deleteStudyLog,
} from "../api/studyLogs";

import "./StudyLog.css";

function StudyLog() {
  const [logs, setLogs] = useState([]);

  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ========================================
  // LOAD STUDY LOGS
  // ========================================

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudyLogs();

      setLogs(data);

    } catch (error) {
      console.error(error);

      setError("Failed to load study history");

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // LOAD WHEN PAGE OPENS
  // ========================================

  useEffect(() => {
    loadLogs();
  }, []);


  // ========================================
  // ADD STUDY LOG
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter what you studied");
      return;
    }

    if (!duration || Number(duration) <= 0) {
      setError("Please enter a valid study duration");
      return;
    }

    try {
      setError("");

      const data = await createStudyLog({
        topic: topic.trim(),
        duration: Number(duration),
        notes: notes.trim(),
        date,
      });

      setLogs((prevLogs) => [
        data.log,
        ...prevLogs,
      ]);

      // Clear form

      setTopic("");
      setDuration("");
      setNotes("");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to add study session"
      );
    }
  };


  // ========================================
  // DELETE STUDY LOG
  // ========================================

  const handleDelete = async (id) => {
    try {

      await deleteStudyLog(id);

      setLogs((prevLogs) =>
        prevLogs.filter(
          (log) => log._id !== id
        )
      );

    } catch (error) {
      console.error(error);

      setError("Failed to delete study session");
    }
  };


  // ========================================
  // TOTAL STUDY TIME
  // ========================================

  const totalMinutes = logs.reduce(
    (total, log) =>
      total + Number(log.duration || 0),
    0
  );


  return (
    <div className="study-log-page">

      {/* HEADER */}

      <header className="study-log-header">

        <button
          className="back-button"
          onClick={() =>
            window.location.href = "/"
          }
        >
          ← Dashboard
        </button>

        <div className="study-log-title">

          <div className="study-log-icon">
            📖
          </div>

          <div>
            <h1>Study Log</h1>

            <p>
              Record what you actually studied
              and track your learning journey.
            </p>
          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="study-log-container">

        {/* FORM */}

        <section className="study-log-form-card">

          <div className="section-heading">

            <span>📚</span>

            <div>
              <h2>Log Your Study Session</h2>

              <p>
                Keep track of what you learned today.
              </p>
            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                What did you study?
              </label>

              <input
                type="text"
                placeholder="Example: Python Functions"
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value)
                }
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Study Duration
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="60"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                />

                <small>
                  Enter duration in minutes
                </small>

              </div>


              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                What did you learn?
              </label>

              <textarea
                placeholder="Write a short note about what you learned..."
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows="4"
              />

            </div>


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="add-study-button"
            >
              + Add Study Session
            </button>

          </form>

        </section>


        {/* STATS */}

        <section className="study-stats">

          <div className="stat-card">

            <span>📚</span>

            <div>
              <strong>
                {logs.length}
              </strong>

              <p>
                Sessions
              </p>
            </div>

          </div>


          <div className="stat-card">

            <span>⏱️</span>

            <div>
              <strong>
                {totalMinutes}
              </strong>

              <p>
                Minutes Studied
              </p>
            </div>

          </div>


          <div className="stat-card">

            <span>🔥</span>

            <div>
              <strong>
                {Math.floor(
                  totalMinutes / 60
                )}
              </strong>

              <p>
                Hours Studied
              </p>
            </div>

          </div>

        </section>


        {/* HISTORY */}

        <section className="study-history">

          <div className="history-header">

            <div>

              <h2>
                📚 Your Study History
              </h2>

              <p>
                Stay consistent and keep
                track of your progress.
              </p>

            </div>

          </div>


          {loading ? (

            <div className="empty-state">
              Loading your study history...
            </div>

          ) : logs.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📖
              </div>

              <h3>
                No study sessions yet
              </h3>

              <p>
                Log your first study session
                and start building your history!
              </p>

            </div>

          ) : (

            <div className="study-log-list">

              {logs.map((log) => (

                <div
                  className="study-log-item"
                  key={log._id}
                >

                  <div className="log-icon">
                    📖
                  </div>


                  <div className="log-content">

                    <h3>
                      {log.topic}
                    </h3>

                    <div className="log-meta">

                      <span>
                        📅 {log.date}
                      </span>

                      <span>
                        ⏱️ {log.duration} minutes
                      </span>

                    </div>


                    {log.notes && (

                      <p className="log-notes">
                        {log.notes}
                      </p>

                    )}

                  </div>


                  <button
                    className="delete-log-button"
                    onClick={() =>
                      handleDelete(log._id)
                    }
                  >
                    🗑️
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default StudyLog;