import { MdNavigateNext } from "react-icons/md";
import { classes } from "../utilities";
import Link from "../components/link";
import Toggle from "./toggle";

export default function RenderSettings({ settings = [], clabel = "setting" }) {
  return settings.map((props, i) => {
    const { type, Icon, label, className, to, ...r } = props;
    const { value, onToggle, Component, ...rest } = r;

    const key = clabel + "-" + i;
    const classObj = {
      [clabel + "__btn"]: type === "btn",
      [clabel + "__toggle"]: type === "toggle-btn",
      [clabel + "__link"]: type === "link",
      [clabel + "__container"]: type === "container",
    };
    const classNames = classes(classObj, className);

    const settingComponent = {
      btn: (
        <button key={key} className={classNames} {...rest}>
          <Icon className="icon" />
          {label}
        </button>
      ),
      "toggle-btn": (
        <button key={key} className={classNames} {...rest}>
          <Icon className="icon" />
          {label}
          <Toggle ON={value} onToggle={rest.onClick} />
        </button>
      ),
      link: (
        <Link key={key} className={classNames} to={to} {...rest}>
          <Icon className="icon" />
          {label}

          <MdNavigateNext className="arrow" />
        </Link>
      ),
      container: (
        <div key={key} className={classNames} onClick={rest?.onClick} {...rest}>
          <div className="header">
            <Icon className="icon" />

            {label}
          </div>

          {Component}
        </div>
      ),
    };

    return settingComponent[type];
  });
}
