import React from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function DropDown(props) {
  const { title, count, children, open = false, headingTag = "h2" } = props;

  return (
    <details className="drop-down" open={open}>
      <summary>
        {React.createElement(headingTag, { className: "heading" }, title)}

        {count && <span className="count">{count}</span>}

        <IoIosArrowDown />
      </summary>

      {children}
    </details>
  );
}
