import { createContext, useContext, useState } from "react";
import { navigate as urlNavigation } from "../utilities";

const UIContext = createContext(null);

export function useUI() {
  return useContext(UIContext);
}

export default function UIProvider({ children }) {
  const panels = ["personal-chat", "group-chat", "calls"];
  const [currentPanel, setCurrentPanel] = useState(panels[0]);

  const navigate = (panel, changeURL = false, replace = false) => {
    if (!panels.includes(panel)) return;

    setCurrentPanel(panel);
    if (!!changeURL) urlNavigation(panel, replace);
  };

  const panel = { current: currentPanel, navigate };
  const state = { panel };

  return <UIContext.Provider value={state}>{children}</UIContext.Provider>;
}
