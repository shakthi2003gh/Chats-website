import { useRef, useState } from "react";
import { useUser } from "../state/user";
import Button from "../components/button";
import Link from "../components/link";
import OtpInput from "../components/otpInput";

export default function Verification({ setMethod }) {
  const inputRef = useRef({});
  const { email, verify } = useUser();
  const [isLoading, setLoading] = useState(false);

  const handleChangeMethod = () => {
    setMethod("register");
  };

  const handleValidation = () => {
    let otp = "";

    [...Array(4)].map((_, i) => {
      const { value, classList } = inputRef.current.children[i];
      const v = value.trim();

      if (v) otp += v;

      if (!v) classList.add("invalid");
      if (classList.contains("invalid") && v) classList.remove("invalid");
    });

    return otp;
  };

  const handleInvalidInput = () => {
    [...Array(4)].map((_, i) => {
      const { classList } = inputRef.current.children[i];

      if (i === 0) inputRef.current.children[i].focus();
      classList.add("invalid");
      inputRef.current.children[i].value = "";
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const OTP = handleValidation();
    if (!(OTP && OTP.length === 4)) return;

    const payload = { email, OTP };

    setLoading(true);
    verify(payload)
      .catch(handleInvalidInput)
      .finally(() => setLoading(false));
  };

  return (
    <form noValidate className="verification-form" onSubmit={handleSubmit}>
      <div className="heading">
        <h1>Verify</h1>

        <p>
          Verify your account using the OTP sent to your email <b>{email}</b>
        </p>
      </div>

      <OtpInput
        ref={inputRef}
        onCatch={handleChangeMethod}
        onSubmit={handleSubmit}
      />

      <div className="footer">
        <Button label="Verify" loading={isLoading} />

        <p>
          If you entered the wrong email, please{" "}
          <Link label="register" onClick={handleChangeMethod} /> again.
        </p>
      </div>
    </form>
  );
}
