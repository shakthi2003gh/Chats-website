import UserProvider from "./user";

export default function StateProvider({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
