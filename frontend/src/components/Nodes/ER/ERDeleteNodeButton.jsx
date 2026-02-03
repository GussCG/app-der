import Icons from "../../Others/IconProvider";

const { MdDelete } = Icons;

export default function ERDeleteNodeButton({ onDelete }) {
  return (
    <button
      className="er__delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      <MdDelete />
    </button>
  );
}
