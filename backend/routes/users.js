const router = require("express").Router();
const Controller = require("../controllers/user");
const { auth } = require("../middleware/auth");

router.post("/register/otp-resend", Controller.otpResend);
router.post("/register", Controller.register);
router.post("/verify", Controller.verify);
router.post("/logout", auth, Controller.logout);
router.post("/login", Controller.login);
router.post("/auth", auth, Controller.auth);
router.patch("/", auth, Controller.update);

exports.users = router;
