const router = require("express").Router();
const { users } = require("./users");
const { public } = require("./public");
const { auth } = require("../middleware/auth");

router.use("/user", users);
router.use("/public", auth, public);

exports.routes = router;
