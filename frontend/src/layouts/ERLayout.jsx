import { useEffect, useState } from "react";
import { useEditor } from "../context/EditorContext.jsx";
import { useEditorMode } from "../context/EditorModeContext.jsx";

import BarraElementos from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";
import ERCanvas from "../components/Editors/ERCanvas";
import LimitModal from "../components/Modals/LimitModal";
import ValidationErrorModal from "../components/Modals/ValidationErrorModal";
import { AnimatePresence } from "framer-motion";
import AIButton from "../components/AI/AIButton.jsx";
import AIChatPanel from "../components/AI/AIChatPanel.jsx";

function ERLayout() {
  const {
    validationState,
    validationErrors,
    setValidationState,
    selectedElementIds,
  } = useEditor();
  const { isER } = useEditorMode();

  const [panels, setPanels] = useState({
    elementos: false,
    herramientas: false,
    inspector: true,
  });

  const togglePanel = (name) => {
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  const [aiOpen, setAiOpen] = useState(false);

  const handleOpenAIPanel = (data) => {
    setAiOpen(true);
  };

  const handleCloseAIPanel = () => {
    setAiOpen(false);
  };

  const [lastSelectedId, setLastSelectedId] = useState(null);
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    const currentId =
      selectedElementIds.length === 1 ? selectedElementIds[0] : null;

    // SOLO actuamos si el ID es diferente al anterior (nuevo elemento seleccionado)
    if (currentId && currentId !== lastSelectedId) {
      // Si el inspector está cerrado, lo abrimos automáticamente
      if (panels.inspector) {
        setPanels((p) => ({ ...p, inspector: false }));
      }

      // Activamos el rebote solo si acaba de cambiar el elemento
      setShouldBounce(true);
      const timer = setTimeout(() => setShouldBounce(false), 1000);

      // Actualizamos el ID de referencia
      setLastSelectedId(currentId);

      return () => clearTimeout(timer);
    }

    // Si se deselecciona todo, reseteamos el ID de referencia
    if (!currentId) {
      setLastSelectedId(null);
    }
  }, [selectedElementIds, panels.inspector, lastSelectedId]);

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
          bounce={shouldBounce}
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

        <AnimatePresence mode="wait">
          {!aiOpen && <AIButton onClick={handleOpenAIPanel} active={aiOpen} />}
        </AnimatePresence>

        <AnimatePresence>
          {aiOpen && (
            <AIChatPanel
              key={"chat-panel"}
              open={true}
              onClose={handleCloseAIPanel}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ERLayout;
