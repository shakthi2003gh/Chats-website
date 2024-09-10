import { TiUser, TiMail } from "react-icons/ti";
import { TbFileDescription } from "react-icons/tb";
import { MdOutlineEdit } from "react-icons/md";
import { usePopup } from "./popup";
import { useUser } from "../state/user";
import Button from "../components/button";
import { PanelHeader } from "../components/headers";
import { ProfileImageUploader } from "../components/profileImage";
import RenderSettings from "../components/renderSettings";

export default function Profile() {
  const { display } = usePopup();
  const { user, update } = useUser();

  const handleEdit = (label) => () => {
    const value = user[label] || "";
    const method = label === "about" ? "textarea" : "input";
    const onConfirm = (value) => {
      return update({ [label]: value });
    };

    const data = { name: label, heading: "Enter your " + label, value, method };
    display({ type: "edit", data, onConfirm });
  };

  const details = [
    {
      type: "container",
      className: "profile__name",
      label: "username",
      Icon: TiUser,
      onClick: handleEdit("name"),
      Component: (
        <InfoComponent value={user.name} onClick={handleEdit("name")} />
      ),
    },
    {
      type: "container",
      className: "profile__email",
      label: "email",
      Icon: TiMail,
      Component: <InfoComponent value={user.email} />,
    },
    {
      type: "container",
      className: "profile__about",
      label: "about",
      Icon: TbFileDescription,
      onClick: handleEdit("about"),
      Component: (
        <InfoComponent value={user.about} onClick={handleEdit("about")} />
      ),
    },
  ];

  return (
    <section aria-label="Profile Panel" className="floating-panel profile">
      <PanelHeader type="settings" title="Profile" />

      <ProfileImageUploader />

      <RenderSettings settings={details} clabel="detail" />
    </section>
  );
}

function InfoComponent({ value, onClick }) {
  return (
    <div className="info">
      <span className="value" title={value}>
        {value}
      </span>

      {onClick && (
        <Button onClick={onClick} title="Edit">
          <MdOutlineEdit />
        </Button>
      )}
    </div>
  );
}
