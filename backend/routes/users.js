const router = require("express").Router();
const Controller = require("../controllers/user");

router.post("/register", Controller.register);
router.post("/verify", Controller.verify);

exports.users = router;
