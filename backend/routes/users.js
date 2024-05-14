const router = require("express").Router();
const Controller = require("../controllers/user");

router.post("/register", Controller.register);
router.post("/verify", Controller.verify);
router.post("/login", Controller.login);

exports.users = router;
