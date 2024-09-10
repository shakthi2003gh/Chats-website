import { useEffect, useState } from "react";
import Joi from "joi";
import { useUI } from "../state/ui";
import { navigate } from "../utilities";
import Logo from "../components/logo";
import Login from "../layouts/loginForm";
import { usePopup } from "../layouts/popup";
import Register from "../layouts/registerForm";
import Verification from "../layouts/verificationForm";

const option = { tlds: false };
const schema = {
  name: Joi.string().required().min(3).max(20).label("name"),
  email: Joi.string().email(option).required().min(3).max(40).label("email"),
  password: Joi.string().required().min(3).max(20).label("password"),
};

export default function Auth() {
  const { isShowPopup } = usePopup();
  const { mediaQuery, color } = useUI();
  const [currentMethod, setMethod] = useState("login");

  const pages = {
    login: Login,
    register: Register,
    verification: Verification,
  };

  const CurrentPage = pages[currentMethod];

  useEffect(() => {
    navigate("/auth", true);
  }, []);

  return (
    <main className="auth-page" inert={isShowPopup ? "true" : undefined}>
      <div className="left-side">
        <header>
          <Logo color={!mediaQuery.isSmall ? color.current : ""} />
        </header>

        <div className="bg"></div>
      </div>

      <div className="right-side">
        <CurrentPage schema={schema} setMethod={setMethod} />
      </div>
    </main>
  );
}
