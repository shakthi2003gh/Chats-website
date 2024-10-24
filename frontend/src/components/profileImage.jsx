import { useRef, useState } from "react";
import { MdFolder } from "react-icons/md";

export default function ProfileImage(props) {
  const { image, placeholder, isOnline, ...rest } = props;

  return (
    <div className="profile-img" {...rest}>
      <div className="image-container">
        {image ? (
          <img src={image} alt="" />
        ) : (
          <div className="no-image">{placeholder?.[0] || "N"}</div>
        )}
      </div>

      {isOnline && <span className="online-dot"></span>}
    </div>
  );
}

export function ProfileImageUploader(props) {
  const { image, placeholder, onUpload } = props;

  const imageRef = useRef();
  const [isLoading, setLoading] = useState(false);

  const handleSelectImagePopup = () => {
    if (!imageRef.current) return;

    imageRef.current.click();
  };

  const handleUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    if (typeof onUpload !== "function") return;
    setLoading(true);
    onUpload(image).finally(() => {
      imageRef.current.value = null;
      setLoading(false);
    });
  };

  return (
    <div className="profile-image-uploader">
      <ProfileImage
        image={image}
        placeholder={placeholder}
        onClick={handleSelectImagePopup}
      />

      <input
        ref={imageRef}
        type="file"
        title="image upload input"
        id="profile-image"
        name="profile image"
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
        type="button"
        className="edit-btn"
        title="Upload Image"
        onClick={handleSelectImagePopup}
        disabled={isLoading}
      >
        <MdFolder />
      </button>
    </div>
  );
}
