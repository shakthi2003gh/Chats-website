const cors = require("cors");

const options = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
  exposedHeaders: "Authorization",
};

module.exports = (app) => app.use(cors(options));
