import Icons from "../Others/IconProvider.jsx";
const { IoClose } = Icons;

import { useEditor } from "../../context/EditorContext.jsx";

function EntityInspector() {
  const { selectedElement, updateElement } = useEditor();

  if (!selectedElement) return null;

  const { name, attributes } = selectedElement.data;

  const updateAttribute = (id, field, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: attributes.map((attr) =>
          attr.id === id ? { ...attr, [field]: value } : attr
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
          ...selectedElement.data.attributes,
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
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        attributes: selectedElement.data.attributes.filter(
          (attr) => attr.id !== id
        ),
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
            updateElement({
              ...selectedElement,
              data: { ...selectedElement.data, name: e.target.value },
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

                {["pk", "nn", "uq", "ai"].map((flag) => (
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

export default EntityInspector;
