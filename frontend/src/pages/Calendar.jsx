import { useEffect, useState } from "react";
import {
  getTasks,
  completeTask,
} from "../api/tasks";

function Calendar({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [loading, setLoading] = useState(true);


  // =========================================
  // LOAD TASKS
  // =========================================

  const loadTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);

    } catch (error) {
      console.error(
        "Error loading calendar tasks:",
        error
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTasks();
  }, []);


  // =========================================
  // MONTH INFORMATION
  // =========================================

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();


  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  // =========================================
  // CHANGE MONTH
  // =========================================

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };


  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };


  // =========================================
  // TODAY CHECK
  // =========================================

  const isToday = (day) => {

    const today = new Date();

    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (
    date
  ) => {

    const y =
      date.getFullYear();

    const m = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
      date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };


  // =========================================
  // SELECT DATE
  // =========================================

  const handleDateClick = (
    day
  ) => {

    setSelectedDate(
      new Date(
        year,
        month,
        day
      )
    );
  };


  // =========================================
  // GET SELECTED DATE TASKS
  // =========================================

  const selectedDateString =
    formatDate(
      selectedDate
    );


  const selectedTasks =
    tasks.filter(
      (task) =>
        task.date ===
        selectedDateString
    );


  const completedTasks =
    selectedTasks.filter(
      (task) =>
        task.completed
    );


  const pendingTasks =
    selectedTasks.filter(
      (task) =>
        !task.completed
    );


  const progress =
    selectedTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length /
            selectedTasks.length) *
            100
        );


  // =========================================
  // COMPLETE TASK
  // =========================================

  const handleCompleteTask =
    async (taskId) => {

      try {

        const data =
          await completeTask(
            taskId
          );

        setTasks(
          (prevTasks) =>
            prevTasks.map(
              (task) =>
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

      }
    };


  // =========================================
  // TASK COUNT FOR CALENDAR DAY
  // =========================================

  const getTasksForDay =
    (day) => {

      const date =
        `${year}-${String(
          month + 1
        ).padStart(
          2,
          "0"
        )}-${String(day).padStart(
          2,
          "0"
        )}`;

      return tasks.filter(
        (task) =>
          task.date === date
      );
    };


  // =========================================
  // CALENDAR CELLS
  // =========================================

  const calendarDays = [];


  // Empty cells before month starts

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    calendarDays.push(
      <div
        key={`empty-${i}`}
        className="calendar-day empty"
      ></div>
    );

  }


  // Actual days

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const dayTasks =
      getTasksForDay(
        day
      );


    const completed =
      dayTasks.filter(
        (task) =>
          task.completed
      ).length;


    const allCompleted =
      dayTasks.length > 0 &&
      completed ===
        dayTasks.length;


    const hasPending =
      dayTasks.some(
        (task) =>
          !task.completed
      );


    calendarDays.push(

      <div
        key={day}
        className={`
          calendar-day
          ${
            isToday(day)
              ? "today"
              : ""
          }
          ${
            selectedDate.getDate() ===
              day &&
            selectedDate.getMonth() ===
              month &&
            selectedDate.getFullYear() ===
              year
              ? "selected"
              : ""
          }
        `}
        onClick={() =>
          handleDateClick(
            day
          )
        }
      >

        <span className="day-number">
          {day}
        </span>


        {/* TASK INDICATOR */}

        {dayTasks.length > 0 && (

          <div className="day-task-info">

            {allCompleted && (
              <span className="day-status complete">
                ✓
              </span>
            )}

            {hasPending && (
              <span className="day-status pending">
                {dayTasks.length}
              </span>
            )}

          </div>

        )}

      </div>

    );

  }


  return (

    <div className="calendar-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="calendar-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>


        <div className="calendar-heading">

          <div className="calendar-heading-icon">
            📅
          </div>

          <div>

            <h1>
              Study Calendar
            </h1>

            <p>
              Plan your days. Track your
              progress. Stay consistent.
            </p>

          </div>

        </div>

      </header>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="calendar-content">


        {/* ===================================
            CALENDAR CARD
        ==================================== */}

        <section className="calendar-card">


          {/* MONTH HEADER */}

          <div className="calendar-month-header">

            <button
              className="month-arrow"
              onClick={
                previousMonth
              }
            >
              ←
            </button>


            <div>

              <h2>
                {monthName}
              </h2>

              <span>
                {year}
              </span>

            </div>


            <button
              className="month-arrow"
              onClick={
                nextMonth
              }
            >
              →
            </button>

          </div>


          {/* WEEK DAYS */}

          <div className="calendar-weekdays">

            <span>
              Sun
            </span>

            <span>
              Mon
            </span>

            <span>
              Tue
            </span>

            <span>
              Wed
            </span>

            <span>
              Thu
            </span>

            <span>
              Fri
            </span>

            <span>
              Sat
            </span>

          </div>


          {/* CALENDAR GRID */}

          <div className="calendar-grid">

            {calendarDays}

          </div>


          {/* LEGEND */}

          <div className="calendar-legend">

            <div>
              <span className="legend-dot today-dot"></span>
              Today
            </div>

            <div>
              <span className="legend-dot task-dot"></span>
              Tasks
            </div>

            <div>
              <span className="legend-dot complete-dot"></span>
              Completed
            </div>

          </div>

        </section>


        {/* ===================================
            DAILY PROGRESS CARD
        ==================================== */}

        <section className="daily-progress-card">


          <div className="selected-date-header">

            <div>

              <h2>
                📚 Daily Progress
              </h2>

              <p>
                {selectedDate.toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>

            </div>


            <div className="progress-circle">

              <strong>
                {progress}%
              </strong>

            </div>

          </div>


          {/* PROGRESS BAR */}

          <div className="progress-bar-background">

            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>


          {/* STATS */}

          <div className="daily-stats">

            <div className="daily-stat">

              <strong>
                {selectedTasks.length}
              </strong>

              <span>
                Total Tasks
              </span>

            </div>


            <div className="daily-stat">

              <strong className="green">
                {completedTasks.length}
              </strong>

              <span>
                Completed
              </span>

            </div>


            <div className="daily-stat">

              <strong className="yellow">
                {pendingTasks.length}
              </strong>

              <span>
                Pending
              </span>

            </div>

          </div>

        </section>


        {/* ===================================
            SELECTED DATE TASKS
        ==================================== */}

        <section className="calendar-tasks-card">


          <h2>
            📝 Tasks for This Day
          </h2>


          {loading && (

            <div className="calendar-empty">

              <p>
                Loading tasks...
              </p>

            </div>

          )}


          {!loading &&
            selectedTasks.length === 0 && (

              <div className="calendar-empty">

                <div>
                  📚
                </div>

                <h3>
                  No tasks planned
                </h3>

                <p>
                  You have no study tasks
                  scheduled for this day.
                </p>

              </div>

            )}


          {!loading &&
            selectedTasks.length > 0 && (

              <div className="calendar-task-list">

                {selectedTasks.map(
                  (task) => (

                    <div
                      key={task._id}
                      className={
                        task.completed
                          ? "calendar-task completed"
                          : "calendar-task"
                      }
                    >

                      <button
                        className="calendar-complete-button"
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


                      <div className="calendar-task-info">

                        <h3>
                          {task.text}
                        </h3>

                        <p>
                          📅 {task.date}
                        </p>

                      </div>


                      <span
                        className={
                          task.completed
                            ? "calendar-task-status done"
                            : "calendar-task-status"
                        }
                      >

                        {task.completed
                          ? "Completed"
                          : "Pending"}

                      </span>

                    </div>

                  )
                )}

              </div>

            )}

        </section>


        {/* ===================================
            STUDY INSIGHT
        ==================================== */}

        <section className="calendar-insight">

          <div className="insight-icon">
            🔥
          </div>

          <div>

            <h3>
              Keep your momentum going!
            </h3>

            <p>
              Complete your planned tasks
              every day to build your study
              streak and earn more XP.
            </p>

          </div>

        </section>


      </main>

    </div>

  );
}

export default Calendar;