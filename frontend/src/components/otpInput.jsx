import { forwardRef, useState } from "react";
import { useUser } from "../state/user";
import Button from "./button";
import Timer from "./timer";

function OTPInput({ digit = 4, onCatch = () => {}, onSubmit = () => {} }, ref) {
  const { email, otpResend } = useUser();
  const [isResendLoading, setResendLoading] = useState(false);
  const [isResendDisabled, setResendDisable] = useState(true);

  const handleResendDisable = () => {
    setResendDisable(true);
  };

  const handleResendEnable = () => {
    setResendDisable(false);
  };

  const handleResend = () => {
    setResendLoading(true);
    otpResend({ email })
      .then(handleResendDisable)
      .catch(onCatch)
      .finally(() => setResendLoading(false));
  };

  const handleFocus = (id) => {
    const nextInput = ref.current.children[id];

    if (id === digit) return handleSubmit();
    if (nextInput) nextInput.focus();
  };

  const handleRemoveChar = (e) => {
    if (e.key !== "Backspace") return;

    const value = e.target.value;
    const id = Number(e.target.id);

    e.target.value = "";
    if (!value) handleFocus(id - 1);
  };

  const handleChange = (e) => {
    const id = Number(e.target.id);
    const { value, classList } = e.target;

    e.target.value = value
      .split("")
      .filter((n) => Number(n) || n == 0)
      .join()
      .slice(-1);

    if (!!Number(value) || value === "0") handleFocus(id + 1);
    if (classList.contains("invalid") && value) classList.remove("invalid");
  };

  const handleSubmit = () => {
    ref.current.children[digit - 1].blur();

    onSubmit();
  };

  return (
    <div className="otp-input">
      <div className="inputs" ref={ref}>
        {[...Array(digit)].map((_, i) => (
          <input
            id={i}
            key={i}
            type="text"
            pattern="\d*"
            inputMode="numeric"
            autoFocus={i === 0}
            onChange={handleChange}
            onKeyDown={handleRemoveChar}
          />
        ))}
      </div>

      <p>
        Didn't receive an OTP?{" "}
        <Button
          type="button"
          label="resend"
          theme="link"
          onClick={handleResend}
          loading={isResendLoading}
          disabled={isResendDisabled}
        />{" "}
        {isResendDisabled && <Timer onTimerEnd={handleResendEnable} />}
      </p>
    </div>
  );
}

export default forwardRef(OTPInput);
