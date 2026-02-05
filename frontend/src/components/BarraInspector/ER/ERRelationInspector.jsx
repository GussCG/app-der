import React, { useState } from "react";
import { useEditor } from "../../../context/EditorContext";
import { Colorful } from "@uiw/react-color";
import Icons from "../../Others/IconProvider";

const { IoClose } = Icons;

function ERRelationInspector() {
  const { selectedElement, updateElement, diagram, usedColors } = useEditor();
  if (!selectedElement || selectedElement.kind !== "relation") return null;

  const [showColorPicker, setShowColorPicker] = useState(false);

  const { name, connections, attributes = [] } = selectedElement.data;

  const updateConnection = (side, field, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        connections: {
          ...connections,
          [side]: { ...connections[side], [field]: value },
        },
      },
    });
  };

  const updateAttribute = (id, field, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) => {
          if (attr.id !== id) return attr;
          let updated = { ...attr, [field]: value };

          // Limpiar hijos si deja de ser compuesto
          if (field === "kind" && value !== "composite") {
            updated.children = [];
          }
          if (field === "kind" && value === "composite") {
            updated.children = updated.children || [];
          }
          return updated;
        }),
      },
    });
  };

  const addAttribute = () => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: [
          ...attributes,
          {
            id: crypto.randomUUID(),
            name: "",
            kind: "simple",
            children: [],
          },
        ],
      },
    });
  };

  const removeAttribute = (id) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.filter((attr) => attr.id !== id),
      },
    });
  };

  const addSubattribute = (parentId) => {
    const newSub = { id: crypto.randomUUID(), name: "", kind: "simple" };
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) =>
          attr.id === parentId
            ? { ...attr, children: [...(attr.children || []), newSub] }
            : attr,
        ),
      },
    });
  };

  const updateSubattribute = (parentId, subId, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) => {
          if (attr.id !== parentId) return attr;
          return {
            ...attr,
            children: attr.children.map((c) =>
              c.id === subId ? { ...c, name: value } : c,
            ),
          };
        }),
      },
    });
  };

  return (
    <div className="properties__container" data-tour="inspector">
      <div className="properties__item" data-tour="inspector-name-input">
        <div className="item input--text">
          <label>Nombre de la relación</label>
          <input
            type="text"
            value={name}
            onChange={(e) =>
              updateElement({
                ...selectedElement,
                data: { ...selectedElement.data, name: e.target.value },
              })
            }
          />
        </div>

        <div className="item input--select">
          <label>Tipo de relación</label>
          <select
            value={selectedElement.data.type || "simple"}
            onChange={(e) => {
              updateElement({
                ...selectedElement,
                data: {
                  ...selectedElement.data,
                  type: e.target.value,
                },
              });
            }}
          >
            <option value="simple">Simple</option>
            <option value="identifying">Identificadora</option>
          </select>
        </div>
      </div>

      <div
        className="properties__item color divider"
        data-tour="inspector-color-picker"
      >
        <div className="color-row">
          <label htmlFor="entity-color">Color de la entidad</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowColorPicker((v) => !v)}
              style={{
                backgroundColor: selectedElement.data.color || "#323c4c",
              }}
            />

            {showColorPicker && (
              <div className="color-picker-popover">
                <Colorful
                  color={selectedElement.data.color || "#323c4c"}
                  onChange={(color) => {
                    updateElement({
                      ...selectedElement,
                      data: {
                        ...selectedElement.data,
                        color: color.hex,
                      },
                    });
                  }}
                  disableAlpha={true}
                />
              </div>
            )}
          </div>
        </div>

        {usedColors.length > 0 && (
          <div className="used-colors">
            <span className="used-colors__label">
              Colores usados en el diagrama
            </span>

            <div className="used-colors__list">
              {usedColors.map((c) => {
                const isActive =
                  c === (selectedElement.data.color || "").toLowerCase();

                return (
                  <button
                    key={c}
                    className={`used-colors__item ${isActive ? "active" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => {
                      updateElement({
                        ...selectedElement,
                        data: { ...selectedElement.data, color: c },
                      });
                    }}
                    title={c}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div
        className="properties__cardinality divider"
        data-tour="inspector-cardinality"
      >
        <h2>Cardinalidad</h2>
        <table className="attributes">
          <thead>
            <tr>
              <th>Entidad</th>
              <th>Cardinalidad</th>
              <th>Participación</th>
            </tr>
          </thead>

          <tbody>
            {["source", "target"].map((side) => (
              <tr key={side}>
                <td>
                  {/* Entidad */}
                  <select
                    value={connections[side].entityId}
                    onChange={(e) =>
                      updateConnection(side, "entityId", e.target.value)
                    }
                  >
                    <option value="">Sin conectar</option>
                    {diagram.entities.map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.data.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={connections[side].cardinality}
                    onChange={(e) =>
                      updateConnection(side, "cardinality", e.target.value)
                    }
                  >
                    <option value="1">1</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td>
                  <select
                    value={connections[side].participation}
                    onChange={(e) =>
                      updateConnection(side, "participation", e.target.value)
                    }
                  >
                    <option value="partial">Parcial</option>
                    <option value="total">Total</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="properties__attributes divider"
        data-tour="inspector-attributes-section"
      >
        <h2>Atributos de la relación</h2>
        <table className="attributes">
          {attributes.length > 0 && (
            <>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((attr) => (
                  <React.Fragment key={attr.id}>
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={attr.name}
                          onChange={(e) =>
                            updateAttribute(attr.id, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={attr.kind}
                          onChange={(e) =>
                            updateAttribute(attr.id, "kind", e.target.value)
                          }
                        >
                          <option value="simple">Simple</option>
                          <option value="composite">Compuesto</option>
                          <option value="derived">Derivado</option>
                          <option value="multivalued">Multivaluado</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => removeAttribute(attr.id)}
                          className="attributes__delete_button"
                        >
                          <IoClose />
                        </button>
                      </td>
                    </tr>

                    {/* FILA DE SUB-ATRIBUTOS SI ES COMPUESTO */}
                    {attr.kind === "composite" && (
                      <tr className="subattributes-row">
                        <td colSpan={3}>
                          <table className="subattributes">
                            <tbody>
                              {attr.children?.map((child) => (
                                <tr
                                  key={child.id}
                                  className="subattribute-item"
                                >
                                  <td>
                                    <input
                                      type="text"
                                      placeholder="Nombre del atributo"
                                      value={child.name}
                                      onChange={(e) =>
                                        updateSubattribute(
                                          attr.id,
                                          child.id,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    {" "}
                                    <button
                                      onClick={() => {
                                        const newChildren =
                                          attr.children.filter(
                                            (c) => c.id !== child.id,
                                          );
                                        updateAttribute(
                                          attr.id,
                                          "children",
                                          newChildren,
                                        );
                                      }}
                                    >
                                      <IoClose size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            className="properties__subattribute_add_button"
                            onClick={() => addSubattribute(attr.id)}
                          >
                            + Sub-atributo
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </>
          )}
        </table>
        <button
          className="properties__attribute_add_button"
          onClick={addAttribute}
        >
          Agregar Atributo +
        </button>
      </div>
    </div>
  );
}

export default ERRelationInspector;
