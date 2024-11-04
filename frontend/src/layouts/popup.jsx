import { createContext, useContext, useEffect, useState } from "react";
import { FaMobile, FaDesktop, FaTabletAlt, FaTv } from "react-icons/fa";
import { FaEdge, FaChrome, FaFirefox } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import { RiErrorWarningLine } from "react-icons/ri";
import { formatTime, navigate } from "../utilities";
import { Input } from "../components/inputGroup";
import Button from "../components/button";
import RenderPeopleList from "../components/renderPeopleList";
import { PublicHTTP } from "../services/http/public";
import { IoMdRefresh } from "react-icons/io";

const PopupContext = createContext(null);

export function usePopup() {
  return useContext(PopupContext);
}

export default function PopupProvider({ children }) {
  const initialEvent = { handleClose: undefined, onConfirm: undefined };

  const [show, setShow] = useState(false);
  const [type, setType] = useState("confirmation");
  const [data, setData] = useState(null);
  const [event, setEvent] = useState(initialEvent);

  const updateURL = (open = false) => {
    const url = new URL(window.location.href);
    url.searchParams[open ? "set" : "delete"]("popup", open || undefined);
    navigate(url.pathname + url.search, !open);
  };

  const handleClose = () => {
    window.popupOpen = false;
    setShow(false);
    setData(null);
    setEvent(initialEvent);

    updateURL();
  };

  const handleCancel = (e) => {
    const nonAutoExitable = ["device", "edit", "addMember"];
    if (nonAutoExitable.includes(type) && e.type === "click") return;

    if (e.code === "Escape" || e.type === "click") handleClose();
  };

  const display = ({ type, data, onConfirm }) => {
    window.popupOpen = true;
    setShow(true);
    setType(type);
    setData(data);
    setEvent({ onConfirm, handleClose });

    updateURL(true);
  };

  useEffect(() => {
    window.addEventListener("keyup", handleCancel);

    return () => window.removeEventListener("keyup", handleCancel);
  }, [type]);

  const containers = {
    confirmation: ConfirmationContainer,
    edit: EditContainer,
    device: DeviceLoginContainer,
    logout: LogoutContainer,
    addMember: AddMemberContainer,
  };

  const Container = containers[type];
  const props = { data, event };
  const state = { display, isShowPopup: show, close: handleClose };

  return (
    <PopupContext.Provider value={state}>
      {children}

      {show && (
        <div className="popup" onClick={handleCancel}>
          <Container {...props} />
        </div>
      )}
    </PopupContext.Provider>
  );
}

function ConfirmationContainer(props) {
  const { data, event } = props || {};
  const { heading, description } = data || {};
  const { handleClose, onConfirm } = event || {};

  const className = "confirmation container";

  const handleConfirm = () => {
    handleClose?.();
    onConfirm?.();
  };

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <h3 className="title">{heading || "heading"}</h3>

      <p>{description || "Are you sure want to do this?"}</p>

      <div className="buttons">
        <Button onClick={handleClose}>cancel</Button>

        <Button color="danger" onClick={handleConfirm}>
          confirm
        </Button>
      </div>
    </div>
  );
}

function LogoutContainer(props) {
  const { event } = props || {};
  const { handleClose } = event || {};

  const className = "logout container";

  const handleConfirm = () => {
    handleClose?.();
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
  const { handleClose, onConfirm } = event || {};

  const className = "device-auth container";

  const handleConfirm = () => {
    handleClose?.();
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
        <Button onClick={handleClose}>Stay logout</Button>

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
  const { handleClose, onConfirm } = event || {};

  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const type = method === "textarea" ? "textarea" : "text";
  const className = "edit container";
  const v = value || defaultValue;
  const isDisabled = defaultValue === v;

  const handleConfirm = () => {
    setLoading(true);
    onConfirm?.(value)
      .then(handleClose)
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
        <Button type="button" onClick={handleClose}>
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

function AddMemberContainer(props) {
  const { data, event } = props || {};

  const { members = [] } = data || {};
  const { handleClose, onConfirm } = event || {};

  const [search, setSearch] = useState("");
  const [people, setPeople] = useState([]);
  const [selected, setSelect] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const className = "add-member container";
  const totalCount = 30;
  const membersCount = members?.length || 0;
  const selectedCount = selected?.length || 0;
  const maxCount = totalCount - membersCount;
  const isDisabled = !selectedCount || selectedCount > maxCount;

  const handleGetPeople = () => {
    setLoading(true);

    PublicHTTP.getPeople()
      .then(setPeople)
      .finally(() => setLoading(false));
  };

  const handleFilterExist = ({ _id: user_id }) => {
    return !members.some(({ _id }) => _id === user_id);
  };

  const handleSearchFilter = (data) => {
    if (!search) return true;

    return data.name.match(new RegExp(search, "gi"));
  };

  const handleSelect = (user) => {
    setSelect((prev) => {
      if (prev.some(({ _id }) => _id === user?._id))
        return prev.filter(({ _id }) => _id !== user?._id);

      if (members.length < 30) return [...prev, user];
      return prev;
    });
  };

  const handleConfirm = () => {
    onConfirm(selected);
    handleClose();
  };

  useEffect(handleGetPeople, []);

  const filteredList = people
    .filter(handleFilterExist)
    .filter(handleSearchFilter);

  return (
    <div className={className}>
      <h3>Add Members ({membersCount}/30)</h3>

      <Input placeholder="search..." onChange={setSearch} />

      <div className="people">
        <div className="header">
          <h4>People</h4>

          <button
            title="Refresh"
            className="btn no-btn refresh"
            onClick={handleGetPeople}
            disabled={isLoading}
          >
            <IoMdRefresh />
          </button>
        </div>

        <RenderPeopleList
          list={filteredList}
          selectedList={selected}
          loading={isLoading}
          onSelect={handleSelect}
        />
      </div>

      <div className="buttons">
        <Button onClick={handleClose}>cancel</Button>

        <Button color="danger" onClick={handleConfirm} disabled={isDisabled}>
          Add ({selectedCount}/{totalCount - membersCount})
        </Button>
      </div>
    </div>
  );
}
