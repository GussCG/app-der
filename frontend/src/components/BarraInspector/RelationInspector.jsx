import { useEditor } from "../../context/EditorContext";

function RelationInspector() {
  const { selectedElement, updateElement } = useEditor();

  if (!selectedElement) return null;

  const { name, connections } = selectedElement.data;

  const updateConnection = (side, field, value) => {
    updateElement({
      ...selectedElement,
      data: {
        ...selectedElement.data,
        connections: {
          ...connections,
          [side]: {
            ...connections[side],
            [field]: value,
          },
        },
      },
    });
  };

  return (
    <div className="properties__container">
      <div className="properties__item_input">
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

      <div className="properties__cardinality">
        <h2>Cardinalidad</h2>

        {["source", "target"].map((side) => (
          <div key={side} className="relation__row">
            <span>{connections[side].entityName}</span>

            <select
              value={connections[side].cardinality}
              onChange={(e) =>
                updateConnection(side, "cardinality", e.target.value)
              }
            >
              <option value="1">1</option>
              <option value="N">N</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelationInspector;
