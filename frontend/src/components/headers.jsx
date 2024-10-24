import React from "react";
import { MdGroupAdd } from "react-icons/md";
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
    <button onClick={handleNavigate("new-group")}>new group</button>,
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
  const heading = {
    tag: isMainPanel ? "h1" : "h2",
    title: title || "List Panel",
  };
  const actionBtn = {
    [mainPanel[0]]: {
      title: "New Chat",
      className: "new-icon",
      icon: <RiChatNewFill />,
      location: "new-chat",
    },
    [mainPanel[1]]: {
      title: "New Group",
      className: "new-icon",
      icon: <MdGroupAdd />,
      location: "new-group",
    },
  };

  if (mediaQuery.isSmaller && isMainPanel) return <MobileHeader />;

  const handleClick = () => {
    if (type === "contact-info") return chat.toggleShowContact(false);

    floatingPanel.navigate(actionBtn?.[type]?.location || type);
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

      {React.createElement(heading.tag, null, heading.title)}

      {!mediaQuery.isSmaller && (
        <Button
          title={actionBtn?.[type]?.title || "Close"}
          className={actionBtn?.[type]?.className || "close-icon"}
          onClick={handleClick}
        >
          {actionBtn?.[type]?.icon || <IoMdClose />}
        </Button>
      )}
    </header>
  );
}
