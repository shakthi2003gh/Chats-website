require("dotenv").config();
require("express-async-errors");

const express = require("express");
const { error } = require("./common/logger");

const app = express();

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (err) => {
  error("Uncaught Exception:", err);

  process.exit(1);
});

require("./startup/db")(app);
require("./startup/cors")(app);
require("./startup/routes")(app);
