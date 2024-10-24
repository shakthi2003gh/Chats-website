import { useUI } from "../state/ui";
import Link from "./link";
import ProfileImage from "./profileImage";

export default function RenderOnlineUsers({ data }) {
  const { chat } = useUI();

  return (
    <ul className="online-users">
      {data.map(({ _id, ...user }) => {
        const handleClick = () => {
          if (chat.current?._id === _id) return;

          chat.setCurrent({ _id, type: "personal-chat" });
          chat.toggleShowContact(false);
        };

        return (
          <li key={_id}>
            <Link to={`/personal-chat/` + _id} onClick={handleClick}>
              <ProfileImage {...user} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
