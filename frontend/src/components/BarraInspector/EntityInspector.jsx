import Icons from "../Others/IconProvider.jsx";
const { IoClose } = Icons;

function EntityInspector({ entity, updateEntity }) {
  const { name, attributes } = entity.data;

  const updateAttribute = (id, field, value) => {
    updateEntity({
      ...entity,
      data: {
        ...entity.data,
        attributes: entity.data.attributes.map((attr) =>
          attr.id === id ? { ...attr, [field]: value } : attr
        ),
      },
    });
  };

  const addAttribute = () => {
    updateEntity({
      ...entity,
      data: {
        ...entity.data,
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
          },
        ],
      },
    });
  };

  const removeAttribute = (id) => {
    updateEntity({
      ...entity,
      data: {
        ...entity.data,
        attributes: attributes.filter((attr) => attr.id !== id),
      },
    });
  };

  return (
    <div className="properties__container">
      <div className="properties__item_input">
        <label htmlFor="entity-name">Nombre de la entidad</label>
        <input
          type="text"
          value={name}
          onChange={(e) =>
            updateEntity({
              ...entity,
              data: { ...entity.data, name: e.target.value },
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
                <th>PK</th>
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

                {["pk", "nn", "uq", "ai"].map((key) => (
                  <td key={key}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={attr[key]}
                        onChange={(e) =>
                          updateAttribute(attr.id, key, e.target.checked)
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

export default EntityInspector;
