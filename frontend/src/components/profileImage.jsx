import { useRef, useState } from "react";
import { MdFolder } from "react-icons/md";
import { useUser } from "../state/user";
import { uploadProfile } from "../services/firebase/storage";

export default function ProfileImage(props) {
  const { image, placeholder = "No image", isOnline, ...rest } = props;

  return (
    <div className="profile-img" {...rest}>
      <div className="image-container">
        {image ? (
          <img src={image} alt="" />
        ) : (
          <div className="no-image">{placeholder[0]}</div>
        )}
      </div>

      {isOnline && <span className="online-dot"></span>}
    </div>
  );
}

export function ProfileImageUploader() {
  const { user, update } = useUser();
  const imageRef = useRef();
  const [isLoading, setLoading] = useState(false);

  const { _id, name, image } = user || {};

  const handleSelectImagePopup = () => {
    if (!imageRef.current) return;

    imageRef.current.click();
  };

  const handleUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setLoading(true);

    uploadProfile(_id, image)
      .then((url) => update({ image: url }))
      .catch(() => {})
      .finally(() => {
        imageRef.current.value = null;
        setLoading(false);
      });
  };

  return (
    <div className="profile__image">
      <ProfileImage
        image={image}
        placeholder={name}
        onClick={handleSelectImagePopup}
      />

      <input
        ref={imageRef}
        type="file"
        id="profile-image"
        name="profileImage"
        accept="image/*"
        onChange={handleUpload}
        hidden
      />

      {isLoading && (
        <div className="loader">
          <div className="loader__bar"></div>
        </div>
      )}

      <button
        className="edit-btn"
        onClick={handleSelectImagePopup}
        disabled={isLoading}
      >
        <MdFolder />
      </button>
    </div>
  );
}
