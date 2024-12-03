const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");

const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const AppError = require("./utils/appError");
const { sequelize } = require("./models");

const app = express();

// Middleware de logging
// app.use(morgan("combined"));

// Sécurisation des en-têtes HTTP
app.use(helmet());

// Configuration CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

// Limiter les requêtes pour éviter les attaques DOS
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

// Middleware de parsing
app.use(express.json());
app.use(cookieParser());

// Sécurisation contre XSS et HPP
app.use(xss());
app.use(hpp());

// Routes
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

// Gestion des erreurs
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
  });
});

sequelize
  .sync()
  .then(() => console.log("Database synchronized"))
  .catch((error) => console.error("Database synchronization error", error));

module.exports = app;
