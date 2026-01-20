import { useState, useEffect } from "react";
import BarraEntidades from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";
import RelationalCanvas from "../components/Editors/RelationalCanvas";
import LimitModal from "../components/Modals/LimitModal";
import RelationCreationModal from "../components/Modals/RelationCreationModal";
import ValidationErrorModal from "../components/Modals/ValidationErrorModal";
import { useEditor } from "../context/EditorContext.jsx";
import { useAnimation, motion } from "framer-motion";

function RelationalLayout() {
  const {
    isRelationCreationModalOpen,
    setIsRelationCreationModalOpen,
    // selectedElement,
    validationState,
    validationErrors,
    setValidationState,
  } = useEditor();
  const controlsInspector = useAnimation();
  const controlsEntidades = useAnimation();

  const [panels, setPanels] = useState({
    entidades: true,
    herramientas: false,
    inspector: true,
  });

  const togglePanel = async (name) => {
    if (name === "inspector") {
      await controlsInspector.start({
        x: [0, -15, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
      return;
    }

    if (name === "entidades") {
      await controlsEntidades.start({
        x: [0, 15, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
      return;
    }

    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  return (
    <div className="app__layout relational">
      <motion.div animate={controlsEntidades} style={{ zIndex: 10 }}>
        <BarraEntidades
          hidden={panels.entidades}
          onToggle={() => togglePanel("entidades")}
        />
      </motion.div>
      <BarraNav />

      <motion.div animate={controlsInspector} style={{ zIndex: 10 }}>
        <BarraInspector
          hidden={panels.inspector}
          onToggle={() => {
            togglePanel("inspector");
          }}
        />
      </motion.div>

      <BarraHerramientas />
      <RelationalCanvas />
      <LimitModal />
      {isRelationCreationModalOpen && (
        <RelationCreationModal
          onClose={() => setIsRelationCreationModalOpen(false)}
        />
      )}
      {validationState === "invalid" && (
        <ValidationErrorModal
          errors={validationErrors}
          onClose={() => setValidationState("idle")}
        />
      )}
    </div>
  );
}

export default RelationalLayout;
