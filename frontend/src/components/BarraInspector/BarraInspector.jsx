import { useEditor } from "../../context/EditorContext.jsx";
import { useEditorMode } from "../../context/EditorModeContext.jsx";
import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";
import EREntityInspector from "./ER/EREntityInspector.jsx";
import ERRelationInspector from "./ER/ERRelationInspector.jsx";
import RelEntityInspector from "./Relacional/RelEntityInspector.jsx";
import NoteInspector from "./Notes/NoteInspector.jsx";
import { motion } from "framer-motion";

const { LuPanelLeftClose, LuPanelLeftOpen } = Icons;

function BarraInspector({
  hidden,
  onToggle,
  table,
  overrides = {},
  updateOverride,
  bounce = false,
}) {
  const { selectedElement } = useEditor();
  const { isER, isRelational } = useEditorMode();

  const hasSelection = isRelational ? !!table : !!selectedElement;

  const bounceAnimation = {
    x: [0, -20, 0, -10, 0], // Se mueve un poco a la izquierda y vuelve
    transition: { duration: 0.5, ease: "easeInOut" },
  };

  return (
    <motion.div
      className={`properties ${hidden ? "hidden" : ""}`}
      data-tour="inspector"
      animate={bounce ? bounceAnimation : { x: 0 }}
    >
      <HidePanelButton
        onClick={onToggle}
        icon={hidden ? LuPanelLeftClose : LuPanelLeftOpen}
        title={hidden ? "Mostrar panel" : "Esconder panel"}
      />
      {!hidden && (
        <>
          <h1>Propiedades</h1>

          {!hasSelection && (
            <p className="properties__no_selection">
              Selecciona un elemento para ver sus propiedades.
            </p>
          )}

          {/* ER */}
          {selectedElement?.kind === "entity" && isER && <EREntityInspector />}
          {selectedElement?.kind === "relation" && isER && (
            <ERRelationInspector />
          )}

          {/* RELACIONAL */}
          {/* selectedElement?.kind === "entity" && */}
          {isRelational && table && (
            <RelEntityInspector
              table={table}
              overrides={overrides}
              updateOverride={updateOverride}
            />
          )}

          {/* NOTA */}
          {selectedElement?.kind === "note" && <NoteInspector />}
        </>
      )}
    </motion.div>
  );
}

export default BarraInspector;
