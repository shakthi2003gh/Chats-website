import { RiChatNewFill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useUI } from "../state/ui";
import Logo from "./logo";
import Menu from "./menu";
import Button from "./button";

export function MobileHeader() {
  const menuOptions = [
    <button>new chat</button>,
    <button>new group</button>,
    <button>settings</button>,
    <button className="danger">logout</button>,
  ];

  return (
    <header className="mobile-header">
      <Logo />

      <Menu options={menuOptions} />
    </header>
  );
}

export function PanelHeader({ type, title }) {
  const { mediaQuery } = useUI();

  const mainPanel = ["personal-chat", "group-chat", "calls"];
  const isMainPanel = mainPanel.includes(type);

  if (mediaQuery.isSmaller && isMainPanel) return <MobileHeader />;

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
        >
          {isMainPanel ? <RiChatNewFill /> : <IoMdClose />}
        </Button>
      )}
    </header>
  );
}
