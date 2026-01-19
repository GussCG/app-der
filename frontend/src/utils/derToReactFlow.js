import {
  chooseEntityHandle,
  chooseRelationHandle,
} from "./er/chooseBestHandle";

export function derToReactFlow(diagram) {
  const nodes = [
    ...diagram.entities.map((entity) => ({
      id: entity.id,
      type: "entity",
      position: entity.position ?? { x: 0, y: 0 },
      data: entity.data,
    })),
    ...diagram.relations.map((relation) => ({
      id: relation.id,
      type: "relation",
      position: relation.position ?? { x: 0, y: 0 },
      data: relation.data,
    })),
  ];

  const edges = diagram.relations.flatMap((relation) => {
    const { source, target } = relation.data.connections || {};

    const sourceCenter = getCenter(
      diagram.entities.find((e) => e.id === source?.entityId),
      "entity",
    );
    const relationCenter = getCenter(relation, "relation");
    const targetCenter = getCenter(
      diagram.entities.find((e) => e.id === target?.entityId),
      "entity",
    );

    const sourceEntity = diagram.entities.find(
      (e) => e.id === source?.entityId,
    );
    const targetEntity = diagram.entities.find(
      (e) => e.id === target?.entityId,
    );
    const result = [];

    console.log(source);

    if (source?.entityId) {
      result.push({
        id: `e-${relation.id}-source`,
        source: source.entityId,
        target: relation.id,
        sourceHandle: chooseEntityHandle(sourceCenter, relationCenter),
        targetHandle: chooseRelationHandle(relationCenter, sourceCenter),
        type: "er",
        data: {
          cardinality: source.cardinality,
          side: "source",
          participation: source.participation || "partial",
          color: sourceEntity?.data?.color || "#888",
          onDelete: source.onDelete || "RESTRICT",
          onUpdate: source.onUpdate || "RESTRICT",
        },
      });
    }

    if (target?.entityId) {
      result.push({
        id: `e-${relation.id}-target`,
        source: relation.id,
        target: target.entityId,
        sourceHandle: chooseRelationHandle(relationCenter, targetCenter),
        targetHandle: chooseEntityHandle(targetCenter, relationCenter),
        type: "er",
        data: {
          cardinality: target.cardinality,
          side: "target",
          participation: target.participation,
          color: targetEntity?.data?.color || "#888",
          onDelete: target.onDelete || "RESTRICT",
          onUpdate: target.onUpdate || "RESTRICT",
        },
      });
    }

    console.log("Edges for relation", relation.id, ":", result);
    return result;
  });

  return { nodes, edges };
}

const getCenter = (node, type) => {
  if (!node) return { x: 0, y: 0 };

  // Aquí debes emular el cálculo de centerX/centerY que haces en los componentes
  // O más simple: sumar un valor estimado si no quieres replicar toda la lógica de layout
  const offset = type === "entity" ? { x: 60, y: 25 } : { x: 45, y: 35 };

  return {
    x: node.position.x + offset.x,
    y: node.position.y + offset.y,
  };
};
