import { useEditor } from "../../context/EditorContext";
import Icons from "../Others/IconProvider.jsx";

const { IoClose } = Icons;

function RelationInspector() {
  const { selectedElement, updateElement, diagram } = useEditor();

  if (!selectedElement) return null;

  const { name, connections, attributes = [] } = selectedElement.data;

  const updateConnection = (side, field, value) => {
    const defaultValues = {
      entityId: "",
      cardinality: "1",
      participation: "partial",
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    };

    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        connections: {
          ...connections,
          [side]: {
            ...defaultValues,
            ...connections[side],
            [field]: value,
          },
        },
      },
    });
  };

  const getEntityNameById = (id) => {
    return diagram.entities.find((e) => e.id === id)?.data.name || "";
  };

  const updateAttribute = (id, field, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) =>
          attr.id === id ? { ...attr, [field]: value } : attr,
        ),
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
            type: "int",
            pk: false,
            nn: false,
            uq: false,
            ai: false,
            partial: false,
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
        attributes: attributes.filter((attr) => attr.id !== id), // <--- Usa 'attributes'
      },
    });
  };

  return (
    <div className="properties__container">
      <div className="properties__item">
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

      <div className="properties__item color divider">
        <label htmlFor="entity-color">Color de la relación</label>
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

      <div className="properties__cardinality divider">
        <h2>Cardinalidad y Restricciones</h2>

        <div className="table-wrapper">
          <table className="attributes">
            <thead>
              <tr>
                <th>Entidad</th>
                <th>Cardinalidad</th>
                <th>Participación</th>
                <th>ON DELETE</th>
                <th>ON UPDATE</th>
                <th></th>
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

                  {/* Cardinalidad */}
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

                  {/* Participación */}
                  <td>
                    <select
                      value={connections[side].participation || "partial"}
                      onChange={(e) => {
                        updateConnection(side, "participation", e.target.value);
                      }}
                    >
                      <option value="total">Total</option>
                      <option value="partial">Parcial</option>
                    </select>
                  </td>

                  {/* ON DELETE */}
                  <td>
                    {" "}
                    <select
                      title="ON DELETE"
                      value={connections[side].onDelete || "RESTRICT"}
                      onChange={(e) =>
                        updateConnection(side, "onDelete", e.target.value)
                      }
                    >
                      <option value="RESTRICT">RESTRICT</option>
                      <option value="CASCADE">CASCADE</option>
                      <option value="SET NULL">SET NULL</option>
                      <option value="NO ACTION">NO ACTION</option>
                    </select>
                  </td>

                  {/* ON UPDATE */}
                  <td>
                    <select
                      title="ON UPDATE"
                      value={connections[side].onUpdate || "RESTRICT"}
                      onChange={(e) =>
                        updateConnection(side, "onUpdate", e.target.value)
                      }
                    >
                      <option defaultValue>ON UPDATE</option>
                      <option value="RESTRICT">RESTRICT</option>
                      <option value="CASCADE">CASCADE</option>
                      <option value="SET NULL">SET NULL</option>
                      <option value="NO ACTION">NO ACTION</option>
                    </select>
                  </td>

                  {/* Color
                  <td>
                    <input
                      type="color"
                      id="entity-color"
                      value={connections[side].color || "#323c4c"}
                      onChange={(e) =>
                        updateConnection(side, "color", e.target.value)
                      }
                      title="Color de la conexión"
                    />
                  </td> */}

                  {/* Acciones */}
                  <td>
                    <button
                      className="delete-relation"
                      onClick={() => updateConnection(side, "entityId", "")}
                      title="Eliminar conexión"
                    >
                      <IoClose />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="properties__attributes">
        <h2>Atributos</h2>

        <table className="attributes">
          {attributes.length > 0 && (
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>NN</th>
                <th>UQ</th>
                <th>AI</th>
              </tr>
            </thead>
          )}

          <tbody>
            {attributes.map((attr) => (
              <tr key={attr.id}>
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
                    value={attr.type}
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

                {[, "nn", "uq", "ai"].map((flag) => (
                  <td key={`${attr.id}-${flag}`}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={attr[flag]}
                        onChange={(e) =>
                          updateAttribute(attr.id, flag, e.target.checked)
                        }
                      />
                      <span className="checkbox__box" />
                    </label>
                  </td>
                ))}

                <td>
                  <button
                    className="attributes__delete_button"
                    onClick={() => removeAttribute(attr.id)}
                    title="Eliminar atributo"
                  >
                    <IoClose />
                  </button>
                </td>
              </tr>
            ))}
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

export default RelationInspector;
