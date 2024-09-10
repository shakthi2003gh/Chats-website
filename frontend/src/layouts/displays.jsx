import { useUI } from "../state/ui";
import { useData } from "../state/data";
import Logo from "../components/logo";
import Button from "../components/button";
import Navigation from "../components/navigation";
import { RenderChatList, RenderUserList } from "../components/renderList";
import ListPanel from "./listPanel";
import Profile from "./profile";
import Settings from "./settings";

export function Display1() {
  const { panel, floatingPanel, mediaQuery, accessibility } = useUI();
  const { people, chats, isLoading } = useData();
  const { personalChats, groupChats } = chats || {};
  const { isChatOpen, isFloatingPanelOpen } = accessibility || {};
  const currentFloatingPanel = floatingPanel.current;

  const handleSearch = (data, search) => {
    return data.name.match(new RegExp(search, "gi"));
  };

  const panelProps = {
    "personal-chat": {
      "aria-label": "Chat Panel",
      title: "Personal chats",
      list: { title: "Messages", data: personalChats },
      RenderList: RenderChatList,
      NoData: NoData({ currentPanel: "personal-chat" }),
    },
    "group-chat": {
      "aria-label": "Group Panel",
      title: "Group chats",
      list: { title: "Groups", data: groupChats },
      RenderList: RenderChatList,
      NoData: NoData({ currentPanel: "group-chat" }),
    },
    calls: {
      "aria-label": "Call Panel",
      title: "Calls",
      list: { title: "History" },
      NoData: NoData({ currentPanel: "calls" }),
    },
  };

  const floatingPanelProps = {
    "new-chat": {
      type: currentFloatingPanel,
      className: "floating-panel new-chat",
      "aria-label": "Create New Chat Panel",
      title: "New Chat",
      list: { title: "People", data: people },
      RenderList: RenderUserList,
      loading: isLoading,
      onSearch: handleSearch,
    },
    settings: {
      title: "settings",
      "aria-label": "Settings Panel",
    },
    appearance: {
      title: "appearance",
      "aria-label": "Appearence Setting Panel",
      className: "appearance-settings",
    },
  };

  const props = {
    ...panelProps[panel.current],
    onSearch: handleSearch,
  };

  const floatingPanelComponent = {
    profile: <Profile />,
    "new-chat": <ListPanel {...floatingPanelProps["new-chat"]} />,
    settings: <Settings {...floatingPanelProps["settings"]} />,
    appearance: <Settings {...floatingPanelProps["appearance"]} />,
  };

  return (
    <div className="display-1" inert={isChatOpen}>
      <ListPanel type={panel.current} inert={isFloatingPanelOpen} {...props} />

      {currentFloatingPanel && floatingPanelComponent[currentFloatingPanel]}

      {mediaQuery.isSmaller && <Navigation inert={isFloatingPanelOpen} />}
    </div>
  );
}

export function Display2() {
  return (
    <div className="display-2">
      <section className="welcome">
        <Logo />
      </section>
    </div>
  );
}

function NoData({ currentPanel }) {
  const { floatingPanel } = useUI();

  const handleNavigate = (path) => () => {
    floatingPanel.navigate(path);
  };

  const props = {
    "personal-chat": {
      title: "No Chat Yet!",
      description:
        "You don't have any friends added yet. Add friends to start chatting.",
      label: "Connect with friend",
      onClick: handleNavigate("new-chat"),
    },
    "group-chat": {
      title: "No Groups Yet!",
      description:
        "You are not a member of any groups yet. Join or create groups to start group chatting.",
      label: "Create Group",
    },
    calls: {
      title: "Call Feature",
      description: "Coming soon...",
    },
  };

  const { title, description, label, onClick } = props[currentPanel];

  return (
    <div className="no-chat">
      <h1>{title}</h1>

      <p>{description}</p>

      {label && <Button color="primary" label={label} onClick={onClick} />}
    </div>
  );
}
