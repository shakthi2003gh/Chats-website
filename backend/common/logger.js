const debug = require("debug");

module.exports = { startup: debug("startup:"), error: debug("error:") };
