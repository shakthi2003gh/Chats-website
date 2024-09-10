import { createContext, useContext, useEffect, useState } from "react";
import { FaMobile, FaDesktop, FaTabletAlt, FaTv } from "react-icons/fa";
import { FaEdge, FaChrome, FaFirefox } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import { RiErrorWarningLine } from "react-icons/ri";
import { formatTime } from "../utilities";
import { Input } from "../components/inputGroup";
import Button from "../components/button";

const PopupContext = createContext(null);

export function usePopup() {
  return useContext(PopupContext);
}

export default function PopupProvider({ children }) {
  const initialEvent = { handleCancel: undefined, onConfirm: undefined };

  const [show, setShow] = useState(false);
  const [type, setType] = useState("confirmation");
  const [data, setData] = useState(null);
  const [event, setEvent] = useState(initialEvent);

  const handleCancel = () => {
    setShow(false);
    setData(null);
    setEvent(initialEvent);
  };

  const handleClose = (e) => {
    if (["device", "edit"].includes(type) && e.type === "click") return;
    if (e.code === "Escape" || e.type === "click") handleCancel();
  };

  const display = ({ type, data, onConfirm }) => {
    setShow(true);
    setType(type);
    setData(data);
    setEvent({ onConfirm, handleCancel });
  };

  useEffect(() => {
    window.addEventListener("keyup", handleClose);

    return () => window.removeEventListener("keyup", handleClose);
  }, [type]);

  const props = { data, event };

  const containers = {
    confirmation: ConfirmationContainer(props),
    edit: EditContainer(props),
    device: DeviceLoginContainer(props),
    logout: logoutContainer(props),
  };

  return (
    <PopupContext.Provider value={{ display, isShowPopup: show }}>
      {children}

      {show && (
        <div className="popup" onClick={handleClose}>
          {containers[type]}
        </div>
      )}
    </PopupContext.Provider>
  );
}

function ConfirmationContainer(props) {
  const { data, event } = props || {};
  const { heading, description } = data || {};
  const { handleCancel, onConfirm } = event || {};

  const className = "confirmation container";

  const handleConfirm = () => {
    handleCancel?.();
    onConfirm?.();
  };

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <h3 className="title">{heading || "heading"}</h3>

      <p>{description || "Are you sure want to do this?"}</p>

      <div className="buttons">
        <Button onClick={handleCancel}>cancel</Button>

        <Button color="danger" onClick={handleConfirm}>
          confirm
        </Button>
      </div>
    </div>
  );
}

function logoutContainer(props) {
  const { event } = props || {};
  const { handleCancel } = event || {};

  const className = "logout container";

  const handleConfirm = () => {
    handleCancel?.();
  };

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <h3 className="title">You were logged out!</h3>

      <p>
        Your account was accessed on another device. Please log in again to
        continue.
      </p>

      <Button color="danger" onClick={handleConfirm}>
        Log In Again
      </Button>
    </div>
  );
}

function DeviceLoginContainer(props) {
  const { data, event } = props || {};
  const { label, lastUsed, message } = data || {};
  const { handleCancel, onConfirm } = event || {};

  const className = "device-auth container";

  const handleConfirm = () => {
    handleCancel?.();
    onConfirm?.();
  };

  const Device = ({ type }) => {
    const browserKey = " - Browser";
    if (type.includes(browserKey)) type = type.replace(browserKey, "");

    const icons = {
      mobile: <FaMobile />,
      tablet: <FaTabletAlt />,
      smarttv: <FaTv />,
      console: <GiConsoleController />,
      Chrome: <FaChrome />,
      Edge: <FaEdge />,
      FireFox: <FaFirefox />,
    };

    return <div className="device-icon">{icons[type] || <FaDesktop />}</div>;
  };

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <h3 className="title">Already Logged In</h3>
      <p>{message || "User logged in other device"}</p>

      <div className="device">
        <Device type={label} />

        <div>
          <div className="device-type">{label || "Desktop"}</div>

          <div className="last-used">
            Last Used: <time dateTime={lastUsed}>{formatTime(lastUsed)}</time>
          </div>
        </div>
      </div>

      <p className="warning">
        <RiErrorWarningLine />
        Logging in on this device will log you out from the other device.
      </p>

      <div className="buttons">
        <Button onClick={handleCancel}>Stay logout</Button>

        <Button color="danger" onClick={handleConfirm}>
          Log in
        </Button>
      </div>
    </div>
  );
}

function EditContainer(props) {
  const { data, event } = props || {};
  const { heading, value: defaultValue, method = "input" } = data || {};
  const { handleCancel, onConfirm } = event || {};

  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const type = method === "textarea" ? "textarea" : "text";
  const className = "edit container";
  const v = value || defaultValue;
  const isDisabled = defaultValue === v;

  const handleConfirm = () => {
    setLoading(true);
    onConfirm?.(value)
      .then(handleCancel)
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleConfirm();
  };

  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
  }, [defaultValue, setValue]);

  return (
    <form
      className={className}
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <div className="title">{heading || "heading"}</div>

      <Input
        type={type}
        onChange={setValue}
        defaultValue={defaultValue}
        autoFocus
      />

      <div className="buttons">
        <Button type="button" onClick={handleCancel}>
          cancel
        </Button>

        <Button
          type="submit"
          color="primary"
          loading={isLoading}
          disabled={isDisabled}
        >
          confirm
        </Button>
      </div>
    </form>
  );
}
