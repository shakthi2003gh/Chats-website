import logoDark from "../assets/logo-dark.svg";
import logoLight from "../assets/logo-light.svg";
import logoPink from "../assets/logo-pink.svg";
import logoGreen from "../assets/logo-green.svg";
import logoBlue from "../assets/logo-blue.svg";
import logoYellow from "../assets/logo-yellow.svg";

export default function Logo({ theme }) {
  const darkMode = true;
  const defaultLogo = darkMode ? logoDark : logoLight;
  const logos = {
    pink: logoPink,
    green: logoGreen,
    blue: logoBlue,
    yellow: logoYellow,
  };

  const src = theme && !!logos[theme] ? logos[theme] : defaultLogo;

  return (
    <div className="logo">
      <img src={src} alt="chats website logo" />
    </div>
  );
}
