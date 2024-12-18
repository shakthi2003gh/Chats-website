const router = require("express").Router();
const { users } = require("./users");
const { people } = require("./public");
const { auth } = require("../middleware/auth");

router.use("/user", users);
router.use("/public", auth, people);

exports.routes = router;
