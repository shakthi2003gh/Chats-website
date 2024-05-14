import { classes } from "../utilities";

export default function Link({ label, onClick, ...rest }) {
  const classNames = classes({ link: true, "link--primary": true });

  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <a
      href={label || "#"}
      className={classNames}
      onClick={handleClick}
      {...rest}
    >
      {label || "link"}
    </a>
  );
}
