function Dashboard({
  user,
  onNavigate,
  onLogout,
}) {
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
            Welcome, {user.displayName}
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

        {/* HERO */}

        <section className="hero-card">

          <div>

            <p className="small-text">
              Welcome back 👋
            </p>

            <h1>
              Hey {user.displayName}!
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
              {user.level || 1}
            </strong>

          </div>

        </section>


        {/* =========================
            XP
        ========================= */}

        <section className="xp-card">

          <div className="xp-header">

            <span>
              Level {user.level || 1}
            </span>

            <span>
              {user.xp || 0} / {(user.level || 1) * 100} XP
            </span>

          </div>


          <div className="xp-bar">

            <div
              className="xp-progress"
              style={{
                width: `${Math.min(
                  ((user.xp || 0) /
                    ((user.level || 1) * 100)) *
                    100,
                  100
                )}%`,
              }}
            ></div>

          </div>

        </section>


        {/* =========================
            STATS
        ========================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <span>
              📚
            </span>

            <h3>
              {user.completedTasks || 0}
            </h3>

            <p>
              Tasks Done
            </p>

          </div>


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


          <div className="stat-card">

            <span>
              🔥
            </span>

            <h3>
              {user.streak || 0}
            </h3>

            <p>
              Day Streak
            </p>

          </div>


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


          {/* COLLECTION */}

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