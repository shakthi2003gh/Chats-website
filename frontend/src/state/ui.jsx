import { createContext, useContext, useEffect, useState } from "react";
import { navigate as urlNavigation } from "../utilities";
import useMediaQuery from "../hooks/useMediaQuery";

const colors = ["pink", "green", "yellow", "blue"];
const panels = ["personal-chat", "group-chat", "calls"];
const floatingPanels = [
  "profile",
  "new-chat",
  "new-group",
  "settings",
  "appearance",
];

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const InitialTheme = localStorage.getItem("theme") || getSystemTheme();
document.body.setAttribute(InitialTheme, true);

const InitialColor = localStorage.getItem("color") || "pink";
document.body.setAttribute("color", InitialColor);

const UIContext = createContext(null);

export function useUI() {
  return useContext(UIContext);
}

export default function UIProvider({ children }) {
  const [isDark, setDark] = useState(InitialTheme === "dark");
  const [currentColor, setCurrentColor] = useState(InitialColor || colors[0]);
  const [currentPanel, setCurrentPanel] = useState(panels[0]);
  const [FloatingPanel, setCurrentFloatingPanel] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const isSmallerDevice = !useMediaQuery(475);
  const isSmallDevice = !useMediaQuery(678);
  const isFloatingPanelOpen = FloatingPanel ? "true" : undefined;
  const isChatOpen = isSmallDevice ? currentChat && "true" : undefined;
  const isChatInfoOpen =
    !useMediaQuery(1111) && currentChat?.showInfo ? "true" : undefined;

  const navigate = (panel, changeURL = false, replace = false) => {
    if (!panels.includes(panel)) return;

    setCurrentPanel(panel);
    setCurrentFloatingPanel(null);
    if (!!changeURL) urlNavigation(panel, replace);
  };

  const navigateFloating = (panel, replace = false) => {
    if (!floatingPanels.includes(panel))
      return urlNavigation(panels[0], replace);

    const url = new URL(window.location.href);
    const canShow = !(url.searchParams.get("show") === panel);

    url.searchParams[canShow ? "set" : "delete"]("show", panel);

    setCurrentFloatingPanel(canShow ? panel : null);

    urlNavigation(url.pathname + url.search, replace);
  };

  const handleNavigation = () => {
    const path = window.location.pathname;
    const url = new URL(window.location.href);
    const panel = path.split("/")[1];
    const chat_id = path.split("/")[2];
    const floatingPanel = url.searchParams.get("show");
    const showInfo = chat_id && !!url.searchParams.get("chat-info");
    const id = panel === "new-chat" ? "user_id" : "_id";
    const type = panel;

    navigate(panel || panels[0]);
    setCurrentFloatingPanel(floatingPanel);
    setCurrentChat(chat_id ? { [id]: chat_id, showInfo, type } : null);
  };

  const themeToggle = () => {
    setDark((prev) => {
      const currentTheme = !prev ? "dark" : "light";
      const prevTheme = prev ? "dark" : "light";

      localStorage.setItem("theme", currentTheme);
      document.body.removeAttribute(prevTheme);
      document.body.setAttribute(currentTheme, true);

      return !prev;
    });
  };

  const setColor = (color) => () => {
    setCurrentColor(color);
    localStorage.setItem("color", color);
    document.body.setAttribute("color", color);
  };

  const toggleShowInfo = (showInfo) => {
    setCurrentChat((prev) => {
      const url = new URL(window.location.href);
      const show = showInfo ?? !prev;

      if (show) url.searchParams.set("chat-info", show);
      else url.searchParams.delete("chat-info");

      urlNavigation(url.pathname + url.search);
      return { ...prev, showInfo: show };
    });
  };

  const reset = () => {
    setCurrentPanel(panels[0]);
    setCurrentFloatingPanel(null);
    setCurrentChat(null);
  };

  useEffect(() => {
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  const info = { toggleShowInfo };
  const theme = { isDark, isLight: !isDark, toggle: themeToggle };
  const color = { list: colors, current: currentColor, setColor };
  const panel = { current: currentPanel, navigate };
  const floatingPanel = { current: FloatingPanel, navigate: navigateFloating };
  const chat = { current: currentChat, setCurrent: setCurrentChat, ...info };
  const mediaQuery = { isSmaller: isSmallerDevice, isSmall: isSmallDevice };
  const accessibility = { isFloatingPanelOpen, isChatOpen, isChatInfoOpen };

  const displayOne = { panel, floatingPanel };
  const settings = { theme, color };
  const app = { mediaQuery, accessibility, reset };
  const state = { ...displayOne, ...settings, chat, ...app };

  return <UIContext.Provider value={state}>{children}</UIContext.Provider>;
}
