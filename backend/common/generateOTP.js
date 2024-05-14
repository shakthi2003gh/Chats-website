exports.generateOTP = function (length = 4) {
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += Math.floor(Math.random() * 10);
  }

  return OTP;
};
