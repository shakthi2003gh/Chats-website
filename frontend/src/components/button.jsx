import { classes } from "../utilities";

export default function Button(props) {
  const { color, theme, label, loading = false, disabled, ...r } = props;
  const { className, ...rest } = r;

  const isPrimary = color === "primary";
  const isDanger = color === "danger";
  const isLink = theme === "link";

  const classObj = {
    btn: true,
    "btn-link": isLink,
    "btn--primary": isPrimary,
    "btn--danger": isDanger,
  };
  const classNames = classes(classObj, className);

  return (
    <button className={classNames} disabled={loading || disabled} {...rest}>
      {label || rest.children || "button"}

      {loading && (
        <div className="loader">
          <div className="loader__bar"></div>
        </div>
      )}
    </button>
  );
}
