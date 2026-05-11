const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// CORS

app.use(
  cors({
    origin: [
    //   "http://localhost:5173",
      "https://interview-ai-yt-main.vercel.app",
    ],

    credentials: true,
  })
);


// MIDDLEWARES

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ROUTES

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Health Check

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully",
  });
});

module.exports = app;