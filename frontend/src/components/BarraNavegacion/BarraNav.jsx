import { useEffect, useState } from "react";
import Icons from "../Others/IconProvider.jsx";
import BarraDesplegable from "./BarraDesplegable.jsx";
import ValidationStatus from "./ValidationStatus.jsx";

const { FaCircleCheck, FiDatabase } = Icons;

function BarraNav() {
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
      <header class="barra__nav">
        <div className="nav__menu">
          <FiDatabase />
          <input type="text" class="nav__filename" value="Lienzo ER" />
          <nav class="nav__tabs">
            {["archivo", "editar", "ver", "ayuda"].map((tipo) => (
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
        <div class="nav__actions">
          <ValidationStatus state={validationState} progress={progress} />
          <button class="nav__button">
            <FiDatabase />A relacional
          </button>
        </div>
      </header>
    </>
  );
}

export default BarraNav;
