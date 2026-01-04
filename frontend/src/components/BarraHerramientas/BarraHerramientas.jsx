import Icons from "../Others/IconProvider.jsx";
import { useState } from "react";
import { useEditorMode } from "../../context/EditorModeContext.jsx";
import { useTool } from "../../context/ToolContext.jsx";

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
} = Icons;

export default function BarraHerramientas() {
  const { activeTool, setActiveTool } = useTool();
  const { isER } = useEditorMode();
  const [openVariants, setOpenVariants] = useState(false);

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

  // const getParentIcon = () => {
  //   if (["one-to-one", "one-to-many", "many-to-many"].includes(activeTool)) {
  //     switch (activeTool) {
  //       case "one-to-one":
  //         return <TbRelationOneToOne />;
  //       case "one-to-many":
  //         return <TbRelationOneToMany />;
  //       case "many-to-many":
  //         return <TbRelationManyToMany />;
  //       default:
  //         return <TbRelationOneToOne />;
  //     }
  //   }
  //   return <TbRelationOneToOne />; // default si se abre el panel sin seleccionar
  // };

  return (
    <div className="toolbar">
      <div
        className={`toolbar__item ${activeTool === "select" ? "active" : ""}`}
        onClick={() => handleClick("select")}
      >
        <div className="toolbar__icon" title="Seleccionar">
          <LuMousePointer2 />
        </div>
      </div>
      <div
        className={`toolbar__item ${activeTool === "pan" ? "active" : ""}`}
        onClick={() => handleClick("pan")}
      >
        <div className="toolbar__icon" title="Movimiento Libre">
          <FaRegHandPaper />
        </div>
      </div>
      {isER && (
        <>
          <div
            className={`toolbar__item ${
              activeTool === "entity" ? "active" : ""
            }`}
            onClick={() => handleClick("entity")}
          >
            <div className="toolbar__icon" title="Entidad">
              <LuRectangleHorizontal />
            </div>
          </div>
          <div
            className={`toolbar__item ${
              activeTool === "relation" ? "active" : ""
            }`}
            onClick={() => handleClick("relation")}
          >
            <div className="toolbar__icon" title="Relación">
              <CgShapeRhombus />
            </div>
          </div>
          {/* <div
            className={`toolbar__item tool--has-variants ${
              openVariants ? "open" : ""
            } ${
              ["one-to-one", "one-to-many", "many-to-many"].includes(activeTool)
                ? "active"
                : ""
            }`}
            onClick={handleParentClick}
          >
            <div className="toolbar__icon" title="Relación">
              {getParentIcon()}
            </div>
            {openVariants && (
              <div className="variants">
                {[
                  {
                    tool: "one-to-one",
                    Icon: TbRelationOneToOne,
                    title: "Uno a Uno",
                  },
                  {
                    tool: "one-to-many",
                    Icon: TbRelationOneToMany,
                    title: "Uno a Muchos",
                  },
                  {
                    tool: "many-to-many",
                    Icon: TbRelationManyToMany,
                    title: "Muchos a Muchos",
                  },
                ].map(({ tool, Icon, title }) => (
                  <div
                    key={tool}
                    className={`toolbar__item_variant ${
                      activeTool === tool ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(tool);
                    }}
                  >
                    <div className="toolbar__icon" title={`Relación ${title}`}>
                      <Icon />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </>
      )}

      {/* <div
        className={`toolbar__item ${activeTool === "zoom-in" ? "active" : ""}`}
        onClick={() => handleClick("zoom-in")}
      >
        <div className="toolbar__icon" title="Zoom In">
          <TbZoomIn />
        </div>
      </div>
      <div
        className={`toolbar__item ${activeTool === "zoom-out" ? "active" : ""}`}
        onClick={() => handleClick("zoom-out")}
      >
        <div className="toolbar__icon" title="Zoom Out">
          <TbZoomOut />
        </div>
      </div> */}
      {/* <div
        className={`toolbar__item`}
        onClick={() => handleClick("reset-zoom")}
      >
        <div className="toolbar__icon" title="Restablecer Zoom">
          <TbZoomReset />
        </div>
      </div> */}
    </div>
  );
}
