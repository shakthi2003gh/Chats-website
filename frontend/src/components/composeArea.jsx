import { useEffect, useRef, useState } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import { FaRegImage, FaTrash } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useUI } from "../state/ui";
import { useData } from "../state/data";
import { useUser } from "../state/user";
import Button from "./button";
import { Input } from "./inputGroup";

export default function ComposeArea(props) {
  const { chat_id, receiver_id, scrollToBottom, ...rest } = props;
  const { chatType, canUploadImage = true } = rest;

  const ref = useRef(null);
  const imageRef = useRef(null);
  const { theme } = useUI();
  const { sendMessage } = useData();
  const { user } = useUser();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const addEmoji = (emoji) => {
    setText((text) => text + emoji.native);
  };

  const toggleShowEmoji = (show) => () => {
    setShowPicker((prev) => show ?? !prev);
    scrollToBottom();
  };

  const handleSelectImage = () => {
    if (!imageRef.current) return;

    imageRef.current.click();
  };

  const handleImageSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return setImage((prev) => prev);

    const reader = new FileReader();

    reader.onload = function (e) {
      imageRef.value = file;
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);

    if (!imageRef.current) return;
    imageRef.value = null;
    imageRef.current.value = null;
  };

  const handleSend = async () => {
    const { _id, name } = user;
    const author = { _id, name };
    const payload = { chat_id, receiver_id, text, author };

    if (image && !!imageRef.value) {
      payload.image = { file: imageRef.value, string: image };
      handleRemoveImage();
    }

    setText("");
    sendMessage(chatType)(payload);
    ref.current.querySelector("input#message").focus();
    scrollToBottom();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleSend();
  };

  useEffect(() => {
    setText("");
  }, [chat_id, receiver_id]);

  return (
    <div ref={ref} className="compose-area">
      {canUploadImage && (
        <div className="selected-image">
          {image && <img src={image} alt="selected image" />}

          <input
            ref={imageRef}
            type="file"
            id="image"
            name="message image"
            accept="image/*"
            onChange={handleImageSelected}
            hidden
          />

          <span>Selected image</span>

          <Button
            title="Remove"
            className="trash"
            color="danger"
            onClick={handleRemoveImage}
          >
            <FaTrash />
            <span>remove</span>
          </Button>
        </div>
      )}

      <form id="compose-area" className="main" onSubmit={handleSubmit}>
        <Button
          type="button"
          title="Emoji's"
          className="emoji"
          onClick={toggleShowEmoji()}
        >
          <MdEmojiEmotions />
        </Button>

        <Input
          id="message"
          className="search"
          placeholder="Message"
          value={text}
          onChange={setText}
          onFocus={toggleShowEmoji(false)}
        />

        {canUploadImage && (
          <Button
            type="button"
            title={!image ? "Image" : "Remove image to add new image"}
            className="image"
            onClick={handleSelectImage}
            disabled={!!image}
          >
            <FaRegImage />
          </Button>
        )}

        <Button title="Send" className="send" disabled={!(text || image)}>
          <IoSend />
        </Button>
      </form>

      {showPicker && (
        <Picker
          data={data}
          onEmojiSelect={addEmoji}
          previewPosition="none"
          theme={theme?.isDark ? "dark" : "light"}
          dynamicWidth
        />
      )}
    </div>
  );
}
