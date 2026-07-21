import { useState } from "react";

import { signupUser, loginUser } from "./api/auth";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Calendar from "./pages/Calendar";
import StudyLog from "./pages/StudyLog";
import Collection from "./pages/Collection";

import "./App.css";

function App() {
  // =========================================
  // AUTH STATE
  // =========================================

  const [isSignup, setIsSignup] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // =========================================
  // USER STATE
  // =========================================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // =========================================
  // FORM STATE
  // =========================================

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");

  const [message, setMessage] = useState("");

  // =========================================
  // PAGE NAVIGATION
  // =========================================

  const [currentPage, setCurrentPage] =
    useState("dashboard");


  // =========================================
  // LOGIN / SIGNUP
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      // =====================================
      // SIGNUP
      // =====================================

      if (isSignup) {
        const data = await signupUser({
          username,
          password,
          displayName,
        });

        setMessage(
          data.message ||
            "Account created successfully"
        );

        setUsername("");

        setPassword("");

        setDisplayName("");

        // Go back to login
        setIsSignup(false);

        return;
      }


      // =====================================
      // LOGIN
      // =====================================

      const data = await loginUser({
        username,
        password,
      });


      // Save token
      localStorage.setItem(
        "token",
        data.token
      );


      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // Update React state
      setUser(data.user);

      setIsLoggedIn(true);

      // Open dashboard
      setCurrentPage("dashboard");

      // Clear message
      setMessage("");

    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setIsLoggedIn(false);

    setCurrentPage("dashboard");

    setUsername("");

    setPassword("");

    setDisplayName("");

    setMessage("");
  };


  // =========================================
  // IF USER IS LOGGED IN
  // =========================================

  if (isLoggedIn && user) {

    // =======================================
    // DASHBOARD
    // =======================================

    if (currentPage === "dashboard") {
      return (
        <Dashboard
          user={user}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      );
    }


    // =======================================
    // STUDY PLANNER
    // =======================================

    if (currentPage === "planner") {
      return (
        <Planner
          onBack={() =>
            setCurrentPage("dashboard")
          }
        />
      );
    }


    // =======================================
    // CALENDAR
    // =======================================

    if (currentPage === "calendar") {
      return (
        <Calendar
          onBack={() =>
            setCurrentPage("dashboard")
          }
        />
      );
    }


    // =======================================
    // STUDY LOG
    // =======================================

    if (currentPage === "studylog") {
      return (
        <StudyLog
          onBack={() =>
            setCurrentPage("dashboard")
          }
        />
      );
    }


    // =======================================
    // COLLECTION
    // =======================================

    if (currentPage === "collection") {
      return (
        <Collection
          onBack={() =>
            setCurrentPage("dashboard")
          }
        />
      );
    }


    // =======================================
    // FALLBACK
    // =======================================

    return (
      <Dashboard
        user={user}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }


  // =========================================
  // LOGIN / SIGNUP PAGE
  // =========================================

  return (
    <div className="auth-container">

      <div className="auth-card">

        {/* BRAND */}

        <div className="brand">

          <h1>
            Skill-Oraa
          </h1>

          <p>
            Level up your learning journey 🚀
          </p>

        </div>


        {/* TITLE */}

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


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
        >

          {/* DISPLAY NAME */}

          {isSignup && (

            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) =>
                setDisplayName(
                  e.target.value
                )
              }
              required
            />

          )}


          {/* USERNAME */}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            required
          />


          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />


          {/* SUBMIT BUTTON */}

          <button
            className="primary-btn"
            type="submit"
          >

            {isSignup
              ? "Create Account"
              : "Login"}

          </button>

        </form>


        {/* MESSAGE */}

        {message && (

          <p className="message">
            {message}
          </p>

        )}


        {/* SWITCH LOGIN / SIGNUP */}

        <button
          className="switch-btn"
          onClick={() => {

            setIsSignup(
              !isSignup
            );

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