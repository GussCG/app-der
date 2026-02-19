import Icons from "../Others/IconProvider";
const { IoClose } = Icons;
import { motion } from "framer-motion";

function ExportModal({ progress, status, onClose }) {
  return (
    <motion.div
      className="modal__overlay"
      onClick={status === "generating" ? null : onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal export"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 10 }}
      >
        <h1>
          {status === "generating" ? "Generando imagen..." : "Imagen exportada"}
        </h1>

        {status === "generating" && (
          <>
            <div className="progress__container">
              <div className="progress__bar">
                <div
                  className="progress__fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="progress__text">{progress} %</p>
            </div>
            <p className="export__text">
              Por favor, espera mientras se genera la imagen.
            </p>
          </>
        )}

        {status === "done" && (
          <>
            <button className="modal__close-button" onClick={onClose}>
              <IoClose />
            </button>
            <p className="export__text">
              ¡La imagen se ha generado exitosamente! Puedes cerrar este
              mensaje.
            </p>
            <button className="modal__button confirm" onClick={onClose}>
              Cerrar
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ExportModal;
