import { ERROR_TYPES } from "../errorCatalog";

export function validateEntities(entities, relations) {
  const errors = [];

  entities.forEach((e) => {
    // Regla 1: Entidad sin atributos
    if (e.data.attributes.length === 0) {
      errors.push(error(ERROR_TYPES.ENTITY_NO_ATTRIBUTES, e));
    }

    // Regla 2: Entidad fuerte sin clave primaria
    if (!e.data.weak && !e.data.attributes.some((attr) => attr.pk)) {
      errors.push(error(ERROR_TYPES.STRONG_ENTITY_NO_KEY, e));
    }

    // Regla 4: Entidad aislada
    const participates = relations.some((r) =>
      Object.values(r.data.connections || {}).some((c) => c.entityId === e.id),
    );
    if (!participates) {
      errors.push(error(ERROR_TYPES.ISOLATED_ENTITY, e));
    }

    // Regla 10: Entidad débil con clave primaria
    if (e.data.weak && e.data.attributes.some((attr) => attr.pk)) {
      errors.push(error(ERROR_TYPES.WEAK_ENTITY_HAS_PRIMARY_KEY, e));
    }

    // Regla 11: Entidad debil no puede existir sin una entidad fuerte propietaria
    if (e.data.weak) {
      const hasOwner = relations.some((r) => {
        const isIdentifying = r.data.type === "identifying";
        const connectsToThisWeak = Object.values(r.data.connections || {}).some(
          (c) => c.entityId === e.id,
        );
        return isIdentifying && connectsToThisWeak;
      });

      if (!hasOwner) {
        errors.push({
          type: ERROR_TYPES.WEAK_ENTITY_NO_IDENTIFYING_RELATION,
          elementId: e.id,
          elementKind: "entity",
          meta: { name: e.data.name },
        });
      }
    }

    // Regla 12: Entidad débil sin clave parcial
    if (e.data.weak && !e.data.attributes.some((attr) => attr.partial)) {
      errors.push(error(ERROR_TYPES.WEAK_ENTITY_NO_PARTIAL_KEY, e));
    }

    // Regla 15: Entidad fuerte con clave parcial
    if (!e.data.weak && e.data.attributes.some((attr) => attr.partial)) {
      errors.push(error(ERROR_TYPES.STRONG_ENTITY_HAS_PARTIAL_KEY, e));
    }
  });

  return errors;
}

function error(type, entity) {
  return {
    type,
    elementId: entity.id,
    elementKind: "entity",
    meta: {
      name: entity.data.name,
    },
  };
}
