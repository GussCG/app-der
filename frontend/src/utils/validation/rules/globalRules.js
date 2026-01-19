import { ERROR_TYPES } from "../errorCatalog";

export function validateUniqueNames(entities, relations) {
  const errors = [];
  const names = new Map();

  [...entities, ...relations].forEach((el) => {
    const name = el.data.name.trim().toLowerCase();
    if (names.has(name)) {
      errors.push({
        type: ERROR_TYPES.DUPLICATE_NAME,
        elementId: el.id,
        elementKind: el.kind,
        meta: {
          name,
        },
      });
    }
    names.set(name, el.id);
  });

  return errors;
}
