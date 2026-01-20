export function normalizeSqlType(attr, newType) {
  const base = { type: newType };

  switch (newType) {
    case "varchar":
    case "char":
      return {
        ...base,
        length: attr.length ?? 255,
        precision: undefined,
        scale: undefined,
      };

    case "decimal":
    case "numeric":
      return {
        ...base,
        precision: attr.precision ?? 10,
        scale: attr.scale ?? 2,
        length: undefined,
      };

    case "float":
    case "double":
      return {
        ...base,
        precision: undefined,
        scale: undefined,
        length: undefined,
      };

    default:
      // int, date, boolean, etc
      return {
        ...base,
        length: undefined,
        precision: undefined,
        scale: undefined,
      };
  }
}
