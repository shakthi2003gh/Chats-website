const url = require("url");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const Response = require("../response");

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
    if (error) return Response[error](res, data);

    req.user = user;
    next();
  } catch (error) {
    Response.serverError(res);
  }
};

exports.authWS = async function (req, socket, cb) {
  const respond401 = () => {
    socket.write(`HTTP/1.1 401 unauthorized\r\n\r\n`);
    socket.destroy();
  };

  try {
    const { token } = url.parse(req.url, true).query;

    const { error, ...data } = await authToken(token);
    if (error) return respond401();

    cb(data);
  } catch {
    respond401();
  }
};

exports.authToken = authToken;
