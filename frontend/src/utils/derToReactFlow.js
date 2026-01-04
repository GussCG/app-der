export function derToReactFlow(diagram) {
  const nodes = [
    ...diagram.entities.map((entity) => ({
      id: entity.id,
      type: "entity",
      position: entity.position ?? { x: 0, y: 0 },
      data: entity.data,
    })),
  ];

  const edges = diagram.relations
    .filter(
      (rel) =>
        rel.data?.connections?.source?.entityId &&
        rel.data?.connections?.target?.entityId
    )
    .map((rel) => {
      const { source, target } = rel.data.connections;

      return {
        id: rel.id,
        source: source.entityId,
        target: target.entityId,
        label: `${source.cardinality} : ${target.cardinality}`,
        type: "default",
      };
    });

  return { nodes, edges };
}
