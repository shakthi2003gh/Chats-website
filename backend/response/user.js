const { OTPResponse } = require("./otp");

exports.UserResponse = class extends OTPResponse {
  static userAlreadyRegister(res) {
    const status = 200;
    const message =
      "The user with this email is already registered. Please check your inbox for the OTP.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static userAlreadyVerified(res) {
    const status = 400;
    const message = "User with this email has already been verified.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static userNotRegister(res, email) {
    const status = 404;
    const message = (email || "Email") + " not registered.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static userAlreadyExist(res) {
    const status = 409;
    const message = "A user with this email already exists.";
    const response = { status, message };

    res.status(status).json(response);
  }
};
