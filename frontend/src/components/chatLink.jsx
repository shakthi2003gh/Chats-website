import { useUI } from "../state/ui";
import { useUser } from "../state/user";
import { classes, formatTime } from "../utilities";
import Link from "./link";
import ProfileImage from "./profileImage";
import ReadReceipt from "./readReceipt";

export default function ChatLink(props) {
  const { _id, image, name, messages, className, lastMessage, ...r } = props;
  const { user_id, email, unreadCount, isOnline, about, ...re } = r;
  const { type = "chat", createdAt, updatedAt, createdBy, ...res } = re;
  const { admin, members, ...rest } = res;

  const { chat } = useUI();
  const { user } = useUser();

  const getLastMessage = () => {
    const { text, image, author, createdAt } = lastMessage || {};
    const noText = image ? "📷 image" : "No Message";
    if (!text) return { sendAt: createdAt, lastText: noText };

    const sendBy = user._id === author?._id ? "You: " : "";
    const hasImage = image ? "📷 " : "";
    const lastText = sendBy + hasImage + text;
    return { sendAt: createdAt, lastText, author };
  };

  const handleClick = () => {
    if (chat.current?._id === _id) return;

    chat.setCurrent({ _id, type });
    chat.toggleShowContact(false);
  };

  const classObj = {
    "chat-link": true,
    active: chat.current?._id === _id,
  };
  const url = new URL(window.location.href);
  const classNames = classes(classObj, className);
  const { lastText, sendAt, author } = getLastMessage();
  const formatedTimeStamp = formatTime(sendAt || createdAt);
  const isOwnMessage = user._id === author?._id;

  return (
    <Link
      aria-label={name + " chat"}
      className={classNames}
      onClick={handleClick}
      to={`/${type}/` + _id + url.search}
      {...rest}
      tabIndex={classObj.active ? -1 : 0}
    >
      <ProfileImage image={image} placeholder={name} isOnline={isOnline} />

      <div className="details">
        <div className="head">
          <span className="title name">{name}</span>

          <time className="timestamp" dateTime={sendAt}>
            {formatedTimeStamp}
          </time>
        </div>

        <div className="foot">
          <p className="last-message">{lastText}</p>

          {isOwnMessage && (
            <ReadReceipt status={lastMessage?.readReceipt} sendAt={sendAt} />
          )}

          {!!unreadCount && <span className="unread-count">{unreadCount}</span>}

          {!isOwnMessage && !unreadCount && (
            <span className="seen-text">seen</span>
          )}
        </div>
      </div>
    </Link>
  );
}
