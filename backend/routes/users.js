const router = require("express").Router();
const Controller = require("../controllers/user");
const { auth } = require("../middleware/auth");

router.post("/register/otp-resend", Controller.otpResend);
router.post("/register", Controller.register);
router.post("/verify", Controller.verify);
router.post("/login", Controller.login);
router.post("/auth", auth, Controller.auth);

exports.users = router;
