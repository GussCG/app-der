import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

export async function autoLayoutERDiagram(diagram) {
  const nodes = [
    ...diagram.entities.map((e) => ({
      id: e.id,
      width: 180,
      height: 80,
    })),
    ...diagram.relations.map((r) => ({
      id: r.id,
      width: 120,
      height: 80,
    })),
  ];

  const edges = diagram.relations.flatMap((r) => {
    const { source, target } = r.data.connections || {};
    if (!source?.entityId || !target?.entityId) return [];
    return [
      {
        id: `${source.entityId}-${r.id}`,
        sources: [source.entityId],
        targets: [r.id],
      },
      {
        id: `${r.id}-${target.entityId}`,
        sources: [r.id],
        targets: [target.entityId],
      },
    ];
  });

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.spacing.nodeNode": "80",
      "elk.layered.spacing.nodeNodeBetweenLayers": "120",
    },
    children: nodes,
    edges,
  };

  const layouted = await elk.layout(graph);

  const pos = Object.fromEntries(
    layouted.children.map((n) => [n.id, { x: n.x, y: n.y }]),
  );

  return {
    ...diagram,
    entities: diagram.entities.map((e) => ({
      ...e,
      position: pos[e.id] ?? e.position,
    })),
    relations: diagram.relations.map((r) => ({
      ...r,
      position: pos[r.id] ?? r.position,
    })),
  };
}
