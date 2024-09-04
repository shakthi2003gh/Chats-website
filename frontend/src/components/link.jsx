import { classes, navigate } from "../utilities";

export default function Link(props) {
  const { label, color, onClick = () => {}, ...r } = props;
  const { className, active, to, ...rest } = r;

  const isPrimary = color === "primary";
  const classObj = {
    link: true,
    "link--primary": isPrimary,
    active,
  };
  const classNames = classes(classObj, className);

  const handleClick = (e) => {
    e.preventDefault();
    onClick();

    navigate(to);
  };

  return (
    <a href={to || "#"} className={classNames} onClick={handleClick} {...rest}>
      {rest.children || label || "link"}
    </a>
  );
}
