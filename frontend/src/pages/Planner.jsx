import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  completeTask,
  deleteTask,
} from "../api/tasks";

function Planner({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // ================================
  // LOAD TASKS
  // ================================

  const loadTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);

    } catch (error) {
      console.error(
        "Error loading tasks:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to load tasks"
      );

    } finally {
      setLoading(false);
    }
  };


  // Load tasks when Planner opens
  useEffect(() => {
    loadTasks();
  }, []);


  // ================================
  // ADD TASK
  // ================================

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setMessage(
        "Please enter a study task"
      );
      return;
    }

    try {
      setMessage("");

      const data = await createTask({
        text: text.trim(),
        date: date,
      });

      setTasks((prevTasks) => [
        ...prevTasks,
        data.task,
      ]);

      setText("");

    } catch (error) {
      console.error(
        "Error creating task:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to create task"
      );
    }
  };


  // ================================
  // COMPLETE TASK
  // ================================

  const handleCompleteTask = async (
    taskId
  ) => {
    try {
      const data =
        await completeTask(taskId);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? data.task
            : task
        )
      );

    } catch (error) {
      console.error(
        "Error completing task:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to complete task"
      );
    }
  };


  // ================================
  // DELETE TASK
  // ================================

  const handleDeleteTask = async (
    taskId
  ) => {
    try {
      await deleteTask(taskId);

      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) =>
            task._id !== taskId
        )
      );

    } catch (error) {
      console.error(
        "Error deleting task:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to delete task"
      );
    }
  };


  // ================================
  // TASK COUNTS
  // ================================

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) => !task.completed
    ).length;


  // ================================
  // UI
  // ================================

  return (
    <div className="planner-page">

      {/* HEADER */}

      <header className="planner-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>


        <div className="planner-heading">

          <div className="planner-heading-icon">
            📝
          </div>

          <div>

            <h1>
              Study Planner
            </h1>

            <p>
              Plan your day. Complete your
              goals. Level up your skills.
            </p>

          </div>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="planner-content">


        {/* CREATE TASK */}

        <section className="planner-create-card">

          <div className="planner-section-title">

            <div className="planner-title-icon">
              🎯
            </div>

            <div>

              <h2>
                Plan Your Study
              </h2>

              <p>
                What do you want to accomplish
                today?
              </p>

            </div>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleAddTask}
            className="planner-form"
          >

            <div className="planner-input-group">

              <label>
                Study Task
              </label>

              <input
                type="text"
                placeholder="Example: Complete Binary Search problems"
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
              />

            </div>


            <div className="planner-input-group">

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


            <button
              type="submit"
              className="planner-add-button"
            >
              + Add Task
            </button>

          </form>


          {message && (

            <p className="planner-message">
              {message}
            </p>

          )}

        </section>


        {/* MY TASKS */}

        <section className="planner-tasks-card">

          <div className="planner-tasks-header">

            <div>

              <h2>
                📚 My Tasks
              </h2>

              <p>
                Stay consistent and keep
                leveling up.
              </p>

            </div>


            {/* SUMMARY */}

            <div className="planner-summary">

              <div className="summary-box">

                <strong>
                  {tasks.length}
                </strong>

                <span>
                  Total
                </span>

              </div>


              <div className="summary-box">

                <strong>
                  {pendingTasks}
                </strong>

                <span>
                  Pending
                </span>

              </div>


              <div className="summary-box completed-summary">

                <strong>
                  {completedTasks}
                </strong>

                <span>
                  Done
                </span>

              </div>

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="planner-empty">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading your tasks...
              </h3>

            </div>

          )}


          {/* NO TASKS */}

          {!loading &&
            tasks.length === 0 && (

              <div className="planner-empty">

                <div className="empty-icon">
                  📚
                </div>

                <h3>
                  No tasks yet
                </h3>

                <p>
                  Add your first study task
                  and start your journey! 🚀
                </p>

              </div>

            )}


          {/* TASK LIST */}

          {!loading &&
            tasks.length > 0 && (

              <div className="planner-task-list">

                {tasks.map(
                  (task) => (

                    <div
                      key={task._id}
                      className={
                        task.completed
                          ? "planner-task completed"
                          : "planner-task"
                      }
                    >

                      {/* COMPLETE */}

                      <button
                        className="task-complete-button"
                        onClick={() =>
                          handleCompleteTask(
                            task._id
                          )
                        }
                      >
                        {task.completed
                          ? "✓"
                          : "○"}
                      </button>


                      {/* DETAILS */}

                      <div className="planner-task-details">

                        <h3>
                          {task.text}
                        </h3>

                        <p>
                          📅 {task.date}
                        </p>

                      </div>


                      {/* STATUS */}

                      <div className="task-status">

                        {task.completed
                          ? "Completed"
                          : "Pending"}

                      </div>


                      {/* DELETE */}

                      <button
                        className="task-delete-button"
                        onClick={() =>
                          handleDeleteTask(
                            task._id
                          )
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default Planner;