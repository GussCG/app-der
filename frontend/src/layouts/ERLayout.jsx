import { useEffect, useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";

import BarraElementos from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";
import ERCanvas from "../components/Editors/ERCanvas";
import LimitModal from "../components/Modals/LimitModal";
import ValidationErrorModal from "../components/Modals/ValidationErrorModal";
import { AnimatePresence } from "framer-motion";

function ERLayout() {
  const {
    validationState,
    validationErrors,
    setValidationState,
    selectedElementIds,
  } = useEditor();

  const [panels, setPanels] = useState({
    elementos: false,
    herramientas: false,
    inspector: true,
  });

  const togglePanel = (name) => {
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  useEffect(() => {
    if (selectedElementIds.length === 1) {
      setPanels((p) => (p.inspector === true ? { ...p, inspector: false } : p));
    }
  }, [selectedElementIds]);

  return (
    <>
      <div className="app__layout er">
        <BarraElementos
          hidden={panels.elementos}
          onToggle={() => togglePanel("elementos")}
        />
        <BarraNav />
        <BarraInspector
          hidden={panels.inspector}
          onToggle={() => togglePanel("inspector")}
        />
        <BarraHerramientas />
        <ERCanvas />
        <LimitModal />

        <AnimatePresence>
          {validationState === "invalid" && (
            <ValidationErrorModal
              errors={validationErrors}
              onClose={() => setValidationState("idle")}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ERLayout;
