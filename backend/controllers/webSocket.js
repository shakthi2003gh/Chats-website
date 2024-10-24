const url = require("url");
const WebSocket = require("ws");
const { User } = require("../models/user");
const { Group } = require("../models/group");
const { authToken } = require("../middleware/auth");
const { storeMessage } = require("../helper/chat");
const { updateReadReceipt } = require("../helper/message");
const validate = require("../validators/webSocket");

function send(socket, response) {
  socket.send(JSON.stringify(response), { binary: false });
}

async function deviceAuth(ws, req) {
  const { token } = url.parse(req.url, true).query;
  const { error } = await authToken(token);
  if (error) return send(ws, { type: "error", data: { auth: "failed" } });
}

module.exports = class {
  heartBeatInterval;

  handleCommunication(server, ws, req) {
    this.handleHeartBeat(server);

    const handlePong = this.onPong;
    const handleMessage = this.onMessage;
    const handleCreateGroup = this.onCreateGroup;
    const handleMessageReceipt = this.onUpdateReceiptStatus;

    return async function (request) {
      await deviceAuth(ws, req);

      try {
        const { type, data } = JSON.parse(request);

        if (type === "pong") handlePong(ws);
        if (type === "message") handleMessage(server, ws)(data);
        if (type === "create-group") handleCreateGroup(server, ws)(data);
        if (type === "messageStatus") handleMessageReceipt(server, ws)(data);
      } catch {
        const message =
          "Invalid JSON format. Please check the data and try again.";

        send(ws, { type: "error", data: { message } });
      }
    };
  }

  handleHeartBeat(server) {
    if (this.heartBeatInterval) clearInterval(this.heartBeatInterval);

    this.heartBeatInterval = setInterval(() => {
      server.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        send(ws, { type: "ping" });
      });
    }, 20000);
  }

  onPong(ws) {
    ws.isAlive = true;
  }

  updateOnlineStatus(server, ws, req, online = false) {
    return async function () {
      const user = await User.findById(req.user._id);
      const friends = req.friends || {};

      if (user?.device) {
        user.device.lastUsed = Date.now();
        user.device.isOnline = online;
        await user.save();
      } else online = false;

      server.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;

        const user_id = ws._id;
        const isSelf = ws === client;
        const isSameUser = user_id === client._id;
        const isSameDevice = online && user.device._id === client.device_id;
        const isFriend = Object.keys(friends).includes(client._id);

        if (online && !isSelf && isSameUser && !isSameDevice)
          send(client, { type: "error", data: { auth: "failed" } });

        if (!isSelf && !isSameUser && isFriend) {
          const { chat_id } = friends[client._id] || {};
          if (!chat_id) return;

          const data = { chat_id, user_id, status: online };
          send(client, { type: "onlineStatus", data });
        }
      });
    };
  }

  onConnect(server, ws, req) {
    return this.updateOnlineStatus(server, ws, req, true);
  }

  onMessage(server, ws) {
    return async function (payload) {
      const { error, value } = validate.message(payload);
      if (error) {
        const response = { type: "error", data: error.details[0] };
        return send(ws, response);
      }

      const result = await storeMessage({ ...value, author_id: ws._id });
      const { data, echoData, receiver_id, isNewChat } = result;

      server.clients.forEach((client) => {
        const isSelf = ws === client;
        const isReceiver = receiver_id === client._id;
        const isOnline = client.readyState === WebSocket.OPEN;

        if (isSelf && isOnline) {
          const type = isNewChat ? "new-chat" : "echo";
          if (type === "echo") echoData.temp_id = value.temp_id;

          send(ws, { type, data: echoData });
        }

        if (!isSelf && isReceiver && isOnline) {
          const type = isNewChat ? "new-chat" : "message";

          send(client, { type, data });
        }
      });
    };
  }

  onCreateGroup(server, ws) {
    return async function (payload) {
      const { error, value } = validate.createGroup(payload);
      if (error) {
        const response = { type: "error", data: error.details[0] };
        return send(ws, response);
      }

      const group = new Group({ ...value, createdBy: ws._id });
      await group.save();

      await User.updateMany(
        { _id: { $in: group.members } },
        { $addToSet: { groupChats: group._id } }
      );

      const populate = [
        {
          path: "members",
          select: "_id name image device.isOnline",
        },
        {
          path: "admin",
          select: "_id name image",
        },
      ];
      const newGroup = await Group.findById(group._id).populate(populate);

      server.clients.forEach((client) => {
        const isSelf = ws === client;
        const members = newGroup.members;
        const isReceiver = members.find(({ id }) => id === client._id);
        const isOnline = client.readyState === WebSocket.OPEN;

        if ((isSelf || isReceiver) && isOnline) {
          const type = "new-group";
          send(client, { type, data: newGroup });
        }
      });
    };
  }

  onUpdateReceiptStatus(server, ws) {
    return async function (payload) {
      const { error, value } = validate.readReceipt(payload);
      if (error) {
        const response = { type: "error", data: error.details[0] };
        return send(ws, response);
      }

      value.user_id = ws._id;
      const { author_id, ...data } = await updateReadReceipt(value);

      if (author_id && data)
        server.clients.forEach((client) => {
          const isSelf = ws === client;
          const isReceiver = author_id === client._id;
          const isOnline = client.readyState === WebSocket.OPEN;

          if (!isSelf && isReceiver && isOnline)
            send(client, { type: "messageStatus", data });
        });
    };
  }

  onClose(server, ws, req) {
    return this.updateOnlineStatus(server, ws, req);
  }

  onError(e) {
    console.error(e);
  }
};
