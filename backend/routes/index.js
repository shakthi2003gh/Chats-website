const router = require("express").Router();
const { users } = require("./users");

router.use("/user", users);

exports.routes = router;
