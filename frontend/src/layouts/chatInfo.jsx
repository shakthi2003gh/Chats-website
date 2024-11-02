import { useUI } from "../state/ui";
import { useData } from "../state/data";
import { PanelHeader } from "../components/headers";
import ProfileImage from "../components/profileImage";
import DropDown from "../components/dropDown";
import { RenderChatList, RenderUserList } from "../components/renderList";

export default function ChatInfo() {
  const { chat } = useUI();
  const { chats, getChat } = useData();

  const { personalChats, groupChats } = chats;
  const { user_id, image, name, email, about, members } = getChat() || {};

  const getCommonGroups = () => {
    const filter = ({ members }) => members.some(({ _id }) => _id === user_id);
    return groupChats.filter(filter);
  };

  const getMembers = () => {
    return (members || []).map(({ _id, image, name }) => {
      const isSelf = sessionStorage.getItem("user_id") === _id;
      const isNewChat = !personalChats.some(({ user_id }) => user_id === _id);

      return { _id, image, name, isSelf, isNewChat };
    });
  };

  const currentChatType = chat?.current?.type || "personal-chat";
  const chatInfoProps = {
    "personal-chat": {
      title: "Contact info",
      descriptionTitle: "About me",
      list: {
        title: "common groups",
        getData: getCommonGroups,
        Component: RenderChatList,
        props: {
          type: "group-chat",
        },
      },
    },
    "group-chat": {
      title: "Group info",
      descriptionTitle: "Description",
      list: {
        title: "members",
        getData: getMembers,
        Component: RenderUserList,
      },
    },
  };

  const props = chatInfoProps?.[currentChatType] || {};
  const { title, descriptionTitle, list } = props;
  const listData = list.getData();

  return (
    <section className="floating-panel chat-info">
      <PanelHeader title={title || "chat info"} type="chat-info" />

      <div className="scroll-section">
        <div className="info">
          <ProfileImage image={image} placeholder={name} />

          <div className="name title">{name}</div>

          <div className="email">{email}</div>
        </div>

        <div className="description">
          <span className="title">{descriptionTitle}</span>

          <p>{about}</p>
        </div>

        {!!listData?.length && (
          <DropDown title={list.title || "list"} count={listData.length} open>
            <list.Component list={listData} {...(list?.props || {})} />
          </DropDown>
        )}
      </div>
    </section>
  );
}
