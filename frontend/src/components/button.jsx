import { classes } from "../utilities";

export default function Button({ theme, label, loading = false, ...rest }) {
  const isPrimary = true;
  const isLink = theme === "link";

  const classNames = classes({
    btn: true,
    "btn-link": isLink,
    "btn--primary": isPrimary,
  });

  return (
    <button className={classNames} disabled={loading} {...rest}>
      {label || "button"}

      {loading && (
        <div className="loader">
          <div className="loader__bar"></div>
        </div>
      )}
    </button>
  );
}
