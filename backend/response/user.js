const { OTPResponse } = require("./otp");

exports.UserResponse = class extends OTPResponse {
  static userAlreadyRegister(res) {
    const status = 200;
    const message =
      "The user with this email is already registered. Please check your inbox for the OTP.";
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
