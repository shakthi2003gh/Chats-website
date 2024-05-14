exports.OTPResponse = class {
  static otpSend(res) {
    const status = 201;
    const message = "OTP sent. Please check your inbox.";
    const response = { status, message };

    res.status(status).json(response);
  }
};
