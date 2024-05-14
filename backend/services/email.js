const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.emailOTP = function (to, otp) {
  return transporter.sendMail({
    from: `"Chats - Messaging WebApp" ${process.env.EMAIL_ID}`,
    to,
    subject: "Verification code for Chats account",
    text: `Hello,
    
    Your verification code for your chats account is: ${otp}
    Please use this code to verify your account.
    
    Thank you,
    The Chats Team
    
    --
    `,
  });
};
