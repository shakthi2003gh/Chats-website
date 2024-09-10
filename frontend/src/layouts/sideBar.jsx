import { useUI } from "../state/ui";
import { classes } from "../utilities";
import Logo from "../components/logo";
import Navigation from "../components/navigation";
import Button from "../components/button";
import iconSprite from "../assets/icon-sprite.svg";

export default function SideBar(props) {
  const { floatingPanel, accessibility } = useUI();
  const settingClass = classes({
    active: floatingPanel.current === "settings",
  });

  return (
    <aside
      aria-label="Sidebar"
      className="side-bar"
      inert={accessibility?.isChatOpen}
      {...props}
    >
      <Logo icon />

      <Navigation />

      <div className="actions">
        <Button
          title="Settings"
          className={settingClass}
          onClick={() => floatingPanel.navigate("settings")}
        >
          <svg className="icon">
            <use xlinkHref={iconSprite + "#settings-icon"}></use>
          </svg>
        </Button>
      </div>
    </aside>
  );
}
