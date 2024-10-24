import { useUI } from "../state/ui";
import { classes } from "../utilities";
import Link from "./link";
import ProfileImage from "./profileImage";

export default function UserLink(props) {
  const { _id, image, name, device, className, ...rest } = props;
  const { isOnline } = device || {};

  const { chat } = useUI();

  const classObj = {
    "chat-link": true,
    active: chat.current?.user_id === _id,
  };
  const url = new URL(window.location.href);
  const classNames = classes(classObj, className);

  const handleClick = () => {
    chat.setCurrent({ user_id: _id, type: "personal-chat" });
  };

  return (
    <Link
      aria-label={name + " chat"}
      className={classNames}
      onClick={handleClick}
      to={`/new-chat/` + _id + url.search}
      {...rest}
    >
      <ProfileImage image={image} placeholder={name} isOnline={isOnline} />

      <div className="details">
        <span className="title name">{name}</span>
      </div>
    </Link>
  );
}
