import { useEditor } from "../../context/EditorContext";
import Icons from "../Others/IconProvider";
const { IoClose } = Icons;

function LimitModal({ title = "Cuidado!" }) {
  const { showLimitModal, setShowLimitModal } = useEditor();

  if (!showLimitModal) return null;

  const handleClose = () => {
    setShowLimitModal(false);
  };

  return (
    <div className="modal__overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h1>{title}</h1>
        <button className="modal__close-button" onClick={handleClose}>
          <IoClose />
        </button>
        <p>Solamente se puede duplicar un elemento a la vez.</p>
      </div>
    </div>
  );
}

export default LimitModal;
