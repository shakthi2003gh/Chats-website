const { User } = require("../models/user");

const router = require("express").Router();
const select = "image name about device.isOnline";

router.get("/users", async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(select);

  res.send(users);
});

exports.public = router;
