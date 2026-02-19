import { useState } from "react";
import Icons from "../Others/IconProvider";
import { motion, AnimatePresence } from "framer-motion";
const { IoChevronDownOutline, IoChevronUp, IoClose } = Icons;

function KeyboardShortcutsModal({ onClose }) {
  const [openSection, setOpenSection] = useState("navbar");
  return (
    <motion.div
      className="modal__overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal keyboard_shortcuts"
        onClick={(e) => e.stopPropagation()}
        layout
        transition={{
          layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <h1>Atajos de Teclado</h1>
        <button className="modal__close-button" onClick={onClose}>
          <IoClose />
        </button>
        <div className="shortcut__section">
          <button
            className="shortcut__header"
            onClick={() =>
              setOpenSection(openSection === "navbar" ? null : "navbar")
            }
          >
            <span>Barra de Navegación</span>
            {openSection === "navbar" ? (
              <IoChevronUp />
            ) : (
              <IoChevronDownOutline />
            )}
          </button>

          {openSection === "navbar" && (
            <div
              className={`shortcut__list ${
                openSection === "navbar" ? "open" : ""
              }`}
            >
              <table>
                <thead>
                  <tr>
                    <th>Acción</th>
                    <th>Atajo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Deshacer</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">Z</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Rehacer</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">Y</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Eliminar Selección</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Supr</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Duplicar Elemento</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">D</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Ajustar Pantalla</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">A</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Ocultar Cuadrícula</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">G</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Cambiar de tema</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">J</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Abrir Modal de Atajos</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">/</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="shortcut__section">
          <button
            className="shortcut__header"
            onClick={() =>
              setOpenSection(openSection === "toolbar" ? null : "toolbar")
            }
          >
            <span>Barra de Herramientas</span>
            {openSection === "toolbar" ? (
              <IoChevronUp />
            ) : (
              <IoChevronDownOutline />
            )}
          </button>

          {openSection === "toolbar" && (
            <div
              className={`shortcut__list ${
                openSection === "toolbar" ? "open" : ""
              }`}
            >
              <table>
                <thead>
                  <tr>
                    <th>Acción</th>
                    <th>Atajo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Herramienta de Selección</td>
                    <td className="shortcut">
                      <div className="shortcut__key">V</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Herramienta de Movimiento Libre</td>
                    <td className="shortcut">
                      <div className="shortcut__key">M</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Herramienta de Creación de Entidades</td>
                    <td className="shortcut">
                      <div className="shortcut__key">E</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Herramienta de Creación de Relaciones</td>
                    <td className="shortcut">
                      <div className="shortcut__key">R</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Herramienta de Creación de Texto</td>
                    <td className="shortcut">
                      <div className="shortcut__key">T</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default KeyboardShortcutsModal;
