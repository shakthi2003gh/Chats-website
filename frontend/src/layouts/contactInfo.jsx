import { useData } from "../state/data";
import { PanelHeader } from "../components/headers";
import ProfileImage from "../components/profileImage";

export default function ContactInfo() {
  const { getChat } = useData();

  const { image, name, email, about } = getChat() || {};

  return (
    <section className="floating-panel contact-info">
      <PanelHeader title="contact info" type="contact-info" />

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
