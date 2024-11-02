import { useUI } from "../state/ui";
import { classes } from "../utilities";
import Link from "./link";
import ProfileImage from "./profileImage";

export default function UserLink(props) {
  const { _id, image, name, device, className, ...r } = props;
  const { isSelf, isNewChat = true, ...rest } = r;
  const { isOnline } = device || {};

  const { chat } = useUI();

  const classObj = {
    "chat-link": true,
    active: chat.current?.user_id === _id,
  };
  const url = new URL(window.location.href);
  const classNames = classes(classObj, className);
  const path = isNewChat ? "new-chat" : "personal-chat";

  url.searchParams.delete("chat-info");

  const handleClick = () => {
    const id = isNewChat ? "user_id" : "_id";

    chat.setCurrent({ [id]: _id, type: "personal-chat" });
  };

  if (isSelf)
    return (
      <div className={classNames}>
        <ProfileImage image={image} placeholder={name} isOnline={isOnline} />

        <div className="details">
          <span className="title name">{name}</span>
          <span className="self">(You)</span>
        </div>
      </div>
    );

  return (
    <Link
      aria-label={name + " chat"}
      className={classNames}
      onClick={handleClick}
      to={`/${path}/` + _id + url.search}
      {...rest}
    >
      <ProfileImage image={image} placeholder={name} isOnline={isOnline} />

      <div className="details">
        <span className="title name">{name}</span>
      </div>
    </Link>
  );
}
