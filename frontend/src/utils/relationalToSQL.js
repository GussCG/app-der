export function relationalTOSQL(nodes, edges) {
  let sql = "-- SQL GENERADO POR APP-DER\n";
  sql += `-- Fecha: ${new Date().toLocaleString()}\n\n`;

  const mapType = (col) => {
    if (!col?.type) return "INT";
    const t = col.type.toLowerCase();
    switch (t) {
      case "char":
        return `CHAR(${col.length ?? 1})`;
      case "varchar":
        return `VARCHAR(${col.length ?? 255})`;
      case "tinytext":
      case "text":
      case "mediumtext":
      case "longtext":
        return t.toUpperCase();

      case "binary":
        return `BINARY(${col.length ?? 1})`;
      case "varbinary":
        return `VARBINARY(${col.length ?? 255})`;

      case "enum":
        // espera col.values = ["a","b","c"]
        return `ENUM(${(col.values || [])
          .map((v) => `'${v.replace(/'/g, "''")}'`)
          .join(", ")})`;

      case "set":
        return `SET(${(col.values || [])
          .map((v) => `'${v.replace(/'/g, "''")}'`)
          .join(", ")})`;

      case "tinyint":
      case "smallint":
      case "mediumint":
      case "int":
      case "integer":
      case "bigint":
        return t.toUpperCase();

      case "bit":
        return `BIT(${col.length ?? 1})`;

      case "decimal":
      case "dec":
        return `DECIMAL(${col.precision ?? 10}, ${col.scale ?? 0})`;

      case "numeric":
        return `NUMERIC(${col.precision ?? 10}, ${col.scale ?? 0})`;

      case "float":
        return "FLOAT";
      case "double":
        return "DOUBLE";

      case "date":
        return "DATE";
      case "time":
        return "TIME";
      case "datetime":
        return "DATETIME";
      case "timestamp":
        return "TIMESTAMP";
      case "year":
        return "YEAR";

      case "boolean":
      case "bool":
        return "BOOLEAN";

      default:
        return t.toUpperCase();
    }
  };

  // Crear tablas
  sql += "-- TABLES\n\n";
  nodes.forEach((node) => {
    const tableName = `\`${node.data.name.replace(/\s+/g, "_")}\``;
    const columns = node.data.columns || [];
    const pks = columns.filter((c) => c.isPk);

    sql += `CREATE TABLE ${tableName} (\n`;

    const defs = columns.map((col) => {
      const colName = `\`${col.name.replace(/\s+/g, "_")}\``;
      let def = `  ${colName} ${mapType(col)}`;
      if (col.isNotNull) def += " NOT NULL";
      if (col.isUnique) def += " UNIQUE";
      if (col.isAutoIncrement) def += " AUTO_INCREMENT";
      return def;
    });

    sql += defs.join(",\n");

    if (pks.length > 0) {
      sql += `,\n  PRIMARY KEY (${pks.map((c) => `\`${c.name.replace(/\s+/g, "_")}\``).join(", ")})`;
    }

    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
  });

  // Crear claves foráneas
  sql += "-- FOREIGN KEYS\n\n";
  edges.forEach((edge) => {
    const parent = nodes.find((n) => n.id === edge.source);
    const child = nodes.find((n) => n.id === edge.target);
    if (!parent || !child) return;

    const parentPKs = parent.data.columns.filter((c) => c.isPk);

    // FILTRADO CRÍTICO: Solo las FKs que pertenecen a esta relación específica
    // Buscamos columnas cuyo ID contenga el ID del edge o el ID de la relación original
    const relId = edge.id.replace("rel-edge-", "").replace("mv-edge-", "");
    const fkCols = child.data.columns.filter(
      (c) => c.isFk && (c.id.includes(relId) || c.id.includes(edge.source)),
    );

    if (parentPKs.length === 0 || fkCols.length === 0) return;

    const parentTable = `\`${parent.data.name.replace(/\s+/g, "_")}\``;
    const childTable = `\`${child.data.name.replace(/\s+/g, "_")}\``;

    sql += `ALTER TABLE ${childTable}\n`;
    sql += `  ADD CONSTRAINT \`fk_${child.data.name}_${parent.data.name}_${Math.floor(Math.random() * 1000)}\`\n`;
    sql += `  FOREIGN KEY (${fkCols.map((c) => `\`${c.name}\``).join(", ")})\n`;
    sql += `  REFERENCES ${parentTable} (${parentPKs.map((c) => `\`${c.name}\``).join(", ")})`;

    // Aquí es donde actúan onDelete y onUpdate del edge.data
    const { onDelete, onUpdate } = edge.data || {};
    if (onDelete) sql += ` ON DELETE ${onDelete}`;
    if (onUpdate) sql += ` ON UPDATE ${onUpdate}`;

    sql += ";\n\n";
  });

  return sql;
}

export function downloadSQL(sqlContent, fileName = "database.sql") {
  const blob = new Blob([sqlContent], { type: "text/sql;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
