const bodyParser = require("body-parser");
const { routes } = require("../routes");
const { error } = require("../middleware/error");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api", routes);
  app.use(error);
};
