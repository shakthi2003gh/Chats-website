import UIProvider from "./ui";
import UserProvider from "./user";

export default function StateProvider({ children }) {
  return (
    <UIProvider>
      <UserProvider>{children}</UserProvider>
    </UIProvider>
  );
}
