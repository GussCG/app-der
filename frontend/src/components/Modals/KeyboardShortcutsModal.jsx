import { useState } from "react";
import Icons from "../Others/IconProvider";
const { IoChevronDownOutline, IoChevronUp, IoClose } = Icons;

function KeyboardShortcutsModal({ onClose }) {
  const [openSection, setOpenSection] = useState("navbar");
  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal keyboard_shortcuts"
        onClick={(e) => e.stopPropagation()}
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
                    <td>Nuevo Diagrama</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">N</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Abrir Diagrama</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">O</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Guardar Diagrama</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">S</div>
                    </td>
                  </tr>
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
                    <td>Limpiar Lienzo</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">L</div>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Ajustar Pantalla</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">A</div>
                    </td>
                  </tr> */}
                  <tr>
                    <td>Ocultar Cuadrícula</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">G</div>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Abrir Herramientas</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">T</div>
                    </td>
                  </tr> */}
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
                  {/* <tr>
                    <td>Zoom In</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">+</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Zoom Out</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">-</div>
                    </td>
                  </tr>
                  <tr>
                    <td>Reset Zoom</td>
                    <td className="shortcut">
                      <div className="shortcut__ctrl">Ctrl</div>+
                      <div className="shortcut__key">A</div>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
