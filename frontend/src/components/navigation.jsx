import { useUI } from "../state/ui";
import Link from "./link";
import iconSprite from "../assets/icon-sprite.svg";

export default function Navigation({ ...rest }) {
  const { panel } = useUI();
  const links = [
    {
      id: "personal-chat",
      name: "Personal chats",
      icon: "chat",
    },
    {
      id: "group-chat",
      name: "Group chats",
      icon: "group",
    },
    {
      id: "calls",
      name: "Calls",
      icon: "call",
    },
  ];

  return (
    <nav className="navigation" {...rest}>
      {links.map(({ id, icon, name }) => (
        <Link
          key={id}
          title={name}
          to={"/" + id}
          onClick={() => panel.navigate(id, true)}
          active={id === panel.current}
        >
          <svg aria-label={icon + " icon"} className="icon">
            <use xlinkHref={iconSprite + `#${icon}-icon`}></use>
          </svg>
        </Link>
      ))}
    </nav>
  );
}
