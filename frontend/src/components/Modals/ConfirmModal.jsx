import Icons from "../Others/IconProvider";
const { IoClose } = Icons;

function ConfirmModal({
  title = "¿Estás seguro?",
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onClose,
  onConfirm,
}) {
  const isAlert = !onConfirm;
  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal confirm">
        <h1>{title}</h1>
        <button className="modal__close-button" onClick={onClose}>
          <IoClose />
        </button>
        {message && <p>{message}</p>}
        <div className="modal__actions">
          {!isAlert && (
            <button className="modal__button cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button
            className={`modal__button ${isAlert ? "" : "confirm"}`}
            onClick={isAlert ? onClose : onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
