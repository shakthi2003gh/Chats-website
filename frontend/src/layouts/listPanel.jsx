import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useUI } from "../state/ui";
import { classes } from "../utilities";
import { MobileHeader, PanelHeader } from "../components/headers";
import { Input } from "../components/inputGroup";
import RenderOnlineUsers from "../components/renderOnlineUsers";

export default function ListPanel(props) {
  const { title, list, onSearch, className, loading, ...r } = props;
  const { type, RenderList, ActionBtn, NoData, ...rest } = r;

  const { mediaQuery } = useUI();
  const { title: listTitle, data } = list || {};
  const [search, setSearch] = useState("");
  const classNames = classes({ "list-panel": true }, className);
  const chatPanels = ["personal-chat", "group-chat"];
  const isChatPanel = chatPanels.includes(type);

  if (!!NoData && !data?.length)
    return (
      <section className={classNames} {...rest}>
        {mediaQuery.isSmaller && <MobileHeader />}

        {NoData}
      </section>
    );

  const handleSearchFilter = (data) => {
    if (!onSearch) return true;
    if (!search) return true;

    return onSearch(data, search);
  };

  const handleSort = ({ lastMessage: a }, { lastMessage: b }) => {
    if (!isChatPanel) return 0;
    return new Date(b.createdAt) - new Date(a.createdAt);
  };

  const getOnlineUsers = (data) => {
    return data
      .filter((chat) => chat.isOnline)
      .map(({ _id, name, image, isOnline }) => {
        return { _id, image, placeholder: name, isOnline };
      })
      .sort(({ placeholder: a }, { placeholder: b }) => {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      });
  };

  const filteredList = (data || []).filter(handleSearchFilter);
  const sortedList = filteredList.sort(handleSort);
  const onlineUsers = getOnlineUsers(filteredList) || [];

  return (
    <section className={classNames} {...rest}>
      <PanelHeader type={type} title={title} />

      {onSearch && <Input onChange={setSearch} placeholder="search..." />}

      <div className="scroll-section">
        {type === chatPanels[0] && !!onlineUsers.length && (
          <details className="list">
            <summary className="sub-heading">
              <h2>Online</h2>

              <span className="unread-count">{onlineUsers.length}</span>

              <IoIosArrowDown />
            </summary>

            <RenderOnlineUsers data={onlineUsers} />
          </details>
        )}

        <section className="list">
          <div className="sub-heading">
            <h2>{listTitle || "List"}</h2>

            {isChatPanel && <UnreadCount chats={sortedList} />}
          </div>

          {RenderList && (
            <RenderList type={type} list={sortedList} loading={loading} />
          )}
        </section>
      </div>
    </section>
  );
}

function UnreadCount({ chats }) {
  const filterUnReadCount = (chat) => !!chat?.unreadCount;
  const unreadCount = chats.filter(filterUnReadCount).length;

  if (!unreadCount) return null;
  return <span className="unread-count">{unreadCount}</span>;
}
