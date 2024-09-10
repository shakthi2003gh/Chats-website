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
