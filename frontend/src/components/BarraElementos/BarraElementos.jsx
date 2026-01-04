import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";

import { useEditor } from "../../context/EditorContext.jsx";

const {
  FaSearch,
  HiOutlineTableCells,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  CgShapeRhombus,
  IoClose,
} = Icons;

function BarraElementos({ hidden, onToggle }) {
  const { diagram, setSelectedElementId, selectedElementId } = useEditor();

  const { entities, relations } = diagram;

  return (
    <div className={`elements ${hidden ? "hidden" : ""}`}>
      <HidePanelButton
        onClick={onToggle}
        icon={hidden ? LuPanelLeftOpen : LuPanelLeftClose}
        title={hidden ? "Mostrar panel" : "Esconder panel"}
      />

      {!hidden && (
        <>
          <h1>Elementos</h1>
          <div className="elements__container">
            <div className="elements__searchbar">
              <FaSearch />
              <input type="text" placeholder="Buscar elemento..." />
            </div>
            <div className="elements__list">
              {/* Ejemplo de Entidad */}
              {entities &&
                entities.map((entity) => (
                  <div
                    key={entity.id}
                    className={`elements__item ${
                      selectedElementId === entity.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedElementId(entity.id)}
                  >
                    <HiOutlineTableCells />
                    <span>{entity.data?.name || "Entidad sin nombre"}</span>
                    <button className="elements__item-delete">
                      <IoClose />
                    </button>
                  </div>
                ))}

              {relations &&
                relations.map((relation) => (
                  <div
                    key={relation.id}
                    className={`elements__item ${
                      selectedElementId === relation.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedElementId(relation.id)}
                  >
                    <CgShapeRhombus />
                    <span>{relation.data?.name || "Relación sin nombre"}</span>
                    <button className="elements__item-delete">
                      <IoClose />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BarraElementos;
