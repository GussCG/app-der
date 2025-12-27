import { createElement, useEffect, useState } from "react";
import Icons from "../Others/IconProvider.jsx";
import BarraDesplegable from "./BarraDesplegable.jsx";
import ValidationStatus from "./ValidationStatus.jsx";

import { useEditorMode } from "../../context/EditorModeContext.jsx";
import KeyboardShortcutsModal from "../Modals/KeyboardShortcutsModal.jsx";

const { FiDatabase, TbSql, LuTable2, erdIcon } = Icons;

function BarraNav() {
  const { mode, setMode } = useEditorMode();
  const [menuActivo, setMenuActivo] = useState(null);

  const [validationState, setValidationState] = useState("loading"); // "loading" o "valid" o "invalid"
  const [progress, setProgress] = useState(0); // progreso de validación (0-100)

  // Para pruebas de simulacion
  useEffect(() => {
    if (validationState !== "loading") return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setValidationState("valid");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [validationState]);

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const menuActions = {
    "Nuevo diagrama": () => alert("Nuevo diagrama seleccionado"),
    "Abrir ...": () => alert("Abrir diagrama seleccionado"),
    Guardar: () => alert("Guardar diagrama seleccionado"),
    Deshacer: () => alert("Deshacer acción seleccionada"),
    Rehacer: () => alert("Rehacer acción seleccionada"),
    "Eliminar selección": () => alert("Eliminar selección seleccionada"),
    "Duplicar elemento": () => alert("Duplicar elementos seleccionado"),
    "Limpiar lienzo": () => alert("Limpiar lienzo seleccionado"),
    "Ajustar pantalla": () => alert("Ajustar pantalla seleccionado"),
    "Ocultar cuadrícula": () => alert("Ocultar cuadrícula seleccionado"),
    "Abrir herramientas": () => alert("Abrir herramientas seleccionado"),
    "¿Cómo usar?": () => alert("¿Cómo usar? seleccionado"),
    "Atajos de teclado": () => setShowShortcutsModal(true),
    "Acerca de": () => alert("Acerca de seleccionado"),
  };

  const handleMenuSelect = (label) => {
    const action = menuActions[label];
    if (action) action();
  };

  return (
    <>
      <header className="barra__nav">
        <div className="nav__menu">
          {mode === "er" && (
            <img
              src={erdIcon}
              alt="ER Diagram Icon"
              className="nav__mode-icon"
            />
          )}
          {mode === "sql" && <TbSql className="nav__mode-icon" />}
          {mode === "relational" && <LuTable2 className="nav__mode-icon" />}
          <input
            type="text"
            className="nav__filename"
            value="Lienzo ER"
            readOnly
          />
          <nav className="nav__tabs">
            {["archivo", "editar", "ver", "ventana", "ayuda"].map((tipo) => (
              <div
                key={tipo}
                className="nav__tab"
                onMouseEnter={() => setMenuActivo(tipo)}
                onMouseLeave={() => setMenuActivo(null)}
              >
                <p>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                {menuActivo === tipo && (
                  <BarraDesplegable tipo={tipo} onSelect={handleMenuSelect} />
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="nav__actions">
          <ValidationStatus state={validationState} progress={progress} />

          {mode === "er" && (
            <button
              className="nav__button"
              onClick={() => setMode("relational")}
            >
              <FiDatabase />A relacional
            </button>
          )}

          {mode === "relational" && (
            <>
              <button className="nav__button" onClick={() => setMode("er")}>
                <FiDatabase />A ER
              </button>
              <button
                className="nav__button secondary"
                onClick={() => setMode("sql")}
              >
                <FiDatabase />A SQL
              </button>
            </>
          )}

          {mode === "sql" && (
            <button
              className="nav__button"
              onClick={() => setMode("relational")}
            >
              <FiDatabase />A relacional
            </button>
          )}
        </div>
      </header>

      {showShortcutsModal && (
        <KeyboardShortcutsModal onClose={() => setShowShortcutsModal(false)} />
      )}
    </>
  );
}

export default BarraNav;
