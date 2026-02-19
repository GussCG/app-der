import { useState, useMemo } from "react";
import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";

import { useEditor } from "../../context/EditorContext.jsx";
import { useEditorMode } from "../../context/EditorModeContext.jsx";
import { derToRelational } from "../../utils/derToRelational.js";
import { useTool } from "../../context/ToolContext.jsx";
import { useReactFlow } from "reactflow";

const {
  FaSearch,
  HiOutlineTableCells,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  CgShapeRhombus,
  IoClose,
  LuRectangleHorizontal,
  FaNoteSticky,
} = Icons;

function BarraElementos({ hidden, onToggle }) {
  const {
    diagram,
    setSelectedElementIds,
    selectedElementIds,
    deleteElementsDiagram,
    relationalPositions,
    relationalOverrides,
  } = useEditor();
  const { isER, isRelational } = useEditorMode();
  const { setActiveTool } = useTool();
  const { setNodes } = useReactFlow();

  const [search, setSearch] = useState("");

  const displayedItems = useMemo(() => {
    if (isER) {
      const items = [
        ...(diagram.entities || []).map((e) => ({ ...e, type: "entity" })),
        ...(diagram.relations || []).map((r) => ({ ...r, type: "relation" })),
        ...(diagram.notes || []).map((n) => ({ ...n, type: "note" })),
      ];
      return filterBySearch(items, search);
    }

    if (isRelational) {
      const { nodes } = derToRelational(
        diagram,
        relationalPositions,
        relationalOverrides,
      );

      const items = nodes.map((node) => {
        const isNote = node.type === "note";

        return {
          id: node.id,
          name: isNote
            ? node.data?.text?.slice(0, 30) || "Nota"
            : node.data?.name,
          type: isNote ? "note" : "table",
          data: node.data,
        };
      });
      return filterBySearch(items, search);
    }

    return [];
  }, [
    diagram,
    isER,
    isRelational,
    search,
    relationalPositions,
    relationalOverrides,
  ]);

  function filterBySearch(items, query) {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();

    return items.filter((item) => {
      const searchable = item.data?.name || item.data?.text || item.name || "";

      return searchable.toLowerCase().includes(lowerQuery);
    });
  }

  return (
    <div
      className={`elements ${hidden ? "hidden" : ""}`}
      data-tour="elements-bar"
    >
      <HidePanelButton
        onClick={onToggle}
        icon={hidden ? LuPanelLeftOpen : LuPanelLeftClose}
        title={hidden ? "Mostrar panel" : "Esconder panel"}
      />

      {!hidden && (
        <>
          <div className="elements__header">
            <h1>
              {isER
                ? "Elementos ER"
                : isRelational
                  ? "Tablas Relacionales"
                  : "Elementos"}
            </h1>
            <span className="elements__count">
              {displayedItems.length} elementos
            </span>
          </div>

          <div className="elements__container">
            <div className="elements__searchbar" data-tour="elements-search">
              <FaSearch />
              <input
                type="text"
                placeholder={
                  isER ? "Buscar entidad o relación..." : "Buscar tabla..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="elements__clear_button"
                  onClick={() => setSearch("")}
                >
                  <IoClose />
                </button>
              )}
            </div>
            <div className="elements__list" data-tour="elements-bar-container">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className={`elements__item ${
                    selectedElementIds.includes(item.id) ? "selected" : ""
                  }`}
                  onClick={() => {
                    setActiveTool("select");

                    setNodes((nodes) =>
                      nodes.map((n) => ({
                        ...n,
                        selected: n.id === item.id,
                      })),
                    );

                    setSelectedElementIds([item.id]);
                  }}
                >
                  <div className="elements__icon">
                    {item.type === "entity" && <LuRectangleHorizontal />}
                    {item.type === "relation" && <CgShapeRhombus />}
                    {item.type === "table" && <HiOutlineTableCells />}
                    {item.type === "note" && <FaNoteSticky />}
                  </div>

                  <span className="elements__item-name">
                    {(
                      item.data?.name ||
                      item.data?.text ||
                      item.name ||
                      "Sin nombre"
                    ).toUpperCase()}
                  </span>
                  {(isER || (isRelational && item.type === "note")) && (
                    <button
                      className="elements__item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElementsDiagram([item.id]);
                      }}
                    >
                      <IoClose />
                    </button>
                  )}
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
