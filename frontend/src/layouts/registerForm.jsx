import { useId, useRef, useState } from "react";
import Joi from "joi";
import { useUser } from "../state/user";
import InputGroup from "../components/inputGroup";
import Button from "../components/button";
import Link from "../components/link";

export default function Register({ schema, setMethod }) {
  const { register, setEmail } = useUser();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [canValidate, setCanValidate] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const inputs = [
    {
      id: useId(),
      ref: nameRef,
      label: "name",
      schema: schema.name,
      canValidate,
    },
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
    setMethod("login");
  };

  const handleValidation = () => {
    const payload = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    const { error, value } = Joi.object(schema).validate(payload);
    if (!error) return value;

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canValidate) setCanValidate(true);

    const value = handleValidation();
    if (!value) return;

    setLoading(true);
    register(value)
      .then(() => {
        setMethod("verification");
        setEmail(value.email);
      })
      .finally(() => setLoading(false));
  };

  return (
    <form noValidate className="register-form" onSubmit={handleSubmit}>
      <div className="heading">
        <h1>Register</h1>
        <p>Create an account to start chatting with friends</p>
      </div>

      <div className="inputs">
        {inputs.map(({ id, ...props }) => (
          <InputGroup key={id} {...props} />
        ))}
      </div>

      <div className="footer">
        <Button color="primary" label="register" loading={isLoading} />

        <p>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            label="login"
            color="primary"
            onClick={handleChangeMethod}
          />
        </p>
      </div>
    </form>
  );
}
