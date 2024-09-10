import { createContext, useContext, useState } from "react";
import { navigate as urlNavigation } from "../utilities";
import useMediaQuery from "../hooks/useMediaQuery";

const UIContext = createContext(null);

export function useUI() {
  return useContext(UIContext);
}

export default function UIProvider({ children }) {
  const panels = ["personal-chat", "group-chat", "calls"];
  const [currentPanel, setCurrentPanel] = useState(panels[0]);
  const [currentChat, setCurrentChat] = useState(null);
  const isSmallerDevice = !useMediaQuery(475);
  const isSmallDevice = !useMediaQuery(678);

  const navigate = (panel, changeURL = false, replace = false) => {
    if (!panels.includes(panel)) return;

    setCurrentPanel(panel);
    if (!!changeURL) urlNavigation(panel, replace);
  };

  const panel = { current: currentPanel, navigate };
  const chat = { current: currentChat, setCurrent: setCurrentChat };
  const mediaQuery = { isSmaller: isSmallerDevice, isSmall: isSmallDevice };

  const state = { panel, mediaQuery, chat };

  return <UIContext.Provider value={state}>{children}</UIContext.Provider>;
}
