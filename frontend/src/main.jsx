import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App";
import StateProvider from "./state";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>

    <ToastContainer />
  </React.StrictMode>
);
