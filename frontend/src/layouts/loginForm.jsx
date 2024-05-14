import { useId, useRef, useState } from "react";
import Joi from "joi";
import { useUser } from "../state/user";
import InputGroup from "../components/inputGroup";
import Button from "../components/button";
import Link from "../components/link";

export default function Login({ schema, setMethod }) {
  const { login } = useUser();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [canValidate, setCanValidate] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const inputs = [
    {
      id: useId(),
      ref: emailRef,
      type: "email",
      label: "email",
      schema: schema.email,
      canValidate,
    },
    {
      id: useId(),
      ref: passwordRef,
      type: "password",
      label: "password",
      schema: schema.password,
      canValidate,
    },
  ];

  const handleChangeMethod = () => {
    setMethod("register");
  };

  const handleValidation = () => {
    const payload = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    const s = { email: schema.email, password: schema.password };
    const { error, value } = Joi.object(s).validate(payload);
    if (!error) return value;

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canValidate) setCanValidate(true);

    const value = handleValidation();
    if (!value) return;

    setLoading(true);
    login(value).finally(() => setLoading(false));
  };

  return (
    <form noValidate className="login-form" onSubmit={handleSubmit}>
      <div className="heading">
        <h1>Login</h1>
        <p>Enter your credentials to access your account</p>
      </div>

      <div className="inputs">
        {inputs.map(({ id, ...props }) => (
          <InputGroup key={id} {...props} />
        ))}
      </div>

      <div className="footer">
        <Button label="login" loading={isLoading} />

        <p>
          Don't have an account?{" "}
          <Link label="register" onClick={handleChangeMethod} />
        </p>
      </div>
    </form>
  );
}
