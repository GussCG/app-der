import { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import Icons from "../Others/IconProvider";

const { IoClose } = Icons;

function RelationCreationModal({ onClose }) {
  const { diagram, applyChange, setSelectedElementIds } = useEditor();

  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  const handleCreate = () => {
    if (!source || !target) return;

    const newRelation = {
      id: crypto.randomUUID(),
      kind: "relation",
      type: "relation",
      position: { x: 100, y: 100 }, // O una posición calculada
      data: {
        name: "Nueva Relación",
        type: "simple",
        connections: {
          source: {
            entityId: source,
            cardinality: "1",
            participation: "partial",
          },
          target: {
            entityId: target,
            cardinality: "N",
            participation: "partial",
          },
        },
        attributes: [],
      },
    };

    applyChange({
      ...diagram,
      relations: [...diagram.relations, newRelation],
    });

    setSelectedElementIds([newRelation.id]);
    onClose();
  };
  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal relation-creation"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Crear Nueva Relación</h2>
        <button className="modal__close-button" onClick={onClose}>
          <IoClose />
        </button>
        <div className="relation-selectors">
          <div className="relation-selector source">
            <label>Entidad Origen</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Selecciona...</option>
              {diagram.entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.data.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relation-selector target">
            <label>Entidad Destino</label>
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="">Selecciona...</option>
              {diagram.entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.data.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="modal__info-note">
          Si quieres modificar la relación después de crearla, selecciona la
          relación y edita sus propiedades.
        </p>
        <div className="modal__actions">
          <button
            className={`modal__button ${!source || !target ? "disabled" : ""}`}
            onClick={handleCreate}
            disabled={!source || !target}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}

export default RelationCreationModal;
