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

  static invalidCredential(res) {
    const status = 400;
    const message = "Invalid email or password.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static noToken(res) {
    const status = 401;
    const message = "Access denied. No token provided";
    const response = { status, message };

    res.status(status).json(response);
  }

  static invalidToken(res) {
    const status = 401;
    const message = "Access denied. Invalid token";
    const response = { status, message };

    res.status(status).json(response);
  }

  static unauthDevice(res, data) {
    const status = 401;
    const message = "Access denied. Device not authenticated.";
    const response = { status, message, data };

    res.status(status).json(response);
  }

  static userNotFound(res) {
    const status = 404;
    const message = "User not found.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static userNotExist(res) {
    const status = 404;
    const message = "The user with this email does not exist.";
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

  static userAlreadyLoggedin(res, device) {
    const status = 409;
    const { label, lastUsed, isOnline } = device;
    const data = { label, lastUsed };
    const message = isOnline
      ? "You are currently logged in on another device."
      : "User is already logged in on another device.";

    const response = { status, message, data };
    res.status(status).json(response);
  }
};
