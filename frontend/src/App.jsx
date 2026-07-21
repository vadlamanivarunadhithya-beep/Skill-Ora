import { useState } from "react";
import { signupUser, loginUser } from "./api/auth";
import "./App.css";

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [message, setMessage] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login / Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        const data = await signupUser({
          username,
          password,
          displayName,
        });

        setMessage(data.message);

        setUsername("");
        setPassword("");
        setDisplayName("");

        // Switch back to Login
        setIsSignup(false);
      } else {
        const data = await loginUser({
          username,
          password,
        });

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save user data
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
        setIsLoggedIn(true);

        setMessage("");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // ==========================
  // DASHBOARD
  // ==========================

  if (isLoggedIn && user) {
    return (
      <div className="app">
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
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard">
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
              <span>LEVEL</span>
              <strong>{user.level}</strong>
            </div>
          </section>

          {/* XP SECTION */}
          <section className="xp-card">
            <div className="xp-header">
              <span>
                Level {user.level}
              </span>

              <span>
                {user.xp} / {user.level * 100} XP
              </span>
            </div>

            <div className="xp-bar">
              <div
                className="xp-progress"
                style={{
                  width: `${Math.min(
                    (user.xp /
                      (user.level * 100)) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats-grid">
            <div className="stat-card">
              <span>📚</span>
              <h3>{user.completedTasks}</h3>
              <p>Tasks Done</p>
            </div>

            <div className="stat-card">
              <span>🃏</span>
              <h3>0</h3>
              <p>Cards Collected</p>
            </div>

            <div className="stat-card">
              <span>🔥</span>
              <h3>{user.streak}</h3>
              <p>Day Streak</p>
            </div>

            <div className="stat-card">
              <span>👥</span>
              <h3>0</h3>
              <p>Friends</p>
            </div>
          </section>

          {/* MAIN FEATURES */}
          <section className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                📅
              </div>

              <h2>Calendar</h2>

              <p>
                Plan your study schedule and
                track your progress.
              </p>

              <button>
                Open Calendar
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                📝
              </div>

              <h2>Study Planner</h2>

              <p>
                Create tasks and complete
                your daily study goals.
              </p>

              <button>
                Open Planner
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                📖
              </div>

              <h2>Study Log</h2>

              <p>
                Keep track of everything
                you studied.
              </p>

              <button>
                Open Study Log
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                🃏
              </div>

              <h2>Card Collection</h2>

              <p>
                Unlock exciting football,
                cricket and actor cards.
              </p>

              <button>
                Open Collection
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ==========================
  // LOGIN / SIGNUP
  // ==========================

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="brand">
          <h1>Skill-Oraa</h1>

          <p>
            Level up your learning journey 🚀
          </p>
        </div>

        <h2>
          {isSignup
            ? "Create Your Account"
            : "Welcome Back"}
        </h2>

        <p className="auth-subtitle">
          {isSignup
            ? "Start your skill journey today"
            : "Login to continue your journey"}
        </p>

        <form onSubmit={handleSubmit}>

          {isSignup && (
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
              required
            />
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            className="primary-btn"
            type="submit"
          >
            {isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <button
          className="switch-btn"
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>

      </div>
    </div>
  );
}

export default App;