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

  useEffect(() => {
    if (selectedElementIds.length === 1) {
      setPanels((p) => (p.inspector === true ? { ...p, inspector: false } : p));
    } else {
      setPanels((p) => ({ ...p, inspector: true }));
    }
  }, [selectedElementIds]);

  const [aiOpen, setAiOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);

  const handleOpenAIPanel = (coords) => {
    setButtonPosition(coords);
    setAiOpen(true);
  };

  const handleCloseAIPanel = () => {
    setAiOpen(false);
  };

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

        <AnimatePresence mode="wait">
          {!aiOpen && <AIButton onClick={handleOpenAIPanel} active={aiOpen} />}
        </AnimatePresence>

        <AnimatePresence>
          {aiOpen && (
            <AIChatPanel
              key={"chat-panel"}
              open={aiOpen}
              onClose={handleCloseAIPanel}
              originPosition={buttonPosition}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ERLayout;
