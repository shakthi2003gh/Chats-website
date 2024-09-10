import { useEffect } from "react";
import { usePopup } from "../layouts/popup";
import { useNetwork } from "../state/network";
import { useUI } from "../state/ui";
import { useData } from "../state/data";
import SideBar from "../layouts/sideBar";
import { Display1, Display2 } from "../layouts/displays";
import { useUser } from "../state/user";

export default function ChatApp() {
  const { isShowPopup } = usePopup();
  const { handleConnection, closeSocket } = useNetwork();
  const { panel, mediaQuery } = useUI();
  const { handleReceiveMessage } = useData();
  const { auth } = useUser();

  useEffect(() => {
    panel.navigate("personal-chat", true, true);

    handleConnection(handleReceiveMessage)?.catch(auth);

    return closeSocket;
  }, []);

  return (
    <main className="Chats" inert={isShowPopup ? "true" : undefined}>
      {!mediaQuery.isSmaller && <SideBar />}

      <Display1 />

      <Display2 />
    </main>
  );
}
