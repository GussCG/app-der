import { ERROR_CATALOG } from "../../utils/validation/errorCatalog";
import Icons from "../Others/IconProvider";
import { motion } from "framer-motion";

const { IoClose, BiSolidErrorAlt, BiSolidError, PiSealWarningFill } = Icons;

function ValidationErrorModal({ errors = [], onClose }) {
  return (
    <motion.div
      className="modal__overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal error_validation"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 10 }}
      >
        <button className="modal__close-button" onClick={onClose}>
          <IoClose />
        </button>

        <div className="error__validation_modal_content">
          <div className="error__validation_modal_header">
            <BiSolidErrorAlt />
            <div className="error__validation_header">
              <h1>Diagrama no válido</h1>
              <p>Se han encontrado {errors.length} errores de validación.</p>
            </div>
          </div>
          <div className="error__validation_modal_body">
            {errors.map((error, index) => {
              const catalog = ERROR_CATALOG[error.type];

              if (!catalog) return null;

              const Icon =
                catalog.severity === "warning"
                  ? PiSealWarningFill
                  : BiSolidError;

              const name = error.meta?.name || "Elemento desconocido";
              const attributeName = error.meta?.attributeName
                ? `${error.meta.attributeName}`
                : null;
              const reason = error.meta?.reason ? `${error.meta.reason}` : null;

              return (
                <div
                  key={index}
                  className={`error__validation_item ${
                    catalog.severity === "warning" ? "warning" : "error"
                  }`}
                >
                  <Icon
                    className={catalog.severity === "warning" ? "warning" : ""}
                  />

                  <div className="error__validation_info">
                    <h2>{catalog.title}</h2>

                    <p className="error__validation_text">
                      {catalog.message(name)}

                      {attributeName && (
                        <span className="error__validation_attribute">
                          {" "}
                          <strong>Atributo:</strong> {attributeName}.
                        </span>
                      )}

                      {reason && (
                        <span className="error__validation_reason">
                          {" "}
                          <strong>Motivo:</strong> {reason}.
                        </span>
                      )}

                      {catalog.suggestion && (
                        <span className="error__validation_suggest">
                          {" "}
                          <strong>Sugerencia:</strong> {catalog.suggestion}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="modal__button" onClick={onClose}>
          Entendido
        </button>
      </motion.div>
    </motion.div>
  );
}

export default ValidationErrorModal;
