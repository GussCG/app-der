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

function RelationalLayout() {
  const {
    isRelationCreationModalOpen,
    setIsRelationCreationModalOpen,
    // selectedElement,
    validationState,
    validationErrors,
    setValidationState,
  } = useEditor();

  const [panels, setPanels] = useState({
    entidades: false,
    herramientas: false,
    inspector: true,
  });

  const togglePanel = (name) => {
    if (name === "inspector") return;
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  return (
    <div className="app__layout relational">
      <BarraEntidades
        hidden={panels.entidades}
        onToggle={() => togglePanel("entidades")}
      />
      <BarraNav />
      <BarraInspector hidden={panels.inspector} onToggle={() => {}} />
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
