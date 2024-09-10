import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUI } from "./ui";
import { useNetwork } from "./network";
import { navigate } from "../utilities";
import { PublicHTTP } from "../services/http/public";
import chatsLocalDB from "../services/indexedDB/chatsDB";
import { uploadMessageImage } from "../services/firebase/storage";

const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

export default function DataProvider({ children }) {
  const { isOnline, socket, wsRef, closeSocket } = useNetwork();
  const { panel, floatingPanel, chat } = useUI();
  const [isLoading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [personalChats, setChats] = useState([]);
  const [groupChats, setGroups] = useState([]);

  const { current: currentFloatingPanel } = floatingPanel;
  const statusOptions = ["delivered", "seen"];

  const sendMessageStatus = ({ message_id, status }) => {
    const socket = wsRef.current;
    const isConnected = wsRef.isConnected;

    if (!isConnected) return;
    if (!statusOptions.includes(status)) return;

    const data = { message_id, status };
    const payload = { type: "messageStatus", data };
    socket.send(JSON.stringify(payload));
  };

  const checkReadRecipt = (chat) => {
    const user_id = sessionStorage.getItem("user_id");

    chat.unreadCount = 0;
    chat.messages = chat.messages.map((message) => {
      const { _id: message_id, author, readReceipt } = message;
      const ownMessage = author._id === user_id;

      if (!ownMessage && readReceipt !== statusOptions[1])
        chat.unreadCount = chat?.unreadCount ? chat?.unreadCount + 1 : 1;

      if (ownMessage) return message;
      if (statusOptions.includes(readReceipt)) return message;

      const status = statusOptions[0];
      message.readReceipt = status;
      if (chat.lastMessage._id === message._id)
        chat.lastMessage.readReceipt = status;

      sendMessageStatus({ message_id, status });
      return message;
    });

    return chat;
  };

  const syncLocalMessages = (prev, current) => {
    prev.forEach((chat) => {
      chat.messages.forEach((message) => {
        const message_id = message._id;
        const localMessage = new Date(message_id).toString() !== "Invalid Date";
        if (!localMessage) return;

        const chatIndex = current.findIndex(({ _id }) => _id === chat._id);
        if (chatIndex < 0) return;

        const { messages } = current[chatIndex];

        const find = ({ _id }) => _id === message_id;
        const messageIndex = messages.findIndex(find);
        if (messageIndex >= 0) return;

        current[chatIndex].messages.push(message);

        const sort = (a, b) => (a.createdAt <= b.createdAt ? -1 : 1);
        const sortedMessage = current[chatIndex].messages.sort(sort);
        const lastMessage = sortedMessage[sortedMessage.length - 1 ?? 0] || {};
        current[chatIndex].lastMessage = lastMessage;
      });
    });
  };

  const setPersonalChats = (value, sync = false) => {
    const isFunction = typeof value === "function";

    setChats((prev) => {
      if (isFunction) {
        const chats = value(prev).map(checkReadRecipt);
        chatsLocalDB.addChats(chats);
        return chats;
      }

      const chats = value.map(checkReadRecipt);
      if (sync) syncLocalMessages(prev, chats);

      chatsLocalDB.addChats(chats);
      return chats;
    });
  };

  const setGroupChats = (group) => {
    setGroups(group);
  };

  const handleSetPeople = (users) => {
    const filteredUser = users.filter(({ _id: id }) => {
      const index = personalChats.findIndex(({ _id, user_id }) => {
        return id === _id || id === user_id;
      });

      return index < 0;
    });

    setPeople(filteredUser);
  };

  const getChat = () => {
    const { _id: id, user_id } = chat.current;

    const findUser = ({ _id }) => _id === user_id;
    const findChat = ({ _id, user_id }) => id === _id || id === user_id;
    const newChat = () => ({ ...people.find(findUser), isNew: true });

    return personalChats.find(findChat) || newChat();
  };

  const addNewChat = (data) => {
    const { _id: chat_id, user_id } = data;
    const url = window.location.pathname;
    const panelName = url.split("/")[1];
    const receiver_id = url.split("/")[2];

    data.unreadCount = 0;
    setPersonalChats((prev) => [...prev, data]);

    if (!(panelName === "new-chat" && receiver_id === user_id)) return;

    panel.navigate("personal-chat");
    chat.setCurrent({ _id: chat_id });
    navigate("/personal-chat/" + chat_id, true);
  };

  const addMessage = ({ temp_id, chat_id, message }, type) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat._id !== chat_id) return chat;

        const find = ({ _id }) => _id === message._id;
        const index = chat.messages.findIndex(find);
        if (index > 0) return chat;

        const add = () => {
          const socket = wsRef.current;
          const isConnected = socket && socket.readyState === socket.OPEN;

          if (isConnected && type === "message") {
            const { _id } = message;
            const status = statusOptions[0];

            message.readReceipt = status;
            sendMessageStatus({ message_id: _id, status });

            if (message.readReceipt !== statusOptions[1])
              chat.unreadCount = chat?.unreadCount ? chat?.unreadCount + 1 : 1;
          }

          return [...chat.messages, message];
        };
        const update = () =>
          chat.messages.map((m) => (m._id === temp_id ? message : m));

        chat.messages = type === "echo" ? update() : add();
        chat.lastMessage = message;
        chatsLocalDB.addMessage(chat_id, chat.messages, message);

        return chat;
      })
    );
  };

  const removeMessage = ({ chat_id, message_id }) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat._id !== chat_id) return chat;

        const filter = ({ _id }) => _id !== message_id;
        const messages = chat.messages.filter(filter);

        chat.messages = messages;

        if (chat.lastMessage._id === message_id) {
          let lastMessage = messages?.[messages?.length - 1 ?? 0] || {};
          chat.lastMessage = lastMessage;
        }

        chatsLocalDB.addMessage(chat_id, chat.messages, chat.lastMessage);

        return chat;
      })
    );
  };

  const sendMessage = ({ chat_id, receiver_id, text, image, author }) => {
    const _id = new Date(Date.now()).toISOString();
    const isConnected = socket && socket.readyState === socket.OPEN;

    if (!((chat_id || receiver_id) && (text || image))) return;

    const send = (image) => {
      const message = { temp_id: _id, chat_id, receiver_id, text, image };
      const payload = { type: "message", data: message };

      if (isConnected) socket.send(JSON.stringify(payload));
    };

    if (image)
      uploadMessageImage(chat_id, image.file)
        .then(send)
        .catch(() => {});
    else send();

    if (!(text?.length <= 1000 || image)) return;
    const localMessage = { _id, text, image, createdAt: _id, author };
    addMessage({ chat_id, message: localMessage });
  };

  const resendMessage = ({ temp_id, text, image, author }) => {
    const chat_id = chat.current._id;

    sendMessage({ chat_id, text, image, author });
    removeMessage({ chat_id, message_id: temp_id });
  };

  const updateMessageStatus = (data, makeResponse = false) => {
    const { chat_id, message_id, status, user_id } = data;

    setChats((prev) =>
      prev.map((chat) => {
        if (chat._id !== chat_id) return chat;

        chat.messages = chat.messages.map((message) => {
          const ownMessage = message.author._id === user_id;

          if (message._id !== message_id) return message;
          if (ownMessage) return message;
          if (message.readReceipt === status) return message;

          if (status === statusOptions[1])
            chat.unreadCount = chat?.unreadCount ? chat?.unreadCount - 1 : 0;

          message.readReceipt = status;
          if (chat.lastMessage._id === message._id)
            chat.lastMessage.readReceipt = status;

          return message;
        });

        chatsLocalDB.addMessage(chat_id, chat.messages, chat.lastMessage);
        return chat;
      })
    );

    if (makeResponse) sendMessageStatus({ message_id, status });
  };

  const updateUserOnlineStatus = ({ chat_id, user_id, status }) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (!(chat._id === chat_id && chat.user_id === user_id)) return chat;

        chat.isOnline = status;
        return chat;
      })
    );
  };

  const handleError = ({ message, auth }) => {
    if (auth !== "failed") return toast.error(message);

    if (typeof wsRef.auth === "function") wsRef.auth();
  };

  const handleHeartBeat = () => {
    const payload = { type: "pong" };
    wsRef.current.send(JSON.stringify(payload));
  };

  const handleReceiveMessage = (response) => {
    const { type, data } = JSON.parse(response);
    const methods = {
      ping: handleHeartBeat,
      error: handleError,
      "new-chat": addNewChat,
      message: addMessage,
      echo: addMessage,
      messageStatus: updateMessageStatus,
      onlineStatus: updateUserOnlineStatus,
    };

    methods[type]?.(data, type);
  };

  const handleReset = () => {
    closeSocket();
    setLoading(false);
    setPeople([]);
    setPersonalChats([]);
    setGroups([]);
  };

  useEffect(() => {
    if (!isOnline) return;
    if (currentFloatingPanel !== "new-chat") return;

    setLoading(true);
    PublicHTTP.getPeople()
      .then(handleSetPeople)
      .finally(() => setLoading(false));
  }, [isOnline, currentFloatingPanel]);

  useEffect(() => {
    chatsLocalDB.getChats().then(setChats);
  }, []);

  const m = { handleReceiveMessage, reset: handleReset, updateMessageStatus };
  const methods = { getChat, sendMessage, resendMessage, ...m };
  const chats = { personalChats, groupChats, setPersonalChats, setGroupChats };
  const state = { chats, people, isLoading, ...methods };

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}
