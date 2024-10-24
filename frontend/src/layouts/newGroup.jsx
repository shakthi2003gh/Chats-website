import { useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import Joi from "joi";
import { IoIosAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { usePopup } from "./popup";
import { useUI } from "../state/ui";
import { useData } from "../state/data";
import { useUser } from "../state/user";
import { PanelHeader } from "../components/headers";
import ProfileImage, { ProfileImageUploader } from "../components/profileImage";
import InputGroup from "../components/inputGroup";
import DropDown from "../components/dropDown";
import Button from "../components/button";

const schema = {
  name: Joi.string().required().min(3).max(50).label("Name"),
  about: Joi.string().min(3).max(500).allow("").label("Description"),
  members: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(2)
    .max(30)
    .required()
    .label("Members"),
};

export default function NewGroup(props) {
  const { type, title, ...rest } = props;

  const { display } = usePopup();
  const { floatingPanel } = useUI();
  const { createGroup } = useData();
  const { user } = useUser();
  const self = { _id: user._id, image: user.image, name: user.name };

  const nameRef = useRef();
  const aboutRef = useRef();
  const [image, setImage] = useState(null);
  const [members, setMembers] = useState([self]);
  const [canValidate, setCanValidate] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const inputs = [
    {
      id: useId(),
      ref: nameRef,
      label: "name",
      schema: schema.name,
      canValidate,
    },
    {
      id: useId(),
      ref: aboutRef,
      type: "textarea",
      label: "description",
      schema: schema.about,
      canValidate,
    },
  ];

  const handleUpload = (image) => {
    return new Promise((resolve) => {
      const file = image;
      if (!file) return resolve();

      const reader = new FileReader();

      reader.onload = function (e) {
        const url = e.target.result;

        setImage({ url, file });
      };
      reader.readAsDataURL(file);

      resolve();
    });
  };

  const handleDeselectMember = (id) => () => {
    if (id === user._id) return;

    setMembers((prev) => prev.filter(({ _id }) => _id !== id));
  };

  const handleSelectMember = () => {
    const data = { members };

    const filter = (prev) => {
      return ({ _id: user_id }) => !prev.some(({ _id }) => _id === user_id);
    };

    const onConfirm = (list) => {
      setMembers((prev) => [...prev, ...list.filter(filter(prev))]);
    };

    display({ type: "addMember", data, onConfirm });
  };

  const handleValidation = async () => {
    const payload = {
      name: nameRef.current?.value,
      about: aboutRef.current?.value,
      members: members.map(({ _id }) => _id),
    };

    const { error, value } = Joi.object(schema).validate(payload);
    if (!error) return value;

    if (error.details[0].path[0] === "members")
      toast.error(error.details[0].message);

    return null;
  };

  const handleClose = async () => {
    floatingPanel.navigate("new-group");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canValidate) setCanValidate(true);

    const value = await handleValidation();
    if (!value) return;
    if (image) value.image = image.file;

    setLoading(true);
    createGroup(value)
      .then(handleClose)
      .finally(() => setLoading(false));
  };

  return (
    <section {...rest}>
      <PanelHeader type={type} title={title} />

      <form noValidate className="group-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <ProfileImageUploader
            image={image?.url}
            placeholder="G"
            onUpload={handleUpload}
          />

          <div className="inputs">
            {inputs.map(({ id, ...input }) => (
              <InputGroup key={id} {...input} />
            ))}
          </div>

          <DropDown title="members" count={members.length} open>
            <ul>
              {members.map(({ _id, image, name }) => (
                <li key={_id} title={name + (user._id === _id ? " (You)" : "")}>
                  <ProfileImage image={image} placeholder={name} />

                  {user._id !== _id && (
                    <button
                      type="button"
                      title={"Remove " + name}
                      className="btn no-btn deselect"
                      onClick={handleDeselectMember(_id)}
                    >
                      <FaMinus />
                    </button>
                  )}
                </li>
              ))}

              {members.length < 30 && (
                <li>
                  <button
                    type="button"
                    className="add-btn"
                    title="Add Member"
                    onClick={handleSelectMember}
                  >
                    <IoIosAdd />
                  </button>
                </li>
              )}
            </ul>
          </DropDown>
        </div>

        <div className="buttons">
          <Button type="button" onClick={handleClose}>
            cancel
          </Button>

          <Button type="submit" color="primary" loading={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </section>
  );
}
