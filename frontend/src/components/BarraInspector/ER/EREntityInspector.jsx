import React, { useState } from "react";
import { useEditor } from "../../../context/EditorContext.jsx";
import Icons from "../../Others/IconProvider.jsx";
import { Colorful } from "@uiw/react-color";

const { FaKey, LuKeySquare, IoClose } = Icons;

function EREntityInspector() {
  const { selectedElement, updateElement, usedColors } = useEditor();
  if (!selectedElement) return null;

  const { name, weak, attributes = [] } = selectedElement.data;

  const [showColorPicker, setShowColorPicker] = useState(false);

  const updateAttribute = (id, field, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) => {
          if (attr.id !== id) return attr;

          let updated = { ...attr, [field]: value };

          // PK / Partial
          if (field === "pk" && value) updated.partial = false;
          if (field === "partial" && value) updated.pk = false;

          // Tipo ER
          if (field === "kind") {
            if (value === "derived") {
              updated.pk = false;
              updated.partial = false;
              updated.children = [];
            }

            if (value !== "composite") {
              updated.children = [];
            }
          }
          return updated;
        }),
      },
    });
  };

  const addAttribute = () => {
    const newId = crypto.randomUUID();
    const newAttribute = {
      id: newId,
      name: "",
      kind: "simple",
      pk: false,
      partial: false,
      children: [],
    };

    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: [...attributes, newAttribute],
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
    const newId = crypto.randomUUID();
    const newSubattribute = {
      id: newId,
      name: "",
      kind: "simple",
    };
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) => {
          if (attr.id !== parentId) return attr;
          return {
            ...attr,
            children: [...attr.children, newSubattribute],
          };
        }),
      },
    });
  };

  const removeSubattribute = (parentId, subId) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) => {
          if (attr.id !== parentId) return attr;
          return {
            ...attr,
            children: attr.children.filter((child) => child.id !== subId),
          };
        }),
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
    <div className="properties__container">
      <div className="properties__item" data-tour="inspector-name-input">
        <div className="item input--text">
          <label htmlFor="entity-name">Nombre de la entidad</label>
          <input
            type="text"
            id="entity-name"
            value={name}
            onChange={(e) =>
              updateElement({
                ...selectedElement,
                data: {
                  ...selectedElement.data,
                  name: e.target.value.toUpperCase(),
                },
              })
            }
          />
        </div>

        <div className="item input--checkbox">
          <label>Entidad débil</label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={weak || false}
              onChange={(e) => {
                const isWeak = e.target.checked;

                updateElement({
                  ...selectedElement,
                  data: {
                    ...selectedElement.data,
                    weak: isWeak,
                    attributes: attributes.map((a) => ({
                      ...a,
                      pk: isWeak ? false : a.pk,
                      partial: !isWeak ? false : a.partial,
                    })),
                  },
                });
              }}
            />
            <span className="checkbox__box" />
          </label>
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
        className="properties__attributes"
        data-tour="inspector-attributes-section"
      >
        <h2>Atributos</h2>

        <table className="attributes">
          {attributes.length > 0 && (
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo de atributo</th>
                <th title="Llave Primaria">
                  <FaKey size={12} />
                </th>
                <th title="Llave Parcial">
                  <LuKeySquare size={12} />
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
          )}

          <tbody>
            {attributes.map((attr) => {
              return (
                <React.Fragment key={attr.id}>
                  <tr>
                    <td>
                      <input
                        placeholder="Nuevo Atributo"
                        type="text"
                        value={attr.name || ""}
                        onChange={(e) =>
                          updateAttribute(attr.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="type-cell">
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
                      </div>
                    </td>

                    <td>
                      <label
                        className={`checkbox ${selectedElement.data.weak ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={attr.pk}
                          disabled={
                            attr.kind !== "simple" || selectedElement.data.weak
                          }
                          onChange={(e) =>
                            updateAttribute(attr.id, "pk", e.target.checked)
                          }
                        />
                        <span className="checkbox__box" />
                      </label>
                    </td>

                    <td>
                      <label
                        className={`checkbox ${attr.pk || !selectedElement.data.weak ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={attr.partial}
                          disabled={
                            attr.kind !== "simple" ||
                            attr.pk ||
                            !selectedElement.data.weak
                          }
                          onChange={(e) =>
                            updateAttribute(
                              attr.id,
                              "partial",
                              e.target.checked,
                            )
                          }
                        />
                        <span className="checkbox__box" />
                      </label>
                    </td>

                    <td>
                      <button
                        className="attributes__delete_button"
                        onClick={() => removeAttribute(attr.id)}
                      >
                        <IoClose />
                      </button>
                    </td>
                  </tr>

                  {attr.kind === "composite" && (
                    <tr className="subattributes-row">
                      <td colSpan={5}>
                        <table className="subattributes">
                          <tbody>
                            {attr.children.map((child) => (
                              <tr key={child.id} className="subattribute-item">
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Nombre del atributo"
                                    value={child.name || ""}
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
                                  <button
                                    className="attributes__delete_button"
                                    onClick={() =>
                                      removeSubattribute(attr.id, child.id)
                                    }
                                  >
                                    <IoClose />
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
                          Agregar subatributo +
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <button
          className="properties__attribute_add_button"
          onClick={addAttribute}
        >
          Agregar atributo +
        </button>
      </div>
    </div>
  );
}

export default EREntityInspector;
