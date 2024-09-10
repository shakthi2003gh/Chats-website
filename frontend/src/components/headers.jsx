import { RiChatNewFill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useUI } from "../state/ui";
import { useUser } from "../state/user";
import Logo from "./logo";
import Menu from "./menu";
import Button from "./button";

export function MobileHeader() {
  const { floatingPanel } = useUI();
  const { logout } = useUser();

  const handleNavigate = (path) => () => {
    floatingPanel.navigate(path);
  };

  const menuOptions = [
    <button onClick={handleNavigate("new-chat")}>new chat</button>,
    <button>new group</button>,
    <button onClick={handleNavigate("settings")}>settings</button>,
    <button className="danger" onClick={logout}>
      logout
    </button>,
  ];

  return (
    <header className="mobile-header">
      <Logo />

      <Menu options={menuOptions} />
    </header>
  );
}

export function PanelHeader({ type, title }) {
  const { mediaQuery, floatingPanel, chat } = useUI();

  const mainPanel = ["personal-chat", "group-chat", "calls"];
  const isMainPanel = mainPanel.includes(type);

  if (mediaQuery.isSmaller && isMainPanel) return <MobileHeader />;

  const handleClose = () => {
    if (type === "contact-info") return chat.toggleShowContact(false);

    floatingPanel.navigate(isMainPanel ? "new-chat" : type);
  };

  const handleBack = () => {
    history.back();
  };

  return (
    <header className="panel-header">
      {mediaQuery.isSmaller && (
        <Button className="back" onClick={handleBack} title="Back">
          <IoArrowBackSharp />
        </Button>
      )}

      {isMainPanel ? (
        <h1>{title || "List Panel"}</h1>
      ) : (
        <h2>{title || "List Panel"}</h2>
      )}

      {!mediaQuery.isSmaller && (
        <Button
          title={isMainPanel ? "New Chat" : "Close"}
          className={isMainPanel ? "new-icon" : "close-icon"}
          onClick={handleClose}
        >
          {isMainPanel ? <RiChatNewFill /> : <IoMdClose />}
        </Button>
      )}
    </header>
  );
}
