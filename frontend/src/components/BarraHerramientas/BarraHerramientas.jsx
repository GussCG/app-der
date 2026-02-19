import Icons from "../Others/IconProvider.jsx";
import { useState } from "react";
import { useEditorMode } from "../../context/EditorModeContext.jsx";
import { useTool } from "../../context/ToolContext.jsx";
import { useEditor } from "../../context/EditorContext.jsx";

const {
  LuMousePointer2,
  FaRegHandPaper,
  LuRectangleHorizontal,
  TbRelationOneToOne,
  TbRelationOneToMany,
  TbRelationManyToMany,
  CgShapeRhombus,
  TbZoomIn,
  TbZoomOut,
  TbZoomReset,
  MdOutlineTableChart,
  LuLayoutDashboard,
  FaEraser,
  LuLassoSelect,
  IoText,
} = Icons;

export default function BarraHerramientas() {
  const { activeTool, setActiveTool } = useTool();
  const { isER } = useEditorMode();
  const [openVariants, setOpenVariants] = useState(false);
  const { autoLayoutDiagram } = useEditor();

  const handleClick = (tool, hasVariants = false) => {
    setActiveTool(tool);
    if (hasVariants) {
      setOpenVariants(!openVariants);
    } else {
      setOpenVariants(false);
    }
  };

  const handleParentClick = () => {
    setOpenVariants(!openVariants);
  };

  return (
    <div className="toolbar" data-tour="er-toolbar">
      {/* SELECT NORMAL */}
      <div
        className={`toolbar__item ${activeTool === "select" ? "active" : ""}`}
        onClick={() => handleClick("select")}
        data-tour="tool-select"
      >
        <div className="toolbar__icon" title="Seleccionar (V)">
          <LuMousePointer2 />
        </div>
      </div>

      {/* PAN */}
      <div
        className={`toolbar__item ${activeTool === "pan" ? "active" : ""}`}
        onClick={() => handleClick("pan")}
        data-tour="tool-pan"
      >
        <div className="toolbar__icon" title="Movimiento Libre (M)">
          <FaRegHandPaper />
        </div>
      </div>
      {isER && (
        <>
          {/* CREAR ENTIDAD */}
          <div
            className={`toolbar__item ${
              activeTool === "entity" ? "active" : ""
            }`}
            onClick={() => handleClick("entity")}
            data-tour="tool-add-entity"
          >
            <div className="toolbar__icon" title="Entidad (E)">
              <LuRectangleHorizontal />
            </div>
          </div>

          {/* CREAR RELACIÓN */}
          <div
            className={`toolbar__item ${
              activeTool === "relation" ? "active" : ""
            }`}
            onClick={() => handleClick("relation")}
            data-tour="tool-add-relation"
          >
            <div className="toolbar__icon" title="Relación (R)">
              <CgShapeRhombus />
            </div>
          </div>
        </>
      )}

      <div
        className={`toolbar__item ${activeTool === "note" ? "active" : ""}`}
        onClick={() => handleClick("note")}
        data-tour="tool-add-text"
      >
        <div className="toolbar__icon" title="Texto (T)">
          <IoText />
        </div>
      </div>
    </div>
  );
}
