import { useEditor } from "../../context/EditorContext.jsx";
import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";
import EntityInspector from "./EntityInspector.jsx";
import RelationInspector from "./RelationInspector.jsx";

const { LuPanelLeftClose, LuPanelLeftOpen } = Icons;

function BarraInspector({ hidden, onToggle }) {
  const { selectedElement } = useEditor();

  return (
    <div className={`properties ${hidden ? "hidden" : ""}`}>
      <HidePanelButton
        onClick={onToggle}
        icon={hidden ? LuPanelLeftClose : LuPanelLeftOpen}
        title={hidden ? "Mostrar panel" : "Esconder panel"}
      />
      {!hidden && (
        <>
          <h1>Propiedades</h1>

          {!selectedElement && (
            <p className="properties__no_selection">
              Selecciona un elemento para ver sus propiedades.
            </p>
          )}

          {selectedElement?.kind === "entity" && <EntityInspector />}

          {selectedElement?.kind === "relation" && <RelationInspector />}
        </>
      )}
    </div>
  );
}

export default BarraInspector;
