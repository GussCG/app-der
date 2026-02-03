import { v4 as uuidv4 } from "uuid";

const normalize = (v) => v.replace(/[`"\s]/g, "").toLowerCase();

const parseType = (fullType) => {
  const typeUpper = fullType.toUpperCase().trim();
  let type = "int",
    length = null,
    precision = null,
    scale = null,
    values = [];

  const match = typeUpper.match(/([A-Z]+)\s*\(([^)]+)\)/);
  if (match) {
    type = match[1].toLowerCase();
    const params = match[2];
    if (["ENUM", "SET"].includes(match[1])) {
      values = params.split(",").map((v) => v.replace(/'/g, "").trim());
    } else if (params.includes(",")) {
      const [p, s] = params.split(",");
      precision = parseInt(p, 10);
      scale = parseInt(s, 10);
    } else {
      length = parseInt(params, 10);
    }
  } else {
    type = typeUpper.toLowerCase();
  }
  return { type, length, precision, scale, values };
};

export function sqlToRelational(sql) {
  const nodes = [];
  const edges = [];
  const tableNameToIdMap = {};

  const cleanSQL = sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  const tableRegex =
    /CREATE\s+TABLE\s+[`"]?(\w+)[`"]?\s*\(([\s\S]*?)\)(?:\s*ENGINE.*)?;?/gi;

  let match;
  let x = 0,
    y = 0;

  while ((match = tableRegex.exec(cleanSQL)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const nodeId = `table-${uuidv4()}`;
    tableNameToIdMap[normalize(tableName)] = nodeId;

    const lines = body
      .split(/,(?![^(]*\))/)
      .map((l) => l.trim())
      .filter(Boolean);
    const columns = [];
    const tablePKs = new Set();

    lines.forEach((line) => {
      const upper = line.toUpperCase();
      if (upper.startsWith("PRIMARY KEY")) {
        const pkMatch = line.match(/\((.*?)\)/);
        if (pkMatch) {
          pkMatch[1].split(",").forEach((col) => tablePKs.add(normalize(col)));
        }
        return;
      }

      const colMatch = line.match(
        /[`"]?(\w+)[`"]?\s+([A-Z0-9]+(?:\s*\(.*?\))?)(.*)/i,
      );
      if (colMatch) {
        const colName = colMatch[1];
        const constraints = colMatch[3].toUpperCase();
        const isInlinePk = constraints.includes("PRIMARY KEY");
        if (isInlinePk) tablePKs.add(normalize(colName));

        columns.push({
          id: uuidv4(),
          name: colName,
          ...parseType(colMatch[2]),
          // Props Relacionales
          isPk: false,
          isFk: false,
          isNotNull: constraints.includes("NOT NULL") || isInlinePk,
          isUnique: constraints.includes("UNIQUE") || isInlinePk,
          isAutoIncrement: constraints.includes("AUTO_INCREMENT"),
          // Props de Compatibilidad ER (¡IMPORTANTE!)
          pk: false,
          kind: "simple",
          partial: false,
          children: [],
        });
      }
    });

    columns.forEach((col) => {
      if (tablePKs.has(normalize(col.name))) {
        col.isPk = true;
        col.pk = true; // Sincronizado para ER
        col.isNotNull = true;
      }
    });

    nodes.push({
      id: nodeId,
      type: "relationalTable",
      position: { x, y },
      data: {
        name: tableName,
        columns,
        color: "#323c4c",
      },
    });

    x += 350;
    if (x > 1000) {
      x = 0;
      y += 400;
    }
  }

  // FKs para las líneas de conexión
  const alterFkRegex =
    /ALTER\s+TABLE\s+[`"]?(\w+)[`"]?\s+ADD\s+(?:CONSTRAINT\s+.*?)\s*FOREIGN\s+KEY\s*\((.*?)\)\s*REFERENCES\s+[`"]?(\w+)[`"]?\s*\((.*?)\)/gi;
  let alterMatch;
  while ((alterMatch = alterFkRegex.exec(cleanSQL)) !== null) {
    const [_, childT, childC, parentT] = alterMatch;
    const sourceId = tableNameToIdMap[normalize(parentT)];
    const targetId = tableNameToIdMap[normalize(childT)];

    if (sourceId && targetId) {
      const childNode = nodes.find((n) => n.id === targetId);
      const cleanColName = normalize(childC.replace(/[`"]/g, ""));
      const col = childNode?.data.columns.find(
        (c) => normalize(c.name) === cleanColName,
      );
      if (col) col.isFk = true;

      edges.push({
        id: `rel-edge-${uuidv4()}`,
        source: sourceId,
        target: targetId,
      });
    }
  }

  return { nodes, edges };
}
