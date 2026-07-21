import { useEffect, useState } from "react";
import axios from "axios";

function Calendar({ onBack }) {

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(false);


  // =========================================
  // MONTH DATA
  // =========================================

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  // =========================================
  // GET TASKS FROM BACKEND
  // =========================================

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data);

    } catch (error) {

      console.error(
        "Error fetching tasks:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD TASKS
  // =========================================

  useEffect(() => {

    fetchTasks();

  }, []);


  // =========================================
  // CALENDAR CALCULATION
  // =========================================

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();


  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();


  const calendarDays = [];


  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    calendarDays.push(null);

  }


  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    calendarDays.push(day);

  }


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
  // DATE FORMAT
  // =========================================

  const formatDate = (
    date
  ) => {

    const y =
      date.getFullYear();

    const m =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const d =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${y}-${m}-${d}`;

  };


  // =========================================
  // CHECK TODAY
  // =========================================

  const today =
    new Date();


  const isToday = (
    day
  ) => {

    return (
      day ===
        today.getDate() &&

      month ===
        today.getMonth() &&

      year ===
        today.getFullYear()
    );

  };


  // =========================================
  // GET TASKS FOR SELECTED DATE
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


  // =========================================
  // CHECK WHETHER DATE HAS TASK
  // =========================================

  const hasTasks = (
    day
  ) => {

    const date =
      new Date(
        year,
        month,
        day
      );

    const dateString =
      formatDate(date);

    return tasks.some(
      (task) =>
        task.date ===
        dateString
    );

  };


  // =========================================
  // SELECT DATE
  // =========================================

  const handleDateClick = (
    day
  ) => {

    const clickedDate =
      new Date(
        year,
        month,
        day
      );

    setSelectedDate(
      clickedDate
    );

  };


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


        <div className="calendar-title">

          <div className="calendar-icon">
            📅
          </div>


          <div>

            <h1>
              Calendar
            </h1>

            <p>
              Plan your study schedule
              and track your progress.
            </p>

          </div>

        </div>

      </header>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="calendar-content">


        {/* ===================================
            CALENDAR
        ==================================== */}

        <section className="calendar-card">


          {/* MONTH HEADER */}

          <div className="calendar-top">

            <button
              className="month-button"
              onClick={
                previousMonth
              }
            >
              ←
            </button>


            <h2>

              {monthNames[month]}

              {" "}

              {year}

            </h2>


            <button
              className="month-button"
              onClick={
                nextMonth
              }
            >
              →
            </button>

          </div>


          {/* WEEK DAYS */}

          <div className="weekdays">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map(
              (day) => (

                <div
                  key={day}
                  className="weekday"
                >
                  {day}
                </div>

              )
            )}

          </div>


          {/* CALENDAR DAYS */}

          <div className="calendar-grid">

            {calendarDays.map(
              (
                day,
                index
              ) => (

                <div
                  key={index}

                  onClick={() =>
                    day &&
                    handleDateClick(day)
                  }

                  className={

                    day &&
                    isToday(day)

                      ? "calendar-day today"

                      : day &&
                        formatDate(
                          new Date(
                            year,
                            month,
                            day
                          )
                        ) ===
                          selectedDateString

                        ? "calendar-day selected"

                        : "calendar-day"

                  }
                >

                  {day && (

                    <>

                      <span>
                        {day}
                      </span>


                      {/* TODAY */}

                      {isToday(day) && (

                        <small>
                          Today
                        </small>

                      )}


                      {/* TASK DOT */}

                      {hasTasks(day) && (

                        <div className="task-dot">
                          ●
                        </div>

                      )}

                    </>

                  )}

                </div>

              )
            )}

          </div>

        </section>


        {/* ===================================
            SELECTED DATE TASKS
        ==================================== */}

        <section className="calendar-tasks">


          <div className="calendar-task-header">

            <div>

              <h2>
                📚 Study Tasks
              </h2>

              <p>
                {selectedDateString}
              </p>

            </div>


            <div className="calendar-task-count">

              {selectedTasks.length}

              <span>
                Tasks
              </span>

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="calendar-empty">

              <p>
                Loading tasks...
              </p>

            </div>

          )}


          {/* NO TASKS */}

          {!loading &&
            selectedTasks.length === 0 && (

              <div className="calendar-empty">

                <div>
                  📚
                </div>

                <h3>
                  No tasks for this day
                </h3>

                <p>
                  Go to Study Planner
                  and create a task
                  for this date.
                </p>

              </div>

            )}


          {/* TASKS */}

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

                      <div className="task-status">

                        {task.completed
                          ? "✓"
                          : "📚"}

                      </div>


                      <div className="task-info">

                        <h3>
                          {task.text}
                        </h3>

                        <p>
                          {task.completed
                            ? "Completed"
                            : "Pending"}
                        </p>

                      </div>

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

export default Calendar;