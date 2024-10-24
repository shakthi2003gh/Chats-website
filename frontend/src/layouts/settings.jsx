import { MdLogout } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";
import { VscColorMode } from "react-icons/vsc";
import { IoIosColorFill } from "react-icons/io";
import { useUI } from "../state/ui";
import { useUser } from "../state/user";
import { classes } from "../utilities";
import Link from "../components/link";
import { PanelHeader } from "../components/headers";
import ProfileImage from "../components/profileImage";
import RenderSettings from "../components/renderSettings";

export default function Settings(props) {
  const { title, className, ...rest } = props;
  const { floatingPanel, theme } = useUI();
  const { user, logout } = useUser();
  const { image, name, about } = user;

  const url = new URL(window.location.href);

  const handleNavigate = (path) => () => {
    floatingPanel.navigate(path);
  };

  const settingsLinks = {
    settings: [
      {
        type: "link",
        label: "appearance",
        Icon: IoMdColorPalette,
        to: url.pathname + "?show=appearance",
        onClick: handleNavigate("appearance"),
      },
      {
        type: "btn",
        label: "logout",
        Icon: MdLogout,
        onClick: logout,
        className: "danger",
      },
    ],
    appearance: [
      {
        type: "toggle-btn",
        label: "dark mode",
        Icon: VscColorMode,
        value: theme.isDark,
        onClick: theme.toggle,
      },
      {
        type: "container",
        label: "theme",
        Icon: IoIosColorFill,
        Component: <ColorSetting />,
      },
    ],
  };

  const classObj = { "floating-panel": true, settings: true };
  const classNames = classes(classObj, className);
  const ariaLabel = title + " Panel";

  return (
    <section className={classNames} aria-label={ariaLabel} {...rest}>
      <PanelHeader type="settings" title={title} />

      {title === "settings" && (
        <Link
          className="setting__link profile"
          to={url.pathname + "?show=profile"}
          onClick={handleNavigate("profile")}
          autoFocus
        >
          <ProfileImage image={image} placeholder={name} />

          <div className="profile__detail">
            <div className="name title">{name}</div>
            <div className="about">{about}</div>
          </div>

          <MdNavigateNext className="arrow" />
        </Link>
      )}

      <RenderSettings settings={settingsLinks[title]} />
    </section>
  );
}

function ColorSetting() {
  const { color } = useUI();
  const { list: colors, current, setColor } = color;

  return (
    <div className="colors">
      {colors.map((color, i) => {
        const classObj = { "color-btn": true, selected: color === current };
        const classNames = classes(classObj, color);

        return (
          <button
            key={"color-" + i}
            className={classNames}
            onClick={setColor(color)}
          >
            {color}
          </button>
        );
      })}
    </div>
  );
}
