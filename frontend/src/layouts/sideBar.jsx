import { useUI } from "../state/ui";
import Logo from "../components/logo";
import Navigation from "../components/navigation";
import Button from "../components/button";
import iconSprite from "../assets/icon-sprite.svg";

export default function SideBar(props) {
  return (
    <aside aria-label="Sidebar" className="side-bar" {...props}>
      <Logo icon />

      <Navigation />

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
