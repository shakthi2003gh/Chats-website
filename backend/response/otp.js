exports.OTPResponse = class {
  static otpResend(res) {
    const status = 200;
    const message = `OTP has been resent to your email.`;
    const response = { status, message };

    res.status(status).json(response);
  }

  static otpSendRecently(res) {
    const status = 200;
    const message = "The OTP has been recently sent to your email.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static otpSend(res) {
    const status = 201;
    const message = "OTP sent. Please check your inbox.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static invalidOTP(res) {
    const status = 400;
    const message = "Invalid OTP. Please check again.";
    const response = { status, message };

    res.status(status).json(response);
  }

  static otpExpired(res) {
    const status = 403;
    const message = "OTP has expired. Please register again.";
    const response = { status, message };

    res.status(status).json(response);
  }
};
