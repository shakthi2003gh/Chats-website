import logoDark from "../assets/logo-dark.svg";
import logoLight from "../assets/logo-light.svg";
import logoPink from "../assets/logo-pink.svg";
import logoGreen from "../assets/logo-green.svg";
import logoBlue from "../assets/logo-blue.svg";
import logoYellow from "../assets/logo-yellow.svg";

export default function Logo({ color, icon }) {
  const darkMode = true;
  const defaultLogo = darkMode ? logoDark : logoLight;
  const logos = {
    pink: logoPink,
    green: logoGreen,
    blue: logoBlue,
    yellow: logoYellow,
  };

  const src = color && !!logos[color] ? logos[color] : defaultLogo;

  return (
    <div className={icon ? "logo-icon" : "logo"}>
      <img
        title="Chats - Messaging Website"
        src={icon ? "/favicon.svg" : src}
        alt="chats website"
      />
    </div>
  );
}
