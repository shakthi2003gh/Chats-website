import { useData } from "../state/data";
import { PanelHeader } from "../components/headers";
import ProfileImage from "../components/profileImage";
import { useUI } from "../state/ui";

export default function ChatInfo() {
  const { chat } = useUI();
  const { getChat } = useData();

  const { image, name, email, about } = getChat() || {};
  const title =
    chat?.current?.type === "personal-chat" ? "Contact info" : "Group info";

  return (
    <section className="floating-panel chat-info">
      <PanelHeader title={title} type="chat-info" />

      <div className="details">
        <ProfileImage image={image} placeholder={name} />

        <div className="name title">{name}</div>

        <div className="email">{email}</div>
      </div>

      <div className="about">
        <span className="title">About me</span>
        <p>{about}</p>
      </div>
    </section>
  );
}
