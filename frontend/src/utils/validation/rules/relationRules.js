import { ERROR_TYPES } from "../errorCatalog";

export function validateRelations(relations, entities) {
  const errors = [];

  relations.forEach((r) => {
    const conns = Object.values(r.data.connections || {});

    const connectedEntities = conns
      .map((c) => entities.find((e) => e.id === c.entityId))
      .filter(Boolean);

    // Regla 8: Relación no puede estar enlazada a otra relación
    if (conns.some((c) => c.relationId)) {
      errors.push(error(ERROR_TYPES.RELATION_TO_RELATION, r));
    }

    // Regla 6: Relaciones identificadores solo pueden existir entre entidad débil y fuerte
    if (r.data.type === "identifying") {
      const strong = connectedEntities.filter((e) => !e.data.weak);
      const weak = connectedEntities.filter((e) => e.data.weak);

      if (strong.length !== 1 || weak.length !== 1) {
        errors.push(error(ERROR_TYPES.INVALID_IDENTIFYING_RELATION, r));
      }
    }

    // Regla 6b: No puede haber una relación simple entre dos entidades débiles
    if (r.data.type === "simple") {
      const weakCount = connectedEntities.filter((e) => e.data.weak).length;
      if (weakCount >= 2) {
        errors.push(error(ERROR_TYPES.INVALID_WEAK_CONNECTION, r));
      }
    }

    // Regla 13 y 14: Las Relaciones no pueden tener un atributo clave o clave parcial
    const attributes = r.data.attributes || [];
    attributes.forEach((a) => {
      if (a.pk) errors.push(error(ERROR_TYPES.RELATION_HAS_KEY, r));
      if (a.partial)
        errors.push(error(ERROR_TYPES.RELATION_HAS_PARTIAL_KEY, r));
    });

    // Regla 16: La participación de una entidad débil en su relación identificadora debe ser total
    if (r.data.type === "identifying") {
      const weakConn = Object.entries(r.data.connections || {}).find(
        ([side, data]) => {
          const ent = entities.find((e) => e.id === data.entityId);
          return ent && ent.data.weak;
        },
      );

      if (weakConn && weakConn[1].participation !== "total") {
        errors.push({
          type: ERROR_TYPES.WEAK_ENTITY_HAS_PARTIAL_PARTICIPATION,
          elementId: r.id,
          elementKind: "relation",
          meta: { name: r.data.name },
        });
      }
    }

    // Regla 23: Una relación no puede tener más de 6 atributos
    if (attributes.length > 6) {
      errors.push({
        type: ERROR_TYPES.MAX_ATTRIBUTES_RELATION_EXCEEDED,
        elementId: r.id,
        elementKind: "relation",
        meta: { name: r.data.name },
      });
    }

    // Regla 24 y 25: Atributo compuesto con menos de 2 o más de 5 atributos hijos
    attributes.forEach((attr) => {
      if (attr.kind === "composite") {
        const childCount = attr.children.length || 0;

        if (childCount < 2) {
          errors.push({
            type: ERROR_TYPES.COMPOSITE_ATTRIBUTE_MIN_CHILDREN,
            elementId: r.id,
            elementKind: "relation",
            meta: {
              name: attr.name || "Atributo sin nombre",
            },
          });
        }

        if (childCount > 5) {
          errors.push({
            type: ERROR_TYPES.COMPOSITE_ATTRIBUTE_MAX_CHILDREN,
            elementId: r.id,
            elementKind: "relation",
            meta: {
              name: attr.name || "Atributo sin nombre",
            },
          });
        }
      }
    });
  });

  return errors;
}

function error(type, relation) {
  return {
    type,
    elementId: relation.id,
    elementKind: "relation",
    meta: {
      name: relation.data.name,
    },
  };
}
