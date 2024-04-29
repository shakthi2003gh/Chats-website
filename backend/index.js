require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

require("./startup/db")(app);
require("./startup/cors")(app);
require("./startup/routes")(app);
