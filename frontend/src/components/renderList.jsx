import { useRef } from "react";
import ChatLink from "./chatLink";
import UserLink from "./userLink";
import useObserver from "../hooks/useObserver";

function RenderList(Link) {
  return function ({ type = "#", list = [], loading }) {
    const listRef = useRef();
    const listLength = list.length;

    const getNodeList = () => listRef.current?.querySelectorAll("li");
    useObserver(getNodeList, null, [list]);

    if (loading) return <p className="not-found">Loading...</p>;

    if (!listLength) return <p className="not-found">No results found</p>;

    return (
      <ul ref={listRef} className="chats">
        {list.map((props) => (
          <li key={props._id} className="chat">
            <Link type={type} {...props} />
          </li>
        ))}
      </ul>
    );
  };
}

export const RenderChatList = RenderList(ChatLink);
export const RenderUserList = RenderList(UserLink);
