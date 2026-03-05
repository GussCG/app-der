import { normalizeAttributes } from "./relational/normalizeAttributes";
import { getSmartHandles } from "./relational/relSmartHandles";

export function derToRelational(
  diagram,
  relationalPositions = {},
  overrides = {},
) {
  let nodes = [];
  let edges = [];

  const applyOverrides = (tableId, columns) => {
    const tableOverrides = overrides[tableId] || {};
    return columns.map((col) => {
      const colOverride = tableOverrides[col.name] || {};
      if (colOverride) {
        return { ...col, ...colOverride };
      }
      return col;
    });
  };

  const findNode = (id) => nodes.find((n) => n.id === id);

  const getPrimaryKey = (table) =>
    table?.data?.columns?.find((c) => c.isPk) || null;

  const updateNodeColumns = (nodeId, newColumns) => {
    nodes = nodes.map((n) => {
      if (n.id === nodeId) {
        const finalCols = applyOverrides(n.data.name, newColumns);
        return { ...n, data: { ...n.data, columns: finalCols } };
      }
      return n;
    });
  };

  // Entidades a tablas
  diagram.entities.forEach((entity) => {
    const savedPos = relationalPositions[entity.id];
    const previousColumns = entity.data.columns || [];

    const { columns: normalizedAttrs, multivalued } = normalizeAttributes(
      entity.data.attributes || [],
    );

    let columns = normalizedAttrs.map((attr) => {
      const prev = previousColumns.find((c) => c.id === attr.id);
      const isPk = attr.pk || (entity.data.weak && attr.partial);

      return {
        id: attr.id,
        name: attr.name,
        isPk,
        isFk: false,

        type: prev?.type || attr.type || "int",
        length: prev?.length ?? attr.length,
        precision: prev?.precision ?? attr.precision,
        scale: prev?.scale ?? attr.scale,
        values: prev?.values || attr.values,

        isNotNull: isPk ? true : (prev?.isNotNull ?? attr.nn ?? false),
        isUnique: isPk ? true : (prev?.isUnique ?? attr.uq ?? false),
        isAutoIncrement: prev?.isAutoIncrement ?? attr.ai ?? false,

        isDerived: false,
      };
    });

    columns = applyOverrides(entity.data.name, columns);

    nodes.push({
      id: entity.id,
      type: "relationalTable",
      position: savedPos || entity.position || { x: 0, y: 0 },
      data: {
        name: entity.data.name,
        color: entity.data.color || "#5b5b5b",
        weak: entity.data.weak || false,
        columns,
      },
    });

    // Tablas para multivaluados
    multivalued.forEach((mvAttr) => {
      const ownerPks = columns.filter((c) => c.isPk);
      if (ownerPks.length === 0) return;

      const tableId = `mv-${entity.id}-${mvAttr.id}`;
      const tableName = `${entity.data.name}_${mvAttr.name}`;
      const savedPos = relationalPositions[tableId];

      let mvColumns = [
        {
          id: `fk-${entity.id}`,
          name: `${entity.data.name.toLowerCase()}_${ownerPks[0].name}`,
          isPk: true,
          isFk: true,
          type: ownerPks[0].type,
          isDerived: true,
        },
        {
          id: mvAttr.id,
          name: mvAttr.name,
          isPk: true,
          isFk: false,
          type: mvAttr.valueType || "varchar",
          isDerived: false,
        },
      ];

      mvColumns = applyOverrides(tableName, mvColumns);

      nodes.push({
        id: tableId,
        type: "relationalTable",
        position: savedPos || {
          x: (savedPos?.x || entity.position.x) + 350,
          y: (savedPos?.y || entity.position.y) + 100,
        },
        data: {
          name: tableName,
          isDerived: true,
          color: entity.data.color || "#5b5b5b",
          columns: mvColumns,
        },
      });

      edges.push({
        id: `mv-edge-${mvAttr.id}`,
        source: entity.id,
        target: tableId,
        type: "relationalEdge",
        data: {
          kind: "multivalued",
          sourceColor: entity.data.color,
          targetColor: entity.data.color,
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      });
    });
  });

  // Procesar relaciones
  diagram.relations.forEach((rel) => {
    const { source, target } = rel.data.connections;
    if (!source?.entityId || !target?.entityId) return;

    const sourceTable = findNode(source.entityId);
    const targetTable = findNode(target.entityId);
    if (!sourceTable || !targetTable) return;

    const pkSource = getPrimaryKey(sourceTable);
    const pkTarget = getPrimaryKey(targetTable);
    if (!pkSource || !pkTarget) return;

    const relAttributes = (rel.data.attributes || []).map((attr) => ({
      id: attr.id,
      name: attr.name,
      isPk: false,
      isFk: false,

      type: attr.type || "int",
      length: attr.length,
      precision: attr.precision,
      scale: attr.scale,
      values: attr.values,

      isUnique: attr.uq || false,
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

      const deleteRule = sideInfo.onDelete || "RESTRICT";
      const updateRule = sideInfo.onUpdate || "RESTRICT";

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
          onDelete: deleteRule,
          onUpdate: updateRule,
          isDerived: true,
        },
        ...relAttributes,
      ]);

      edges.push({
        id: `rel-edge-${rel.id}`,
        source: donor.id,
        target: receiver.id,
        type: "relationalEdge",
        label: rel.data.name || "",
        data: {
          kind: "1:1",
          sourceColor: donor.data.color,
          targetColor: receiver.data.color,
          onDelete: deleteRule,
          onUpdate: updateRule,
        },
      });
    }

    // --- CASO 1:N o N:1 ---
    else if (
      (source.cardinality === "1" && target.cardinality === "N") ||
      (source.cardinality === "N" && target.cardinality === "1")
    ) {
      const oneSide = source.cardinality === "1" ? source : target;
      const manySide = source.cardinality === "N" ? source : target;

      const tableOne =
        oneSide.entityId === sourceTable.id ? sourceTable : targetTable;
      const tableMany =
        manySide.entityId === sourceTable.id ? sourceTable : targetTable;

      const pkOne = tableOne === sourceTable ? pkSource : pkTarget;

      const isWeak = tableMany.data.weak || rel.data.type === "identifying";

      const deleteRule = isWeak ? "CASCADE" : manySide.onDelete || "RESTRICT";
      const updateRule = manySide.onUpdate || "RESTRICT";

      updateNodeColumns(tableMany.id, [
        ...tableMany.data.columns,
        {
          id: `fk-${rel.id}`,
          name: `${tableOne.data.name.toLowerCase()}_${pkOne.name}`,
          isPk: isWeak, // Si es débil, la FK es parte de la PK
          isFk: true,
          type: pkOne.type,
          isNotNull: manySide.participation === "total" || isWeak,
          onDelete: deleteRule,
          onUpdate: updateRule,
          isDerived: true,
        },
        ...relAttributes,
      ]);

      edges.push({
        id: `rel-edge-${rel.id}`,
        source: tableOne.id,
        target: tableMany.id,
        type: "relationalEdge",
        label: rel.data.name || "",
        data: {
          kind: isWeak ? "identifying" : "1:N",
          sourceColor: tableOne.data.color,
          targetColor: tableMany.data.color,
          onDelete: deleteRule,
          onUpdate: updateRule,
        },
      });
    }

    // --- CASO N:M (TABLA INTERMEDIA) ---
    else if (source.cardinality === "N" && target.cardinality === "N") {
      const interId = `inter-${rel.id}`;
      const savedPos = relationalPositions[interId];
      const tableName =
        rel.data.name?.replace(/\s+/g, "_") ||
        `${sourceTable.data.name}_${targetTable.data.name}`;

      let interColumns = [
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
      ];

      interColumns = applyOverrides(tableName, interColumns);

      nodes.push({
        id: interId,
        type: "relationalTable",
        position: savedPos || {
          x: (sourceTable.position.x + targetTable.position.x) / 2 + 50,
          y: (sourceTable.position.y + targetTable.position.y) / 2 + 100,
        },
        data: {
          name: tableName,
          isDerived: true,
          color: rel.data.color || "#5b5b5b",
          columns: interColumns,
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
            targetColor: rel.data.color || "#5b5b5b",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        },
        {
          id: `rel-edge-${rel.id}-t`,
          source: target.entityId,
          target: interId,
          type: "relationalEdge",
          data: {
            sourceColor: targetTable.data.color,
            targetColor: rel.data.color || "#5b5b5b",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        },
      );
    }
  });

  (diagram.notes || []).forEach((note) => {
    nodes.push({
      id: note.id,
      type: "note",
      position: note.relationalPosition ||
        relationalPositions[note.id] || { x: 0, y: 0 },
      width: note.width || 180,
      height: note.height || 100,
      data: note.data,
    });
  });

  const nodesMap = new Map(nodes.map((n) => [n.id, n]));

  edges = edges.map((edge) => {
    const sourceNode = nodesMap.get(edge.source);
    const targetNode = nodesMap.get(edge.target);

    if (sourceNode && targetNode) {
      // Usamos la utilidad
      const { sourceHandle, targetHandle } = getSmartHandles(
        sourceNode,
        targetNode,
      );
      return { ...edge, sourceHandle, targetHandle };
    }
    return edge;
  });

  return { nodes, edges };
}
