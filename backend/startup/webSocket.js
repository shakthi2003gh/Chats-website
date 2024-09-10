const WebSocket = require("ws");
const { authWS } = require("../middleware/auth");
const { startup } = require("../common/logger");
const WSController = require("../controllers/webSocket");

const wsController = new WSController();

module.exports = function (server) {
  const wsServer = new WebSocket.Server({ noServer: true });
  startup("WebSocket started...");

  server.on("upgrade", (req, socket, head) => {
    socket.onerror = wsController.onError;

    authWS(req, socket, ({ user, friends, device_id }) => {
      wsServer.handleUpgrade(req, socket, head, (ws) => {
        ws._id = user._id.toString();
        ws.device_id = device_id;
        ws.isAlive = true;
        req.user = user;
        req.friends = friends;
        wsServer.emit("connection", ws, req);
      });
    });
  });

  wsServer.on("connection", async (ws, req) => {
    wsController.onConnect(wsServer, ws, req)();

    ws.on("message", wsController.handleCommunication(wsServer, ws, req));
    ws.onclose = wsController.onClose(wsServer, ws, req);
    ws.onerror = wsController.onError;
  });
};
