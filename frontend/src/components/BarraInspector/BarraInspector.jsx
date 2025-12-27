import { useState } from "react";
import { nanoid } from "nanoid";
import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";

const { LuPanelLeftClose, LuPanelLeftOpen, IoClose } = Icons;

function BarraInspector({ hidden, onToggle, entity, updateEntity }) {
  const [attributes, setAttributes] = useState([
    {
      id: nanoid(),
      name: "",
      type: "int",
      pk: false,
      nn: false,
      uq: false,
      ai: false,
    },
  ]);

  const updateAttribute = (id, field, value) => {
    setAttributes((prev) =>
      prev.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr))
    );
  };

  const addAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      {
        id: nanoid(),
        name: "",
        type: "int",
        pk: false,
        nn: false,
        uq: false,
        ai: false,
      },
    ]);
  };

  const removeAttribute = (id) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  return (
    <div className={`properties ${hidden ? "hidden" : ""}`}>
      <HidePanelButton
        onClick={onToggle}
        icon={hidden ? LuPanelLeftClose : LuPanelLeftOpen}
        title={hidden ? "Mostrar panel" : "Esconder panel"}
      />
      {!hidden && (
        <>
          <h1>Propiedades</h1>
          <div className="properties__container">
            <div className="properties__item_input">
              <label for="">Nombre de la entidad</label>
              <input type="text" />
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
        </>
      )}
    </div>
  );
}

export default BarraInspector;
