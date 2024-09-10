import userLocalDB from "../indexedDB/userDB";

const connectWebSocket = async (onMessageReceived, reconnect) => {
  const user = await userLocalDB.getUser();
  const { token } = (await userLocalDB.getToken()) || {};

  return new Promise((resolve, reject) => {
    if (!user) return;
    if (!token)
      return reject({ code: 401, message: "Access denied. No token provided" });

    let ws;
    const path = "?token=" + token;

    ws = new WebSocket(import.meta.env.VITE_WS_ENDPOINT + path);

    ws.onopen = () => {
      resolve(ws);
    };

    ws.onmessage = async (message) => {
      onMessageReceived(message.data);
    };

    ws.onclose = (e) => {
      const isClosed = ws.readyState === ws.CLOSED;
      if (e.code === 1006 && navigator.onLine && isClosed) reconnect();
    };

    ws.onerror = () => {
      reject({});
    };
  });
};

export { connectWebSocket };
