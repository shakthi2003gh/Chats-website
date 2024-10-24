import { useUser } from "../state/user";
import { useData } from "../state/data";
import ReadReceipt from "./readReceipt";

export default function Message(props) {
  const { _id, text, image, author, createdAt, ...r } = props;
  const { readReceipt, currentChatType, ...rest } = r;

  const { user } = useUser();
  const { resendMessage } = useData();
  const author_id = author?._id;
  const author_name = author?.name;
  const isSelf = author_id === user._id;
  const isGroupChat = currentChatType === "group-chat";

  const formatTime = (date) => {
    if (!date) return "No Date";

    const timeStamp = new Date(date);
    const option = { timeStyle: "short", timeZone: "Asia/Kolkata" };

    return new Intl.DateTimeFormat("en-US", option).format(timeStamp);
  };

  const handleResend = () => {
    resendMessage(currentChatType)({ temp_id: _id, text, image, author });
  };

  const className = isSelf ? " send" : " received";
  const displayImage =
    image && typeof image === "object" ? image.string : image;

  return (
    <div
      id={_id}
      className={"message show" + className}
      data-receipt={readReceipt || "sending"}
      {...rest}
    >
      {isGroupChat && !isSelf && <span className="name">{author_name}</span>}

      <div className="container">
        {displayImage && (
          <div className="message-img">
            <img src={displayImage} alt="" />
          </div>
        )}

        {text && <span className="text">{text}</span>}

        <time className="time" dateTime={createdAt}>
          {formatTime(createdAt)}
        </time>
      </div>

      {user._id === author_id && (
        <ReadReceipt
          status={readReceipt}
          sendAt={createdAt}
          onResend={handleResend}
        />
      )}
    </div>
  );
}
