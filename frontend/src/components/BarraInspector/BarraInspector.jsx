import { useEditor } from "../../context/EditorContext.jsx";
import { useEditorMode } from "../../context/EditorModeContext.jsx";
import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";
import EREntityInspector from "./ER/EREntityInspector.jsx";
import ERRelationInspector from "./ER/ERRelationInspector.jsx";
import RelEntityInspector from "./Relacional/RelEntityInspector.jsx";

const { LuPanelLeftClose, LuPanelLeftOpen } = Icons;

function BarraInspector({
  hidden,
  onToggle,
  table,
  overrides = {},
  updateOverride,
}) {
  const { selectedElement } = useEditor();
  const { isER, isRelational } = useEditorMode();

  const hasSelection = isRelational ? !!table : !!selectedElement;
  return (
    <div
      className={`properties ${hidden ? "hidden" : ""}`}
      data-tour="inspector"
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
        </>
      )}
    </div>
  );
}

export default BarraInspector;
