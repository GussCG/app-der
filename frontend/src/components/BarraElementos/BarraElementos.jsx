import { useState, useMemo } from "react";
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
  const {
    diagram,
    setSelectedElementIds,
    selectedElementIds,
    deleteElementsDiagram,
  } = useEditor();

  const { entities, relations } = diagram;

  const [search, setSearch] = useState("");

  const filteredEntities = useMemo(() => {
    if (!search.trim()) return entities;

    return entities.filter((entity) =>
      entity.data?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [entities, search]);

  const filteredRelations = useMemo(() => {
    if (!search.trim()) return relations;

    return relations.filter((relation) =>
      relation.data?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [relations, search]);

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
              <input
                type="text"
                placeholder="Buscar elemento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="elements__clear_button"
                onClick={() => setSearch("")}
              >
                <IoClose />
              </button>
            </div>
            <div className="elements__list">
              {filteredEntities &&
                filteredEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className={`elements__item ${
                      selectedElementIds.includes(entity.id) ? "selected" : ""
                    }`}
                    onClick={() => setSelectedElementIds([entity.id])}
                  >
                    <HiOutlineTableCells />
                    <span>{entity.data?.name || "Entidad sin nombre"}</span>
                    <button
                      className="elements__item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElementsDiagram([entity.id]);
                      }}
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}

              {filteredRelations &&
                filteredRelations.map((relation) => (
                  <div
                    key={relation.id}
                    className={`elements__item ${
                      selectedElementIds.includes(relation.id) ? "selected" : ""
                    }`}
                    onClick={() => setSelectedElementIds([relation.id])}
                  >
                    <CgShapeRhombus />
                    <span>{relation.data?.name || "Relación sin nombre"}</span>
                    <button
                      className="elements__item-delete"
                      onClick={() => deleteElementsDiagram([relation.id])}
                    >
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
