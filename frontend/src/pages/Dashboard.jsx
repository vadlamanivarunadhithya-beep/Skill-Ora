import { useEffect, useState } from "react";

function Dashboard({
  user,
  onNavigate,
  onLogout,
}) {
  const [currentUser, setCurrentUser] = useState(user);

  // ========================================
  // GET LATEST USER DATA
  // ========================================

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch latest user data");
          return;
        }

        const data = await response.json();

        const latestUser = data.user || data;

        setCurrentUser(latestUser);
      } catch (error) {
        console.error("USER DATA ERROR:", error);
      }
    };

    fetchUserData();
  }, []);

  // ========================================
  // USER DATA
  // ========================================

  const displayUser = currentUser || user;

  const level = displayUser?.level || 1;

  const xp = displayUser?.xp || 0;

  // ========================================
  // XP CALCULATION
  // ========================================

  const requiredXP = level * 100;

  const remainingXP = Math.max(
    requiredXP - xp,
    0
  );

  const xpProgress = Math.min(
    (xp / requiredXP) * 100,
    100
  );

  // ========================================
  // RETURN
  // ========================================

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div className="logo">
          Skill-Oraa
        </div>

        <div className="nav-right">

          <span>
            Welcome, {displayUser?.displayName}
          </span>

          <button
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          DASHBOARD
      ========================= */}

      <main className="dashboard">


        {/* =========================
            HERO CARD
        ========================= */}

        <section className="hero-card">

          <div>

            <p className="small-text">
              Welcome back 👋
            </p>

            <h1>
              Hey {displayUser?.displayName}!
            </h1>

            <p>
              Ready to level up your skills today?
            </p>

          </div>


          <div className="level-badge">

            <span>
              LEVEL
            </span>

            <strong>
              {level}
            </strong>

          </div>

        </section>


        {/* =========================
            XP CARD
        ========================= */}

        <section className="xp-card">

          <div className="xp-header">

            <span>
              Level {level}
            </span>

            <span>
              {xp} / {requiredXP} XP
            </span>

          </div>


          {/* XP PROGRESS BAR */}

          <div className="xp-bar">

            <div
              className="xp-progress"
              style={{
                width: `${xpProgress}%`,
              }}
            ></div>

          </div>


          {/* XP NEEDED */}

          <p className="xp-needed">

            {remainingXP > 0
              ? `${remainingXP} XP needed for Level ${level + 1}`
              : "🎉 Level Up!"}

          </p>

        </section>


        {/* =========================
            STATS
        ========================= */}

        <section className="stats-grid">


          {/* TASKS DONE */}

          <div className="stat-card">

            <span>
              📚
            </span>

            <h3>
              {displayUser?.completedTasks || 0}
            </h3>

            <p>
              Tasks Done
            </p>

          </div>


          {/* CARDS COLLECTED */}

          <div className="stat-card">

            <span>
              🃏
            </span>

            <h3>
              0
            </h3>

            <p>
              Cards Collected
            </p>

          </div>


          {/* DAY STREAK */}

          <div className="stat-card">

            <span>
              🔥
            </span>

            <h3>
              {displayUser?.streak || 0}
            </h3>

            <p>
              Day Streak
            </p>

          </div>


          {/* FRIENDS */}

          <div className="stat-card">

            <span>
              👥
            </span>

            <h3>
              0
            </h3>

            <p>
              Friends
            </p>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section className="feature-grid">


          {/* CALENDAR */}

          <div className="feature-card">

            <div className="feature-icon">
              📅
            </div>

            <h2>
              Calendar
            </h2>

            <p>
              Plan your study schedule
              and track your progress.
            </p>

            <button
              onClick={() =>
                onNavigate("calendar")
              }
            >
              Open Calendar
            </button>

          </div>


          {/* STUDY PLANNER */}

          <div className="feature-card">

            <div className="feature-icon">
              📝
            </div>

            <h2>
              Study Planner
            </h2>

            <p>
              Create tasks and complete
              your daily study goals.
            </p>

            <button
              onClick={() =>
                onNavigate("planner")
              }
            >
              Open Planner
            </button>

          </div>


          {/* STUDY LOG */}

          <div className="feature-card">

            <div className="feature-icon">
              📖
            </div>

            <h2>
              Study Log
            </h2>

            <p>
              Keep track of everything
              you studied.
            </p>

            <button
              onClick={() =>
                onNavigate("studylog")
              }
            >
              Open Study Log
            </button>

          </div>


          {/* CARD COLLECTION */}

          <div className="feature-card">

            <div className="feature-icon">
              🃏
            </div>

            <h2>
              Card Collection
            </h2>

            <p>
              Unlock exciting football,
              cricket and actor cards.
            </p>

            <button
              onClick={() =>
                onNavigate("collection")
              }
            >
              Open Collection
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;