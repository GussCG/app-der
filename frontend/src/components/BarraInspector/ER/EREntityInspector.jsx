import React, { useState } from "react";
import { useEditor } from "../../../context/EditorContext.jsx";
import Icons from "../../Others/IconProvider.jsx";
import { Colorful } from "@uiw/react-color";
import { AnimatePresence, motion } from "framer-motion";
import { validateERName } from "../../../constants/validators.js";
import ValidateInput from "../../Others/ValidateInput.jsx";

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
    <motion.div className="properties__container">
      <div className="properties__item" data-tour="inspector-name-input">
        <div className="item input--text">
          <label htmlFor="entity-name">Nombre de la entidad</label>
          <ValidateInput
            id="entity-name"
            value={name || ""}
            placeholder="Nombre de la entidad"
            validator={validateERName}
            transform={(v) => v.toUpperCase()}
            onChange={(v) =>
              updateElement({
                ...selectedElement,
                data: {
                  ...selectedElement.data,
                  name: v,
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

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
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
                  <button
                    className="color-picker-close"
                    onClick={() => setShowColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
                  <motion.tr
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "40px" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden", display: "table-row" }}
                  >
                    <td>
                      <ValidateInput
                        value={attr.name}
                        placeholder="Nuevo atributo"
                        validator={validateERName}
                        onChange={(v) => updateAttribute(attr.id, "name", v)}
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
                  </motion.tr>

                  <AnimatePresence>
                    {attr.kind === "composite" && (
                      <tr className="subattributes-row">
                        <td colSpan={5}>
                          <motion.div
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <table className="subattributes">
                              <tbody>
                                {attr.children.map((child) => (
                                  <tr
                                    key={child.id}
                                    className="subattribute-item"
                                  >
                                    <td>
                                      <ValidateInput
                                        placeholder="Nombre del subatributo"
                                        value={child.name || ""}
                                        validator={validateERName}
                                        onChange={(v) =>
                                          updateSubattribute(
                                            attr.id,
                                            child.id,
                                            v,
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
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <motion.button
          layout
          className="properties__attribute_add_button"
          onClick={addAttribute}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Agregar atributo +
        </motion.button>
      </div>
    </motion.div>
  );
}

export default EREntityInspector;
