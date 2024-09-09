import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "./button";

export default function Menu({ options = [] }) {
  const menuRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div ref={menuRef} className="menu">
      <Button className="btn-menu" onClick={handleToggle} title="menu">
        <BsThreeDotsVertical />
      </Button>

      {isOpen && !!options.length && (
        <Options parentRef={menuRef} options={options} onClose={handleClose} />
      )}
    </div>
  );
}

function Options({ parentRef, options, onClose, ...rest }) {
  const handleKeyboardBlur = (e) => {
    if (e.code === "Escape") onClose();
  };

  const handleBlur = (e) => {
    if (!parentRef.current?.contains(e.target)) onClose();
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyboardBlur);
    window.addEventListener("mousedown", handleBlur);
    window.addEventListener("focusin", handleBlur);

    return () => {
      window.removeEventListener("keyup", handleKeyboardBlur);
      window.removeEventListener("mousedown", handleBlur);
      window.removeEventListener("focusin", handleBlur);
    };
  }, []);

  return (
    <ul className="options" {...rest}>
      {options.map((option, i) => (
        <li key={"option-" + i} className="option" onClick={onClose}>
          {option}
        </li>
      ))}
    </ul>
  );
}
