import { useUI } from "../state/ui";
import SideBar from "../layouts/sideBar";

export default function ChatApp() {
  const { mediaQuery } = useUI();

  return <main className="Chats">{!mediaQuery.isSmaller && <SideBar />}</main>;
}
