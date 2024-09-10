import NetworkProvider from "./network";
import UIProvider from "./ui";
import DataProvider from "./data";
import UserProvider from "./user";
import PopupProvider from "../layouts/popup";

export default function StateProvider({ children }) {
  return (
    <PopupProvider>
      <NetworkProvider>
        <UIProvider>
          <DataProvider>
            <UserProvider>{children}</UserProvider>
          </DataProvider>
        </UIProvider>
      </NetworkProvider>
    </PopupProvider>
  );
}
