const createError = require("http-errors");
const express = require("express");
require("dotenv").config();

//Third Party middlewares
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const passportSettingRouter = require("./passport/index");
// mongoose
const mongoose = require("mongoose");

//middleware
const adminRequired = require("./middlewares/admin-required");

//router
const routerPackage = require("./routes/routes-package");
const {
  authRouter,
  indexRouter,
  postRouter,
  productRouter,
  userRouter,
  imageRouter,
} = routerPackage;

//express-app
const app = express();

// DB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log("mongoDB connected");
});
const domains = [
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5502",
  "http://3.36.71.248",
  "http://elice-kdt-sw-1st-vm07.koreacentral.cloudapp.azure.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    const isTrue = domains.indexOf(origin) !== -1;
    callback(null, isTrue);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passportSettingRouter();

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/posts", postRouter);
app.use("/images", imageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

module.exports = app;
