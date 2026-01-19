export function derToRelational(diagram) {
  let nodes = [];
  let edges = [];

  const findNode = (id) => nodes.find((n) => n.id === id);
  const getPrimaryKey = (table) =>
    table.data.columns.find((c) => c.isPk) || null;

  const updateNodeColumns = (nodeId, newColumns) => {
    nodes = nodes.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, columns: newColumns } } : n,
    );
  };

  // Crear tablas base (Entidades)
  diagram.entities.forEach((entity) => {
    const existingColumns = entity.data.columns || [];
    nodes.push({
      id: entity.id,
      type: "relationalTable",
      position: entity.position || { x: 0, y: 0 },
      data: {
        ...entity.data,
        color: entity.data.color || "#5b5b5b",
        columns: (entity.data.attributes || []).map((attr) => {
          const existing = existingColumns.find((c) => c.id === attr.id);
          return {
            id: attr.id,
            name: attr.name || "columna",
            isPk: attr.pk || false,
            isFk: false,
            type: existing?.type || attr.type || "int",
            isNotNull: attr.nn || false,
            isUnique: attr.uq || false,
            isAi: attr.ai || false,
            isDerived: false, // Atributo base de la entidad
          };
        }),
      },
    });
  });

  // Procesar relaciones
  diagram.relations.forEach((rel) => {
    const { source, target } = rel.data.connections;
    if (!source?.entityId || !target?.entityId) return;

    const sourceTable = findNode(source.entityId);
    const targetTable = findNode(target.entityId);
    if (!sourceTable || !targetTable) return;

    // Buscamos PKs con encadenamiento opcional para evitar el crash de .name
    const pkSource = getPrimaryKey(sourceTable);
    const pkTarget = getPrimaryKey(targetTable);
    if (!pkSource || !pkTarget) return;

    const relAttributes = (rel.data.attributes || []).map((attr) => ({
      id: attr.id,
      name: attr.name,
      type: attr.type || "int",
      isPk: false,
      isFk: false,
      isNotNull: attr.nn || false,
      isDerived: true,
    }));

    // --- CASO 1:1 ---
    if (source.cardinality === "1" && target.cardinality === "1") {
      const isTargetTotal = target.participation === "total";
      const receiver = isTargetTotal ? targetTable : sourceTable;
      const donor = isTargetTotal ? sourceTable : targetTable;
      const donorPk = isTargetTotal ? pkSource : pkTarget;
      const sideInfo = isTargetTotal ? target : source;

      updateNodeColumns(receiver.id, [
        ...receiver.data.columns,
        {
          id: `fk-${rel.id}`,
          name: `${donor.data.name.toLowerCase()}_${donorPk.name}`,
          isPk: false,
          isFk: true,
          type: donorPk.type,
          isNotNull: sideInfo.participation === "total",
          isUnique: true, // Importante en 1:1 para que no se repita la relación
          onDelete: sideInfo.onDelete || "RESTRICT",
          onUpdate: sideInfo.onUpdate || "RESTRICT",
          isDerived: true,
        },
        ...relAttributes,
      ]);

      edges.push({
        id: `rel-edge-${rel.id}`,
        source: donor.id,
        target: receiver.id,
        type: "relationalEdge",
        data: {
          kind: "1:1",
          sourceColor: sourceTable.data.color,
          targetColor: targetTable.data.color,
        },
      });
    }

    // --- CASO 1:N o N:1 ---
    else if (
      (source.cardinality === "1" && target.cardinality === "N") ||
      (source.cardinality === "N" && target.cardinality === "1")
    ) {
      const isSourceOne = source.cardinality === "1";
      const tableOne = isSourceOne ? sourceTable : targetTable;
      const tableMany = isSourceOne ? targetTable : sourceTable;
      const sideMany = isSourceOne ? target : source;
      const pkOne = isSourceOne ? pkSource : pkTarget;

      updateNodeColumns(tableMany.id, [
        ...tableMany.data.columns,
        {
          id: `fk-${rel.id}`,
          name: `${tableOne.data.name.toLowerCase()}_${pkOne.name}`,
          isPk: tableMany.data.weak || false, // Si es débil, la FK es parte de la PK
          isFk: true,
          type: pkOne.type,
          isNotNull: sideMany.participation === "total" || tableMany.data.weak,
          onDelete: sideMany.onDelete || "RESTRICT",
          onUpdate: sideMany.onUpdate || "RESTRICT",
          isDerived: true,
        },
        ...relAttributes,
      ]);

      edges.push({
        id: `rel-edge-${rel.id}`,
        source: tableOne.id,
        target: tableMany.id,
        type: "relationalEdge",
        data: {
          kind: "1:N",
          sourceColor: sourceTable.data.color,
          targetColor: targetTable.data.color,
        },
      });
    }

    // --- CASO N:M (TABLA INTERMEDIA) ---
    else if (source.cardinality === "N" && target.cardinality === "N") {
      const interId = `inter-${rel.id}`;
      const posX = (sourceTable.position.x + targetTable.position.x) / 2;
      const posY = (sourceTable.position.y + targetTable.position.y) / 2 + 80;
      const relColor = rel.data.color || "#5b5b5b";

      nodes.push({
        id: interId,
        type: "relationalTable",
        position: { x: posX, y: posY },
        data: {
          name:
            rel.data.name?.replace(/\s+/g, "_") ||
            `${sourceTable.data.name}_${targetTable.data.name}`,
          isDerived: true,
          color: rel.data.color || "#5b5b5b",
          columns: [
            {
              id: `fk-s-${rel.id}`,
              name: `${sourceTable.data.name.toLowerCase()}_${pkSource.name}`,
              isPk: true,
              isFk: true,
              type: pkSource.type,
              isDerived: true,
            },
            {
              id: `fk-t-${rel.id}`,
              name: `${targetTable.data.name.toLowerCase()}_${pkTarget.name}`,
              isPk: true,
              isFk: true,
              type: pkTarget.type,
              isDerived: true,
            },
            ...relAttributes,
          ],
        },
      });

      edges.push(
        {
          id: `rel-edge-${rel.id}-s`,
          source: source.entityId,
          target: interId,
          type: "relationalEdge",
          data: {
            sourceColor: sourceTable.data.color,
            targetColor: relColor,
          },
        },
        {
          id: `rel-edge-${rel.id}-t`,
          source: target.entityId,
          target: interId,
          type: "relationalEdge",
          data: {
            sourceColor: targetTable.data.color,
            targetColor: relColor,
          },
        },
      );
    }
  });

  return { nodes, edges };
}
