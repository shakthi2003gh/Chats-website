import { createContext, useContext, useEffect, useState } from "react";
import { UserHTTP } from "../services/http/user";
import userLocalDB from "../services/indexedDB/userDB";

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(true);

  const register = (payload) => {
    return UserHTTP.register(payload);
  };

  const otpResend = (payload) => {
    return UserHTTP.otpResend(payload);
  };

  const verify = async (payload) => {
    return UserHTTP.verify(payload).then((user) => {
      setEmail("");
      setUser(user);
      userLocalDB.addUser(user);
    });
  };

  const login = async (payload) => {
    return UserHTTP.login(payload).then((user) => {
      setUser(user);
      userLocalDB.addUser(user);
    });
  };

  const logout = () => {
    setUser(null);
    userLocalDB.removeUser();
  };

  useEffect(() => {
    userLocalDB
      .getUser()
      .then(setUser)
      .finally(() => {
        setTimeout(() => setLoading(false), 1500);
      });
  }, []);

  const state = {
    user,
    isLoading,
    email,
    setEmail,
    login,
    logout,
    verify,
    register,
    otpResend,
  };

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}
