import { forwardRef, useEffect, useId, useState } from "react";
import { MdError } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { classes } from "../utilities";

export function Input({ type = "text", onChange = () => {}, ...rest }) {
  const id = useId();

  const handleChange = (e) => {
    const value = e.target.value;

    onChange(value);
  };

  if (type === "textarea")
    return (
      <div className="input simple">
        <textarea id={id} onChange={handleChange} {...rest} />
      </div>
    );

  return (
    <div className="input simple">
      <input id={id} type="text" onChange={handleChange} {...rest} />
    </div>
  );
}

function InputGroup({ type, label, schema, canValidate, ...rest }, ref) {
  const id = useId();
  const [isEmpty, setEmpty] = useState(true);
  const [inputError, setError] = useState("");
  const [showValue, setShowValue] = useState(false);

  const className = classes({ "input-group": true, error: inputError });
  const labelClass = classes({ hidden: !isEmpty });
  const errorIconClass = classes({ error: true, active: inputError });
  const alertClass = classes({ "error-alert": true, active: inputError });

  const EyeIcon = showValue ? FaEye : FaRegEyeSlash;
  const showEyeButton = type === "password" && !rest?.disabled && !isEmpty;

  const handleValidation = () => {
    const { error } = schema.validate(ref.current?.value || "");

    if (error) setError(error.details[0].message);
    if (!error && inputError) setError("");
  };

  const handleChange = (e) => {
    const value = e.target.value.trim("");

    if (value.length === 0) setEmpty(true);
    else setEmpty(false);

    if (canValidate) handleValidation();
  };

  const toggleShowValue = () => {
    setShowValue((prev) => !prev);

    if (ref.current.type === "password") ref.current.type = "text";
    else ref.current.type = "password";

    ref.current.focus();
  };

  useEffect(() => {
    if (canValidate) handleValidation();

    const { value, defaultValue } = rest;
    if (value?.trim() || defaultValue?.trim()) setEmpty(false);
  }, [canValidate]);

  return (
    <div className={className}>
      <div className="container">
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}

        <input
          id={id}
          ref={ref}
          type={type || "text"}
          onChange={handleChange}
          {...rest}
        />

        {showEyeButton && (
          <button
            type="button"
            title={(showValue ? "hide " : "show ") + label}
            className="btn no-btn"
            onClick={toggleShowValue}
          >
            <EyeIcon className="eye" />
          </button>
        )}

        {inputError && <MdError title="error" className={errorIconClass} />}
      </div>

      <span title={inputError} className={alertClass}>
        {inputError}
      </span>
    </div>
  );
}

export default forwardRef(InputGroup);
