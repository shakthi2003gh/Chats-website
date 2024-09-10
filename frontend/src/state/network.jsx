import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiWifiLine, RiWifiOffLine } from "react-icons/ri";
import { TbPlugConnected, TbPlugConnectedX } from "react-icons/tb";
import { VscLoading } from "react-icons/vsc";
import { classes } from "../utilities";
import { connectWebSocket } from "../services/websocket";
import userLocalDB from "../services/indexedDB/userDB";

const NetworkContext = createContext(null);

export function useNetwork() {
  return useContext(NetworkContext);
}

export default function NetworkProvider({ children }) {
  const wsRef = useRef(null);
  const alertRef = useRef(null);
  const receiverRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isOnline, setOnline] = useState(navigator.onLine);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [canShowNetworkStatus, setShowNetworkStatus] = useState(!isOnline);
  const [canShowConnectionStatus, setShowConnectionStatus] = useState(false);

  wsRef.isConnected = socket && socket.readyState === socket.OPEN;

  const closeSocket = () => {
    if (typeof wsRef.current?.close === "function") wsRef.current.close();
    if (typeof socket?.close === "function") socket.close();

    wsRef.current = null;
    setSocket(null);
    setConnectionStatus(null);
    setShowConnectionStatus(false);
  };

  const setWebSocket = (ws) => {
    closeSocket();
    wsRef.current = ws;
    setSocket(ws);
  };

  const connection = (reconnect) => {
    if (!receiverRef.current) return;

    setShowConnectionStatus(true);
    setConnectionStatus("loading");

    return new Promise((resolve, reject) =>
      connectWebSocket(receiverRef.current, reconnect)
        .then((ws) => {
          setWebSocket(ws);
          setShowConnectionStatus(true);
          setConnectionStatus("success");

          setTimeout(() => {
            setShowConnectionStatus(false);

            setTimeout(() => {
              setConnectionStatus(null);
            }, [3000]);
          }, [3000]);

          resolve();
        })
        .catch((err) => {
          const { message } = err || {};

          setShowConnectionStatus(true);
          setConnectionStatus("error");

          if (!message) return reject();
          toast.error(message);
          reject(err);
        })
    );
  };

  const handleReconnect = (tryCount = 0) => {
    const delay = tryCount <= 3 ? 5000 : tryCount <= 6 ? 10000 : 20000;

    return () => {
      const promise = new Promise((resolve, reject) => {
        setShowConnectionStatus(true);
        setConnectionStatus("loading");

        setTimeout(() => {
          connection(handleReconnect(tryCount + 1))
            .then(resolve)
            .catch(reject);
        }, delay);
      }).catch(() => {
        if (typeof wsRef.auth === "function") wsRef.auth();
      });

      wsRef.current = promise;
    };
  };

  const handleConnection = (receiver) => {
    if (wsRef.current) return;
    const promise = connection(handleReconnect());

    wsRef.current = promise;
    receiverRef.current = receiver;

    return promise;
  };

  const handleOnline = async () => {
    alertRef.current = setTimeout(() => setShowNetworkStatus(false), 3000);

    const user = await userLocalDB.getUser();
    if (wsRef.current instanceof Promise && !user) return;
    if (!(socket?.readyState === socket?.OPEN)) handleReconnect()();
  };

  const handleOffline = () => {
    clearTimeout(alertRef?.current);
    setShowNetworkStatus(true);
  };

  const checkInternetConnection = (e) => {
    const online = e.type === "online";

    if (online) handleOnline();
    else handleOffline();

    setOnline(online);
  };

  useEffect(() => {
    window.addEventListener("online", checkInternetConnection);
    window.addEventListener("offline", checkInternetConnection);

    return () => {
      window.removeEventListener("online", checkInternetConnection);
      window.removeEventListener("offline", checkInternetConnection);
    };
  }, [isOnline, socket]);

  const connectionClassNames = classes({
    "connection-status": true,
    show: canShowConnectionStatus,
  });
  const networkClassNames = classes({
    "network-status": true,
    show: canShowNetworkStatus,
  });
  const state = { isOnline, wsRef, socket, closeSocket, handleConnection };

  return (
    <NetworkContext.Provider value={state}>
      {children}

      <div className="network-alerts" inert="true">
        <div className={connectionClassNames}>
          {connectionStatus === "success" ? (
            <div className="success">
              <TbPlugConnected /> Connected to server.
            </div>
          ) : connectionStatus === "loading" ? (
            <div className="loading">
              <VscLoading className="loading-icon" /> Connecting to server...
            </div>
          ) : connectionStatus === "loading" ? (
            <div className="error">
              <TbPlugConnectedX /> Could not connect to server.
            </div>
          ) : null}
        </div>

        <div className={networkClassNames}>
          {isOnline ? (
            <div className="success">
              <RiWifiLine /> Back online
            </div>
          ) : (
            <div className="error">
              <RiWifiOffLine /> No internet connection
            </div>
          )}
        </div>
      </div>
    </NetworkContext.Provider>
  );
}
