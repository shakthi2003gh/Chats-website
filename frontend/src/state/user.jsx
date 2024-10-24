import { createContext, useContext, useEffect, useState } from "react";
import { useUI } from "./ui";
import { useData } from "./data";
import { useNetwork } from "./network";
import { usePopup } from "../layouts/popup";
import { UserHTTP } from "../services/http/user";
import { networkErrorMsg } from "../services/http/config";
import userLocalDB from "../services/indexedDB/userDB";
import chatsLocalDB from "../services/indexedDB/chatsDB";

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const { reset: UIReset } = useUI();
  const { isOnline, wsRef } = useNetwork();
  const { chats, reset: DataReset } = useData();
  const { display } = usePopup();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(true);

  const { isConnected } = wsRef;
  const { setPersonalChats, setGroupChats } = chats || {};
  const needAuthentication = isOnline && isConnected && !!user;

  const setuser = (user) => {
    setUser(user);
    userLocalDB.addUser(user);
    sessionStorage.setItem("user_id", user?._id);
  };

  const register = (payload) => {
    return UserHTTP.register(payload);
  };

  const otpResend = (payload) => {
    return UserHTTP.otpResend(payload);
  };

  const verify = async (payload) => {
    return UserHTTP.verify(payload).then(({ user, chat }) => {
      setEmail("");
      setuser(user);
      setPersonalChats(chat.personal);
    });
  };

  const auth = async () => {
    UserHTTP.auth()
      .then(({ user, chat }) => {
        setuser(user);
        setPersonalChats(chat.personal, true);
        setGroupChats(chat.group, true);
      })
      .catch((data) => {
        if (typeof data === "string" && data === networkErrorMsg) return;
        if (typeof data === "object") display(data);
        logout(false);
      });
  };

  const update = async (payload) => {
    const save = () => {
      setUser((prev) => ({ ...prev, ...payload }));
      userLocalDB.updateUser(payload);
    };

    return UserHTTP.update(payload).then(save);
  };

  const login = async (payload, withDevice) => {
    return UserHTTP.login(payload, withDevice)
      .then(({ user, chat }) => {
        setuser(user);
        setPersonalChats(chat.personal);
        setGroupChats(chat.group);
      })
      .catch((data) => {
        if (typeof data !== "object") return;

        const onConfirm = () => login(payload, true);
        const props = { type: "device", data, onConfirm };
        display(props);
      });
  };

  const logout = (confirmation = true) => {
    const heading = "logout";
    const description = "Are you sure you want logout?";
    const onConfirm = () => {
      UserHTTP.logout()
        .catch(() => {})
        .finally(() => {
          UIReset();
          DataReset();
          setUser(null);
          userLocalDB.removeUser();
          chatsLocalDB.removeAllChats();
          sessionStorage.removeItem("user_id");
        });
    };

    const data = { heading, description };
    const props = { type: "confirmation", data, onConfirm };

    if (confirmation) display(props);
    else onConfirm();
  };

  useEffect(() => {
    userLocalDB
      .getUser()
      .then((user) => {
        setUser(user);
        sessionStorage.setItem("user_id", user?._id);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1500);
      });
  }, []);

  useEffect(() => {
    if (!wsRef?.auth) wsRef.auth = auth;

    if (needAuthentication) auth();
  }, [needAuthentication]);

  const state = {
    user,
    isLoading,
    email,
    setEmail,
    auth,
    login,
    logout,
    verify,
    register,
    otpResend,
    update,
  };

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}
