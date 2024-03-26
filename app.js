const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const debug = require("debug")("http");
const debug_db = require("debug")("database");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Declare the app variable
const app = express();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URL).catch((err) => debug_db(err));

// Use the body parser middleware to be able to parse the body of HTTP POST requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use morgan as HTTP logger to show the HTTP method and route of each request
app.use(morgan("dev"));

// Require the models

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
const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));
