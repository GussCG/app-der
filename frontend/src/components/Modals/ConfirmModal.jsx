import Icons from "../Others/IconProvider";
const { IoClose } = Icons;
import { motion } from "framer-motion";

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
    <motion.div
      className="modal__overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal confirm"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 10 }}
      >
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
      </motion.div>
    </motion.div>
  );
}

export default ConfirmModal;
