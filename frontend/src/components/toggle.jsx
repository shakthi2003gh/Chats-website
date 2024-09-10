import { useState } from "react";

export default function Toggle(props) {
  const { ON, height, gap, onToggle = () => {}, ...rest } = props;

  const style = { "--height": height, "--gap": gap };

  const handleKeyBoardToggle = (e) => {
    if (e.keyCode !== 13) return;

    onToggle();
  };

  return (
    <label
      className="toggle"
      onKeyDown={handleKeyBoardToggle}
      style={style}
      {...rest}
    >
      <div className="nob"></div>
      <input
        name="toggle"
        type="checkbox"
        checked={ON}
        onChange={onToggle}
        hidden
      />
    </label>
  );
}
