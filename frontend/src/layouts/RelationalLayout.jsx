import { useState, useEffect, useMemo } from "react";
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
import { derToRelational } from "../utils/derToRelational.js";

function RelationalLayout() {
  const {
    diagram,
    relationalPositions,
    selectedElementIds,
    relationalOverrides,
    updateRelationalPosition,
    updateRelationalOverride,
    isRelationCreationModalOpen,
    setIsRelationCreationModalOpen,
    validationState,
    validationErrors,
    setValidationState,
  } = useEditor();
  const controlsInspector = useAnimation();
  const controlsEntidades = useAnimation();
  const [panels, setPanels] = useState({
    entidades: false,
    herramientas: false,
    inspector: true,
  });

  const togglePanel = async (name) => {
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  const relationalData = useMemo(
    () => derToRelational(diagram, relationalPositions),
    [diagram, relationalPositions],
  );

  const selectedTable = useMemo(() => {
    if (selectedElementIds.length !== 1) return null;
    const selectedId = selectedElementIds[0];
    return relationalData.nodes.find((n) => n.id === selectedId)?.data || null;
  }, [selectedElementIds, relationalData]);

  useEffect(() => {
    if (selectedElementIds.length === 1) {
      setPanels((p) => ({ ...p, inspector: false }));
    } else if (selectedElementIds.length === 0) {
      setPanels((p) => ({ ...p, inspector: true }));
    }
  }, [selectedElementIds]);

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
          table={selectedTable}
          overrides={relationalOverrides}
          updateOverride={updateRelationalOverride}
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
