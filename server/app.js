const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const { validateToken } = require("./jwt");

dotenv.config();

const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(validateToken);

app.use("/messages", messagesRouter);
app.use("/users", usersRouter);

module.exports = app;
