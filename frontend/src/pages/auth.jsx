import { useState } from "react";
import Joi from "joi";
import useMediaQuery from "../hooks/useMediaQuery";
import Logo from "../components/logo";
import Login from "../layouts/loginForm";
import Register from "../layouts/registerForm";
import Verification from "../layouts/verificationForm";

const option = { tlds: false };
const schema = {
  name: Joi.string().required().min(3).max(20).label("name"),
  email: Joi.string().email(option).required().min(3).max(40).label("email"),
  password: Joi.string().required().min(3).max(20).label("password"),
};

export default function Auth() {
  const pages = {
    login: Login,
    register: Register,
    verification: Verification,
  };
  const [currentMethod, setMethod] = useState("login");
  const isNotMobileDevice = useMediaQuery(678);

  const CurrentPage = pages[currentMethod];

  return (
    <main className="auth-page">
      <div className="left-side">
        <header>
          <Logo theme={isNotMobileDevice ? "pink" : ""} />
        </header>

        <div className="bg"></div>
      </div>

      <div className="right-side">
        <CurrentPage schema={schema} setMethod={setMethod} />
      </div>
    </main>
  );
}
