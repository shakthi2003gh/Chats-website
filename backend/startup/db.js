const mongoose = require("mongoose");
const { startup, error } = require("../common/logger");
const PORT = process.env.PORT || 4001;

module.exports = function (app) {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      startup("Connect to MongoDB...");

      const server = app.listen(PORT, (err) => {
        if (err) return error(err);

        startup(`Listening on port ${PORT}...`);
      });

      require("./webSocket")(server);
    })
    .catch((err) => {
      error("Couldn't connect to MongoDB...");
      error(err);
    });
};
