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
    ...(diagram.notes || []).map((note) => ({
      id: note.id,
      type: "note",
      position: note.erPosition ?? { x: 0, y: 0 },
      width: note.width || 180,
      height: note.height || 100,
      data: {
        ...note.data,
        style: {
          ...note.data.style,
          fontFamily: note.data.style?.fontFamily || "Arial",
          fontSize: note.data.style?.fontSize || 14,
          fontWeight: note.data.style?.fontWeight || "normal",
          fontStyle: note.data.style?.fontStyle || "normal",
          textAlign: note.data.style?.textAlign || "left",
          color: note.data.style?.color || "#000000",
          backgroundColor: note.data.style?.backgroundColor || "#ffff88",
          borderTopLeftRadius:
            note.data.style?.borderTopLeftRadius ??
            note.data.style?.borderRadius ??
            8,
          borderTopRightRadius:
            note.data.style?.borderTopRightRadius ??
            note.data.style?.borderRadius ??
            8,
          borderBottomLeftRadius:
            note.data.style?.borderBottomLeftRadius ??
            note.data.style?.borderRadius ??
            8,
          borderBottomRightRadius:
            note.data.style?.borderBottomRightRadius ??
            note.data.style?.borderRadius ??
            8,
          borderColor: note.data.style?.borderColor || "#000000",
          borderWidth: note.data.style?.borderWidth ?? 1,
          borderStyle: note.data.style?.borderStyle || "solid",
          paddingTop: note.data.style?.paddingTop ?? 8,
          paddingRight: note.data.style?.paddingRight ?? 8,
          paddingBottom: note.data.style?.paddingBottom ?? 8,
          paddingLeft: note.data.style?.paddingLeft ?? 8,
        },
      },
    })),
  ];

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const edges = diagram.relations.flatMap((relation) => {
    const { source, target } = relation.data.connections || {};
    if (!source?.entityId || !target?.entityId) return [];

    const recursive = source.entityId === target.entityId;
    const result = [];

    const relationNode = nodeMap[relation.id];
    const entityNode = nodeMap[source.entityId];

    const rCenter = getCenter(relationNode, "relation");
    const sCenter = getCenter(entityNode, "entity");

    const recHandles = recursive ? getRecursiveHandles(sCenter, rCenter) : null;

    if (source?.entityId) {
      result.push({
        id: `e-${relation.id}-source`,
        source: source.entityId,
        target: relation.id,
        sourceHandle: recursive
          ? recHandles.source.entity
          : (source.handleId ?? chooseEntityHandle(sCenter, rCenter)),
        targetHandle: recursive
          ? recHandles.source.relation
          : source.handleId
            ? oppositeHandle(source.handleId)
            : chooseRelationHandle(rCenter, sCenter),
        type: "er",
        data: {
          side: "source",
          cardinality: source.cardinality,
          participation: source.participation || "partial",
          color: relation.data.color || "#888",
          isRecursive: recursive,
        },
      });
    }

    if (target?.entityId) {
      const entityNode = nodeMap[target.entityId];
      const entityCenter = getCenter(entityNode, "entity");

      result.push({
        id: `e-${relation.id}-target`,
        source: relation.id,
        target: target.entityId,
        sourceHandle: recursive
          ? recHandles.target.relation
          : target.handleId
            ? oppositeHandle(target.handleId)
            : chooseRelationHandle(rCenter, sCenter),
        targetHandle: recursive
          ? recHandles.target.entity
          : (target.handleId ?? chooseEntityHandle(sCenter, rCenter)),
        type: "er",
        data: {
          side: "target",
          cardinality: target.cardinality,
          participation: target.participation,
          color: relation.data.color || "#888",
          isRecursive: recursive,
        },
      });
    }
    return result;
  });

  return { nodes, edges };
}

export const getCenter = (node, type) => {
  if (!node) return { x: 0, y: 0 };

  const offset =
    type === "entity"
      ? { x: 60, y: 20 } // Centro de 120x40
      : { x: 50, y: 32.5 }; // Centro de 100x65

  return {
    x: node.position.x + offset.x,
    y: node.position.y + offset.y,
  };
};

export const isRecursiveRelation = (source, target) => {
  return (
    source?.entityId && target?.entityId && source.entityId === target.entityId
  );
};

export const getRecursiveHandles = (sourceCenter, relationCenter) => {
  const entityToRelHandle = chooseEntityHandle(sourceCenter, relationCenter);

  // Lados de la entidad para la "U"
  const pairs = {
    top: { h1: "left", h2: "right" },
    bottom: { h1: "left", h2: "right" },
    left: { h1: "top", h2: "bottom" },
    right: { h1: "top", h2: "bottom" },
  };

  const entitySides = pairs[entityToRelHandle] || pairs.top;
  const relSide = oppositeHandle(entityToRelHandle); // El rombo mira a la entidad

  return {
    source: { entity: entitySides.h1, relation: relSide },
    target: { entity: entitySides.h2, relation: relSide },
  };
};

// Necesitas esta pequeña función de apoyo
export const oppositeHandle = (handle) => {
  const opposites = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  return opposites[handle] || "top";
};
