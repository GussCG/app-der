import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";
import EntityInspector from "./EntityInspector.jsx";
import RelationInspector from "./RelationInspector.jsx";

const { LuPanelLeftClose, LuPanelLeftOpen } = Icons;

function BarraInspector({ hidden, onToggle, selectedElement, updateElement }) {
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

          {selectedElement?.type === "entity" && (
            <EntityInspector
              entity={selectedElement}
              updateEntity={updateElement}
            />
          )}

          {selectedElement?.type === "relation" && (
            <RelationInspector
              relation={selectedElement}
              updateRelation={updateElement}
            />
          )}
        </>
      )}
    </div>
  );
}

export default BarraInspector;
