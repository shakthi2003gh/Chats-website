import ProfileImage from "../components/profileImage";
import Button from "./button";

export default function RenderPeopleList(props) {
  const { list, selectedList, loading, onSelect } = props;

  if (loading) return <p className="not-found">Loading...</p>;

  if (!list.length) return <p className="not-found">No results found</p>;

  const selected_ids = (selectedList || []).map(({ _id }) => _id);

  return (
    <ul className="list">
      {list.map((person) => (
        <li key={person._id}>
          <Person
            {...person}
            selected={selected_ids.includes(person._id)}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}

function Person(props) {
  const { _id, image, name, selected = false, onSelect, ...rest } = props;

  const handleClick = () => {
    if (typeof onSelect !== "function") return;

    onSelect({ _id, image, name });
  };

  return (
    <div className="person" {...rest}>
      <ProfileImage image={image} placeholder={name} />

      <div className="details">
        <span className="title name">{name}</span>
      </div>

      {!!onSelect && (
        <Button color={selected ? "" : "primary"} onClick={handleClick}>
          {selected ? "selected" : "select"}
        </Button>
      )}
    </div>
  );
}
