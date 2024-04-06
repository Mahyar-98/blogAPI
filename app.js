const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const debug_db = require("debug")("database");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");

// Declare the app variable
const app = express();

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => debug_db(err));

// Use the body parser middleware to be able to parse the body of HTTP POST requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use morgan as HTTP logger to show the HTTP method and route of each request
app.use(morgan("dev"));

// Prepare the app for production
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: { "script-src": ["'self'"] },
  }),
);
const limiter = RateLimit({
  windowMS: 1 * 60 * 1000,
  max: 30,
});
app.use(limiter);

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
);

// Require the routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const tagsRouter = require("./routes/tags");

// Use the routers
app.get("/", (req, res) => res.redirect("/posts"));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts", commentsRouter);
app.use("/tags", tagsRouter);
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "mahyar.erfanian1998@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: email,
    to: "mahyar.erfanian1998@gmail.com",
    subject: `New message from my portfolio website's contact form`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error sending email" });
    }
    res.json({ message: "Email sent successfully" });
  });
});

// Use http-errors middleware to generate a 404 error in case no route matches
app.use((req, res, next) => {
  next(createError(404));
});

// Use a custom error handler middleware
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Listen for HTTP requests
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server listening on port ${port}...`),
);
