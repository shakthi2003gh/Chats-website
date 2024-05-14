const router = require("express").Router();
const Controller = require("../controllers/user");

router.post("/register", Controller.register);

exports.users = router;
