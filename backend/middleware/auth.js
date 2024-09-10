const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { UserResponse } = require("../response/user");

const TOKEN_NAME = process.env.TOKEN_NAME;

async function authToken(token) {
  const data = { type: "logout" };
  if (!token) return { error: "noToken" };

  const { _id, device_id } = jwt.verify(token, process.env.JWT_KEY);
  if (!_id) return { error: "invalidToken" };

  const { user, friends } = await User.findByIdWithFriends(_id);
  if (!user) return { error: "invalidToken" };

  if (user.device?._id !== device_id) return { error: "unauthDevice", data };

  return { user, friends, device_id };
}

exports.auth = async function (req, res, next) {
  try {
    const token = req.header(TOKEN_NAME);

    const { error, user, data } = await authToken(token);
    if (error) return UserResponse[error](res, data);

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid token.", error });
  }
};

exports.authToken = authToken;
