export const ERROR_TYPES = {
  ENTITY_NO_ATTRIBUTES: "ËNTITY_NO_ATTRIBUTES", // REGLA 1
  STRONG_ENTITY_NO_KEY: "STRONG_ENTITY_NO_KEY", // REGLA 2
  ISOLATED_ENTITY: "ISOLATED_ENTITY", // REGLA 4

  INVALID_IDENTIFYING_RELATION: "INVALID_IDENTIFYING_RELATION", // REGLA 6a
  INVALID_WEAK_CONNECTION: "INVALID_WEAK_CONNECTION", // REGLA 6b

  ENTITY_DIRECT_CONNECTION: "ENTITY_DIRECT_CONNECTION", // REGLA 7
  RELATION_TO_RELATION: "RELATION_TO_RELATION", // REGLA 8

  WEAK_ENTITY_HAS_PRIMARY_KEY: "WEAK_ENTITY_HAS_PRIMARY_KEY", // REGLA 10
  WEAK_ENTITY_NO_IDENTIFYING_RELATION: "WEAK_ENTITY_NO_IDENTIFYING_RELATION", // REGLA 11
  WEAK_ENTITY_NO_PARTIAL_KEY: "WEAK_ENTITY_NO_PARTIAL_KEY", // REGLA 12

  RELATION_HAS_KEY: "RELATION_HAS_KEY", // REGLA 13
  RELATION_HAS_PARTIAL_KEY: "RELATION_HAS_PARTIAL_KEY", // REGLA 14

  STRONG_ENTITY_HAS_PARTIAL_KEY: "STRONG_ENTITY_HAS_PARTIAL_KEY", // REGLA 15

  WEAK_ENTITY_HAS_PARTIAL_PARTICIPATION:
    "WEAK_ENTITY_HAS_PARTIAL_PARTICIPATION", // REGLA 16

  DUPLICATE_NAME: "DUPLICATE_NAME", // REGLA 18
  DUPLICATE_ATTRIBUTE_NAME: "DUPLICATE_ATTRIBUTE_NAME", // REGLA 19
};

export const ERROR_CATALOG = {
  [ERROR_TYPES.ENTITY_NO_ATTRIBUTES]: {
    severity: "error",
    title: "Entidad sin atributos",
    message: (n) => `La entidad "${n}" no tiene atributos asociados.`,
    suggestion: "Agrega al menos un atributo a la entidad.",
  },
  [ERROR_TYPES.STRONG_ENTITY_NO_KEY]: {
    severity: "error",
    title: "Entidad fuerte sin clave primaria",
    message: (n) =>
      `La entidad fuerte "${n}" no tiene una clave primaria definida.`,
    suggestion: "Marca uno o más atributos como clave primaria.",
  },
  [ERROR_TYPES.ISOLATED_ENTITY]: {
    severity: "warning",
    title: "Entidad aislada",
    message: (n) => `La entidad "${n}" no está conectada a ninguna relación.`,
    suggestion: "Conecta la entidad a al menos una relación.",
  },
  [ERROR_TYPES.INVALID_IDENTIFYING_RELATION]: {
    severity: "error",
    title: "Relación identificadora inválida",
    message: (n) =>
      `La relación identificadora "${n}" no cumple con las reglas de identificación.`,
    suggestion:
      "Asegúrate de que la relación conecte una entidad débil con su entidad propietaria.",
  },
  [ERROR_TYPES.INVALID_WEAK_CONNECTION]: {
    severity: "error",
    title: "Relación entre débiles inválida",
    message: (n) =>
      `La relación "${n}" conecta dos entidades débiles mediante una relación simple.`,
    suggestion:
      "Las entidades débiles solo pueden conectarse mediante relaciones identificadoras a fuertes o relaciones específicas según la regla 6b.",
  },
  [ERROR_TYPES.ENTITY_DIRECT_CONNECTION]: {
    severity: "error",
    title: "Conexión directa de entidad",
    message: (n) =>
      `La entidad "${n}" está conectada directamente a otra entidad sin una relación intermedia.`,
    suggestion: "Conecta las entidades a través de una relación.",
  },
  [ERROR_TYPES.RELATION_TO_RELATION]: {
    severity: "error",
    title: "Relación a relación inválida",
    message: (n) =>
      `La relación "${n}" está conectada directamente a otra relación.`,
    suggestion: "Conecta las relaciones solo a entidades.",
  },
  [ERROR_TYPES.WEAK_ENTITY_HAS_PRIMARY_KEY]: {
    severity: "error",
    title: "Entidad débil con clave primaria",
    message: (n) => `La entidad débil "${n}" no debe tener una clave primaria.`,
    suggestion: "Elimina la clave primaria de la entidad débil.",
  },
  [ERROR_TYPES.WEAK_ENTITY_NO_IDENTIFYING_RELATION]: {
    severity: "error",
    title: "Entidad débil sin propietario",
    message: (n) =>
      `La entidad débil "${n}" debe tener al menos una relación identificadora con una entidad fuerte.`,
    suggestion:
      "Crea una relación de tipo 'identificadora' hacia una entidad fuerte.",
  },
  [ERROR_TYPES.WEAK_ENTITY_NO_PARTIAL_KEY]: {
    severity: "error",
    title: "Entidad débil sin clave parcial",
    message: (n) =>
      `La entidad débil "${n}" no tiene una clave parcial definida.`,
    suggestion: "Marca uno o más atributos como clave parcial.",
  },
  [ERROR_TYPES.RELATION_HAS_KEY]: {
    severity: "error",
    title: "Relación con clave primaria",
    message: (n) => `La relación "${n}" no debe tener una clave primaria.`,
    suggestion: "Elimina la clave primaria de la relación.",
  },
  [ERROR_TYPES.RELATION_HAS_PARTIAL_KEY]: {
    severity: "error",
    title: "Relación con clave parcial",
    message: (n) => `La relación "${n}" no debe tener una clave parcial.`,
    suggestion: "Elimina la clave parcial de la relación.",
  },
  [ERROR_TYPES.STRONG_ENTITY_HAS_PARTIAL_KEY]: {
    severity: "error",
    title: "Entidad fuerte con clave parcial",
    message: (n) => `La entidad fuerte "${n}" no debe tener una clave parcial.`,
    suggestion: "Elimina la clave parcial de la entidad fuerte.",
  },
  [ERROR_TYPES.WEAK_ENTITY_HAS_PARTIAL_PARTICIPATION]: {
    severity: "warning",
    title: "Participación parcial en entidad débil",
    message: (n) =>
      `La entidad débil "${n}" debe tener participación total en su relación identificadora.`,
    suggestion: "Cambia la participación de la entidad débil a 'total'.",
  },
  [ERROR_TYPES.DUPLICATE_NAME]: {
    severity: "error",
    title: "Nombre duplicado",
    message: (n) =>
      `El nombre "${n}" ya está siendo utilizado por otro elemento.`,
    suggestion: "Utiliza un nombre único para cada elemento.",
  },
  [ERROR_TYPES.DUPLICATE_ATTRIBUTE_NAME]: {
    severity: "error",
    title: "Nombre de atributo duplicado",
    message: (n) =>
      `El nombre de atributo "${n}" ya está siendo utilizado en la misma entidad o relación.`,
    suggestion:
      "Utiliza un nombre único para cada atributo dentro de la misma entidad o relación.",
  },
};
