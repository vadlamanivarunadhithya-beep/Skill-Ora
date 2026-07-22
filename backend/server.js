const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes =
  require("./routes/authRoutes");

const taskRoutes =
  require("./routes/taskRoutes");

const studyLogRoutes =
  require("./routes/studyLogRoutes");


dotenv.config();


const app =
  express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://skill-ora.vercel.app"
  ],
  credentials: true
}));


app.use(
  express.json()
);


// ========================================
// ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/tasks",
  taskRoutes
);


app.use(
  "/api/study-logs",
  studyLogRoutes
);


// ========================================
// TEST ROUTE
// ========================================

app.get(
  "/",
  (req, res) => {

    res.json({

      message:
        "Skill-Oraa Backend is Running 🚀",

    });

  }
);


// ========================================
// SERVER CONFIGURATION
// ========================================

const PORT =
  process.env.PORT ||
  5000;


const MONGO_URI =
  process.env.MONGO_URI;


// ========================================
// CHECK MONGO URI
// ========================================

if (!MONGO_URI) {

  console.error(
    "❌ MONGO_URI is missing in .env file"
  );

  process.exit(1);

}


// ========================================
// CONNECT TO MONGODB
// ========================================

mongoose
  .connect(
    MONGO_URI
  )

  .then(
    () => {

      console.log(
        "✅ MongoDB Connected Successfully"
      );


      // ====================================
      // START SERVER
      // ====================================

      app.listen(

        PORT,

        () => {

          console.log(

            `🚀 Server running on port ${PORT}`

          );

        }

      );

    }

  )

  .catch(

    (error) => {

      console.error(

        "❌ MongoDB Connection Failed:"

      );


      console.error(

        error.message

      );


      process.exit(1);

    }

  );