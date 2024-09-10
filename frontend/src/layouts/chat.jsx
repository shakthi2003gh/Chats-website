import { useEffect, useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";
import { useUI } from "../state/ui";
import { useData } from "../state/data";
import { useNetwork } from "../state/network";
import { formatTime } from "../utilities";
import useObserver from "../hooks/useObserver";
import Menu from "../components/menu";
import Button from "../components/button";
import Message from "../components/message";
import ComposeArea from "../components/composeArea";
import ProfileImage from "../components/profileImage";

export default function Chat({ ...rest }) {
  const chatRef = useRef(null);
  const { isOnline } = useNetwork();
  const { panel, chat, mediaQuery } = useUI();
  const { getChat, updateMessageStatus } = useData();
  const [height, setMaxHeight] = useState("100%");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const { isSmall } = mediaQuery;
  const { _id, image, name, unreadCount, ...restChat } = getChat();
  const { messages = [], isOnline: isUserOnline, isNew = false } = restChat;

  const handleResize = () => {
    const displayHeight = window.visualViewport.height + "px";
    setMaxHeight(displayHeight);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop <= scrollHeight - clientHeight * 2.5) setShowScrollBtn(true);
    else setShowScrollBtn(false);
  };

  const scrollToBottom = () => {
    const { scrollHeight, clientHeight } = chatRef.current;

    chatRef.current.scrollTop = scrollHeight - clientHeight;
    if (showScrollBtn) setShowScrollBtn(false);
  };

  const handleOpenContact = () => {
    chat.toggleShowContact(true);
  };

  const handleClose = () => {
    chat.setCurrent(null);
    panel.navigate("personal-chat", true);
  };

  const handleGroupUp = (group, message) => {
    const { createdAt } = message;

    const timeStamp = new Date(createdAt);
    const date = formatTime(timeStamp, "today");

    if (!group[date]) group[date] = [];
    group[date].push(message);

    return group;
  };

  const groupedMessages = messages.reduce(handleGroupUp, {});
  const composeProps = {
    [isNew ? "receiver_id" : "chat_id"]: _id,
    scrollToBottom,
  };
  const menuOptions = [
    <button onClick={handleOpenContact}>contact info</button>,
    <button onClick={handleClose}>close</button>,
  ];

  const messagesLength = messages.length;

  useEffect(() => {
    if (!showScrollBtn) scrollToBottom();
  }, [messagesLength, height]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isSmall]);

  const getNodeList = () => chatRef.current?.querySelectorAll(".message");
  const callback = (node) => {
    if (!isOnline) return;

    const ownMessage = node.classList.contains("send");
    const receiverSaw = node.dataset.receipt === "seen";
    if (ownMessage || receiverSaw) return;

    const data = {
      chat_id: _id,
      message_id: node.id,
      status: "seen",
      user_id: sessionStorage.getItem("user_id"),
    };
    updateMessageStatus(data, true);
  };
  useObserver(getNodeList, callback, [isOnline, messagesLength]);

  if (!_id) return null;

  return (
    <section
      aria-label="Chat"
      className="chat"
      style={{ "--height": height }}
      {...rest}
    >
      <header>
        <button
          className="btn back"
          onClick={() => history.back()}
          title="Back"
        >
          <IoArrowBackSharp />
        </button>

        <ProfileImage
          image={image}
          placeholder={name}
          isOnline={isUserOnline}
          onClick={handleOpenContact}
        />

        <span className="title name" onClick={handleOpenContact}>
          {name}
        </span>

        <Menu options={menuOptions} />
      </header>

      <div
        ref={chatRef}
        tabIndex={0}
        className="group-messages"
        onScroll={handleScroll}
      >
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} id={date} className="group">
            <span className="timestamp">{date}</span>

            <div className="messages">
              {groupedMessages[date]
                .sort((a, b) => (a.createdAt <= b.createdAt ? -1 : 1))
                .map((message) => (
                  <Message key={message._id} {...message} />
                ))}
            </div>
          </div>
        ))}

        {showScrollBtn && (
          <Button
            title="Scroll To Bottom"
            className="scroll-down"
            onClick={scrollToBottom}
          >
            <FaArrowDown /> {!!unreadCount && <span>{unreadCount}</span>}
          </Button>
        )}
      </div>

      <ComposeArea {...composeProps} />
    </section>
  );
}
