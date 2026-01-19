import Icons from "../Others/IconProvider.jsx";
const { IoClose, FaKey, LuKeySquare } = Icons;

import { useEditor } from "../../context/EditorContext.jsx";
import { useEditorMode } from "../../context/EditorModeContext.jsx";

function EntityInspector() {
  const { selectedElement, updateElement } = useEditor();
  const { isER, isRelational } = useEditorMode();

  const PK_FIELD = isER ? "pk" : "isPk";

  if (!selectedElement) return null;

  const { name, weak } = selectedElement.data;

  const attributes = isRelational
    ? selectedElement.data.columns || []
    : selectedElement.data.attributes || [];

  const updateAttribute = (id, field, value) => {
    // RESTRICCIÓN: En relacional no se tocan PK ni FK manualmente
    if (isRelational && (field === "isPk" || field === "isFk")) return;

    // Determinamos qué array actualizar
    const targetArray = isRelational ? "columns" : "attributes";

    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        [targetArray]: attributes.map((attr) => {
          if (attr.id !== id) return attr;
          let updated = { ...attr, [field]: value };

          // Reglas lógicas de ER
          if (isER) {
            if (field === "pk" && value) updated.partial = false;
            if (field === "partial" && value) updated.pk = false;
          }
          return updated;
        }),
      },
    });
  };

  const addAttribute = () => {
    const newId = crypto.randomUUID();
    const newAttr = {
      id: newId,
      name: "nuevo_atributo",
      type: "varchar",
      // Campos para ER
      pk: false,
      partial: false,
      // Campos para Relacional
      isPk: false,
      isFk: false,
      nn: false,
      uq: false,
      ai: false,
      isDerived: false, // Importante: es un atributo manual, no generado
    };

    // Si estás en modo Relacional, actualizamos 'columns'
    // Si estás en modo ER, actualizamos 'attributes'
    const key = isRelational ? "columns" : "attributes";
    const currentList = isRelational
      ? selectedElement.data.columns || []
      : selectedElement.data.attributes || [];

    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        [key]: [...currentList, newAttr],
      },
    });
  };

  const canDeleteAttribute = (attr) => {
    if (isRelational && attr.isDerived) return false;

    // En ER: No puedes borrar la PK si es lo único que identifica a la entidad
    if (isER && (attr.pk || attr.partial)) return false;

    return true;
  };

  const removeAttribute = (id) => {
    const attr = attributes.find((a) => a.id === id);
    if (!attr || !canDeleteAttribute(attr)) return;

    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        [isRelational ? "columns" : "attributes"]: attributes.filter(
          (a) => a.id !== id,
        ),
      },
    });
  };

  return (
    <div className="properties__container">
      <div className="properties__item">
        <div className="item input--text">
          <label htmlFor="entity-name">Nombre de la entidad</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) =>
              updateElement({
                ...selectedElement,
                data: { ...selectedElement.data, name: e.target.value },
              })
            }
          />
        </div>

        {isER && (
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
        )}
      </div>

      <div className="properties__item color divider">
        <label htmlFor="entity-color">Color de la entidad</label>
        <input
          type="color"
          id="entity-color"
          value={selectedElement.data.color || "#323c4c"}
          onChange={(e) =>
            updateElement({
              ...selectedElement,
              data: { ...selectedElement.data, color: e.target.value },
            })
          }
        />
      </div>

      <div className="properties__attributes">
        <h2>Atributos</h2>

        <table className="attributes">
          {attributes.length > 0 && (
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th title="Llave Primaria">
                  <FaKey size={12} />
                </th>
                {isRelational && <th title="Llave Foránea">FK</th>}
                <th title="No Nulo">NN</th>
                <th title="Único">UQ</th>
                <th title="Auto Incremento">AI</th>
                {isER && (
                  <th title="Llave Parcial">
                    <LuKeySquare size={12} />
                  </th>
                )}
                <th>Acciones</th>
              </tr>
            </thead>
          )}

          <tbody>
            {attributes.map((attr) => {
              const isKeyDisabled = isRelational && attr.isDerived;
              return (
                <tr key={attr.id}>
                  <td>
                    <input
                      type="text"
                      value={attr.name || ""}
                      onChange={(e) =>
                        updateAttribute(attr.id, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={attr.type || ""}
                      onChange={(e) =>
                        updateAttribute(attr.id, "type", e.target.value)
                      }
                    >
                      <option value="int">int</option>
                      <option value="varchar">varchar</option>
                      <option value="text">text</option>
                      <option value="date">date</option>
                      <option value="boolean">boolean</option>
                    </select>
                  </td>

                  <td>
                    <label
                      className={`checkbox ${isKeyDisabled || (isER && selectedElement.data.weak) ? "disabled" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isRelational ? attr.isPk : attr.pk}
                        disabled={
                          isKeyDisabled || (isER && selectedElement.data.weak)
                        }
                        onChange={(e) =>
                          updateAttribute(
                            attr.id,
                            isRelational ? "isPk" : "pk",
                            e.target.checked,
                          )
                        }
                      />
                      <span className="checkbox__box" />
                    </label>
                  </td>

                  {isRelational && (
                    <td>
                      <label className={"checkbox disabled"}>
                        <input type="checkbox" checked={attr.isFk} disabled />
                        <span className="checkbox__box" />
                      </label>
                    </td>
                  )}

                  {["nn", "uq", "ai"].map((flag) => (
                    <td key={flag}>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={
                            isRelational
                              ? flag === "nn"
                                ? attr.isNotNull
                                : flag === "uq"
                                  ? attr.isUnique
                                  : attr.isAi
                              : attr[flag]
                          }
                          onChange={(e) => {
                            const field = isRelational
                              ? flag === "nn"
                                ? "isNotNull"
                                : flag === "uq"
                                  ? "isUnique"
                                  : "isAi"
                              : flag;
                            updateAttribute(attr.id, field, e.target.checked);
                          }}
                        />
                        <span className="checkbox__box" />
                      </label>
                    </td>
                  ))}

                  {isER && (
                    <td>
                      <label
                        className={`checkbox ${attr.pk || !selectedElement.data.weak ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={attr.partial}
                          disabled={attr.pk || !selectedElement.data.weak}
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
                  )}

                  <td>
                    {canDeleteAttribute(attr) && (
                      <button
                        className="attributes__delete_button"
                        onClick={() => removeAttribute(attr.id)}
                      >
                        <IoClose />
                      </button>
                    )}
                  </td>
                </tr>
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

export default EntityInspector;
