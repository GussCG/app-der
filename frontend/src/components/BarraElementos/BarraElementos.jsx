import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";

const {
  FaSearch,
  HiOutlineTableCells,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  CgShapeRhombus,
} = Icons;

function BarraElementos({
  hidden,
  onToggle,
  onSelectElement,
  selectedElement,
}) {
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
              <div
                className={`elements__item ${
                  selectedElement === "entity-1" ? "selected" : ""
                }`}
                onClick={() =>
                  onSelectElement({
                    id: "entity-1",
                    type: "entity",
                    data: {
                      name: "Entidad 1",
                      attributes: [
                        {
                          id: "attr-1",
                          name: "Atributo 1",
                          type: "int",
                          pk: true,
                          nn: true,
                          uq: false,
                          ai: true,
                        },
                      ],
                    },
                  })
                }
              >
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
              {/* Ejemplo de Relación */}
              <div
                className={`elements__item ${
                  selectedElement === "relation-1" ? "selected" : ""
                }`}
                onClick={() =>
                  onSelectElement({
                    id: "relation-1",
                    type: "relation",
                    data: {
                      name: "Relación 1",
                      connections: {
                        source: {
                          entityId: "entity-1",
                          entityName: "Entidad 1",
                          cardinality: "1",
                        },
                        target: {
                          entityId: "entity-2",
                          entityName: "Entidad 2",
                          cardinality: "N",
                        },
                      },
                    },
                  })
                }
              >
                <CgShapeRhombus />
                <span>Relación 1</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BarraElementos;
