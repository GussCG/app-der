import React, { useState, useEffect, useRef } from "react";
import { useEditor } from "../../../context/EditorContext";
import { Compact } from "@uiw/react-color";
import Icons from "../../Others/IconProvider";
import { AnimatePresence, motion } from "framer-motion";
import ValidateInput from "../../Others/ValidateInput";
import { validateERName } from "../../../constants/validators";

const { IoClose } = Icons;

function ERRelationInspector() {
  const { selectedElement, updateElement, diagram, usedColors } = useEditor();
  if (!selectedElement || selectedElement.kind !== "relation") return null;

  const { name, connections, attributes = [] } = selectedElement.data;

  const latestDataRef = useRef(selectedElement?.data);

  useEffect(() => {
    latestDataRef.current = selectedElement?.data;
  }, [selectedElement]);

  const patchData = (changes) => {
    const currentData = latestDataRef.current || selectedElement.data;

    const newData = {
      ...currentData,
      ...changes,
    };

    latestDataRef.current = newData;

    updateElement({
      ...selectedElement,
      data: newData,
    });
  };

  const updateConnection = (side, field, value) => {
    const currentConnections =
      latestDataRef.current?.connections || connections;

    const newConnections = {
      ...currentConnections,
      [side]: { ...currentConnections[side], [field]: value },
    };

    patchData({ connections: newConnections });
  };

  const updateAttribute = (id, field, value) => {
    const currentAttributes = latestDataRef.current?.attributes || attributes;

    const updatedAttributes = currentAttributes.map((attr) => {
      if (attr.id !== id) return attr;
      let updated = { ...attr, [field]: value };

      if (field === "kind" && value !== "composite") {
        updated.children = [];
      }
      return updated;
    });

    patchData({ attributes: updatedAttributes });
  };

  const addAttribute = () => {
    const currentAttributes = latestDataRef.current?.attributes || attributes;
    if (currentAttributes.length >= 6) return;

    const newAttr = {
      id: crypto.randomUUID(),
      name: "",
      kind: "simple",
      children: [],
    };

    patchData({ attributes: [...currentAttributes, newAttr] });
  };

  const removeAttribute = (id) => {
    const currentAttributes = latestDataRef.current?.attributes || attributes;
    patchData({
      attributes: currentAttributes.filter((attr) => attr.id !== id),
    });
  };

  const addSubattribute = (parentId) => {
    const currentAttributes = latestDataRef.current?.attributes || attributes;
    const updated = currentAttributes.map((attr) =>
      attr.id === parentId
        ? {
            ...attr,
            children: [
              ...(attr.children || []),
              { id: crypto.randomUUID(), name: "", kind: "simple" },
            ],
          }
        : attr,
    );
    patchData({ attributes: updated });
  };

  const updateSubattribute = (parentId, subId, value) => {
    const currentAttributes = latestDataRef.current?.attributes || attributes;

    const updated = currentAttributes.map((attr) => {
      if (attr.id !== parentId) return attr;
      return {
        ...attr,
        children: attr.children.map((c) =>
          c.id === subId ? { ...c, name: value } : c,
        ),
      };
    });

    patchData({ attributes: updated });
  };

  const removeSubattribute = (parentId, subId) => {
    const currentAttributes = latestDataRef.current?.attributes || attributes;

    const updated = currentAttributes.map((attr) => {
      if (attr.id !== parentId) return attr;
      return {
        ...attr,
        children: attr.children.filter((child) => child.id !== subId),
      };
    });

    patchData({ attributes: updated });
  };

  return (
    <motion.div className="properties__container" data-tour="inspector">
      <div className="properties__item" data-tour="inspector-name-input">
        <div className="item input--text">
          <label htmlFor="relation-name">Nombre de la relación</label>
          <ValidateInput
            id="relation-name"
            value={name || ""}
            placeholder="Nombre de la relación"
            validator={validateERName}
            transform={(v) => v.toUpperCase()}
            onChange={(v) =>
              patchData({
                name: v,
              })
            }
          />
        </div>

        <div className="item input--select">
          <label htmlFor="relation-type">Tipo de relación</label>
          <select
            id="relation-type"
            value={selectedElement.data.type || "simple"}
            onChange={(e) =>
              patchData({
                type: e.target.value,
              })
            }
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

          <Compact
            key={selectedElement.id}
            style={{
              width: "100%",
              background: "transparent",
              boxShadow: "none",
            }}
            color={selectedElement.data.color || "#323c4c"}
            onChange={(c) => patchData({ color: c.hex })}
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
              onChange={(c) => patchData({ color: c.hex })}
            />
          </div>
        )}
      </div>

      <div
        className="properties__cardinality divider"
        data-tour="inspector-cardinality"
      >
        <h2>Cardinalidad</h2>
        <table className="cardinality">
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
                    value={connections[side].entityId || ""}
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
        className="properties__attributes"
        data-tour="inspector-attributes-section"
      >
        <div className="properties__attributes-header">
          <h2>Atributos de la relación</h2>
          <span
            className={`limit-counter ${attributes.length >= 15 ? "limit-reached" : ""}`}
          >
            {attributes.length}/15
          </span>
        </div>

        <div className="table-wrapper">
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
                            value={attr.name || ""}
                            placeholder="Nombre del atributo"
                            validator={validateERName}
                            onChange={(v) =>
                              updateAttribute(attr.id, "name", v)
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
                      </motion.tr>

                      <AnimatePresence>
                        {attr.kind === "composite" && (
                          <tr className="subattributes-row">
                            <td colSpan={3}>
                              <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <table className="subattributes">
                                  <tbody>
                                    {attr.children?.map((child) => (
                                      <tr
                                        key={child.id}
                                        className="subattribute-item"
                                      >
                                        <td>
                                          <ValidateInput
                                            value={child.name}
                                            placeholder="Nombre del atributo"
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
                                  className={`properties__subattribute_add_button ${attr.children.length >= 5 ? "disabled" : ""}`}
                                  onClick={() => addSubattribute(attr.id)}
                                  disabled={attr.children.length >= 5}
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
                  ))}
                </tbody>
              </>
            )}
          </table>
          <motion.button
            className={`properties__attribute_add_button ${attributes.length >= 6 ? "disabled" : ""}`}
            onClick={addAttribute}
            disabled={attributes.length >= 6}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {attributes.length >= 6
              ? "Máximo 6 atributos"
              : "Agregar atributo +"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ERRelationInspector;
