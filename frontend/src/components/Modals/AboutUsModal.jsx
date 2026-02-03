import Icons from "../Others/IconProvider";
const { IoClose } = Icons;
import { motion } from "framer-motion";
import { version } from "../../../package.json";

function AboutUsModal({ onClose }) {
  return (
    <motion.div
      className="modal__overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal about-us"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 10 }}
      >
        <h1>Acerca de</h1>
        <button className="modal__close-button" onClick={onClose}>
          <IoClose />
        </button>
        <div className="about-us__header">
          <h2>
            AppDER <span className="version">{version}</span>
          </h2>
          {/* <p>
            Elaborado bajo condiciones de presión extrema y crisis emocionales y
            existenciales.
          </p> */}
        </div>

        <div className="about-us__content">
          <div className="item">
            <h3>Stack tecnológico</h3>
            <div className="item-list">
              <ul>
                <li>React + Vite (Para la velocidad)</li>
                <li>Café y Coca-Cola (Para la lógica)</li>
                <li>Oraciones a deidades antiguas (Para que no falle)</li>
              </ul>
            </div>
          </div>

          <div className="item">
            <h3>Estado del Equipo</h3>
            <div className="item-list">
              <ul>
                <li>
                  <strong>Situación laboral:</strong> Disponibles para
                  contratación inmediata (o alguien para que nos adopte como
                  becarios; sabemos hacer páginas bonitas en poquito tiempo{" "}
                  <span className="emoji">🥺</span>).
                </li>
                <li>
                  <strong>Servicio Social:</strong> Según la maestra que nos
                  dejó este proyecto no era como un TT (sí era).
                </li>
                <li>
                  <strong>Nivel de desesperación:</strong> Lo suficiente para
                  programar esto en 2 meses y que no se vea tan mal y que nos
                  falte todavía la estancia :c.
                </li>
              </ul>
            </div>
          </div>

          <div className="item note">
            <p>
              <strong>Nota:</strong> Si la app te gustó, considera apoyarnos. Si
              quieres contactarnos y eres guerilla y guapa{" "}
              <a href="https://www.instagram.com/mh_guss/">aquí</a>, si eres
              hombre <a href="https://www.instagram.com/dieee._go/">acá</a>
            </p>
          </div>

          <div className="item credits">
            <h3>Créditos</h3>
            <p>
              Desarrollado con ♥️ por{" "}
              <a href="https://github.com/GussCG">Guss</a> y{" "}
              <a href="https://github.com/dieee-go">Diego</a>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AboutUsModal;
