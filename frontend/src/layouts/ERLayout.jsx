import { useEffect, useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";

import BarraElementos from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";
import ERCanvas from "../components/Editors/ERCanvas";
import LimitModal from "../components/Modals/LimitModal";
import ValidationErrorModal from "../components/Modals/ValidationErrorModal";

function ERLayout() {
  const {
    selectedElement,
    validationState,
    validationErrors,
    setValidationState,
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
    if (selectedElement) {
      setPanels((p) => ({ ...p, inspector: false }));
    } else {
      setPanels((p) => ({ ...p, inspector: true }));
    }
  }, [selectedElement]);

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
        {validationState === "invalid" && (
          <ValidationErrorModal
            errors={validationErrors}
            onClose={() => setValidationState("idle")}
          />
        )}
      </div>
    </>
  );
}

export default ERLayout;
