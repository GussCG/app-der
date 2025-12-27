import { createElement, useEffect, useState } from "react";
import Icons from "../Others/IconProvider.jsx";
import BarraDesplegable from "./BarraDesplegable.jsx";
import ValidationStatus from "./ValidationStatus.jsx";

import { useEditorMode } from "../../context/EditorModeContext.jsx";

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
                {menuActivo === tipo && <BarraDesplegable tipo={tipo} />}
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
    </>
  );
}

export default BarraNav;
