const { error } = require("../common/logger");
const Response = require("../response");

exports.error = function (err, _req, res, _next) {
  Response.serverError(res);
  error(err);
};
