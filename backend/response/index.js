const { UserResponse } = require("./user");

module.exports = class extends UserResponse {
  static badPayload(res, message) {
    const status = 400;
    const response = { status, message };

    res.status(status).json(response);
  }

  static serverError(res) {
    const status = 500;
    const message = "Something went wrong on the server.";
    const response = { status, message };

    res.status(status).json(response);
  }
};
