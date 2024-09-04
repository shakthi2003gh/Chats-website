import { useUI } from "../state/ui";
import Logo from "../components/logo";
import Link from "../components/link";
import Button from "../components/button";
import iconSprite from "../assets/icon-sprite.svg";

export default function SideBar(props) {
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
    <aside aria-label="Sidebar" className="side-bar" {...props}>
      <Logo icon />

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

      <div className="actions">
        <Button title="Settings">
          <svg className="icon">
            <use xlinkHref={iconSprite + "#settings-icon"}></use>
          </svg>
        </Button>
      </div>
    </aside>
  );
}
