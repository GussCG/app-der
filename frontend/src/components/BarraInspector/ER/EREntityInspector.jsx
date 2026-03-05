import React, { useState } from "react";
import { useEditor } from "../../../context/EditorContext.jsx";
import Icons from "../../Others/IconProvider.jsx";
import { Colorful } from "@uiw/react-color";
import Compact from "@uiw/react-color-compact";
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
    if (attributes.length >= 15) {
      return;
    }

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
    const parentAttr = attributes.find((attr) => attr.id === parentId);
    if (parentAttr.children.length >= 5) return;

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

          <Compact
            key={selectedElement.id}
            style={{
              width: "100%",
              background: "transparent",
              boxShadow: "none",
            }}
            color={selectedElement.data.color || "#323c4c"}
            onChange={(color) => {
              const updatedData = {
                ...selectedElement,
                data: {
                  ...selectedElement.data,
                  color: color.hex,
                },
              };
              updateElement(updatedData);
            }}
          />
        </div>

        {usedColors.length > 0 && (
          <div className="used-colors">
            <span className="used-colors__label">
              Colores usados en el diagrama
            </span>

            <Compact
              key={`used-${selectedElement.id}`}
              style={{
                width: "100%",
                background: "transparent",
                boxShadow: "none",
              }}
              color={selectedElement.data.color || "#323c4c"}
              colors={usedColors}
              onChange={(color) => {
                const updatedData = {
                  ...selectedElement,
                  data: {
                    ...selectedElement.data,
                    color: color.hex,
                  },
                };
                updateElement(updatedData);
              }}
            />
          </div>
        )}
      </div>

      <div
        className="properties__attributes"
        data-tour="inspector-attributes-section"
      >
        <div className="properties__attributes-header">
          <h2>Atributos</h2>
          <span
            className={`limit-counter ${attributes.length >= 15 ? "limit-reached" : ""}`}
          >
            {attributes.length}/15
          </span>
        </div>

        <div className="table-wrapper">
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
                              attr.kind !== "simple" ||
                              selectedElement.data.weak
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
                                            removeSubattribute(
                                              attr.id,
                                              child.id,
                                            )
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
                                className={`properties__subattribute_add_button ${attr.children.length >= 5 ? "disabled" : ""}`}
                                disabled={attr.children.length >= 5}
                                onClick={() => addSubattribute(attr.id)}
                              >
                                {attr.children.length >= 5
                                  ? "Máximo 5 subatributos"
                                  : "Agregar subatributo +"}
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
            className={`properties__attribute_add_button ${attributes.length >= 15 ? "disabled" : ""}`}
            disabled={attributes.length >= 15}
            onClick={addAttribute}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {attributes.length >= 15
              ? "Máximo 15 atributos"
              : "Agregar atributo +"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default EREntityInspector;
