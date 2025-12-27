function RelationInspector({ relation, updateRelation }) {
  const { name, connections } = relation.data;

  const updateConnection = (side, field, value) => {
    updateRelation({
      ...relation,
      data: {
        ...relation.data,
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
            updateRelation({
              ...relation,
              data: { ...relation.data, name: e.target.value },
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
