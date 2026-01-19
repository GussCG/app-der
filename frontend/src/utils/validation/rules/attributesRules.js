import { ERROR_TYPES } from "../errorCatalog";

export function validateAttributeNames(elements) {
  const errors = [];

  elements.forEach((el) => {
    const attributes = el.data?.attributes ?? [];

    if (!Array.isArray(attributes)) return;

    const seen = new Set();

    attributes.forEach((attr) => {
      if (seen.has(attr.name)) {
        errors.push({
          type: ERROR_TYPES.DUPLICATE_ATTRIBUTE_NAME,
          elementId: el.id,
          elementKind: el.kind,
          meta: {
            attributeName: attr.name,
          },
        });
      }
      seen.add(attr.name);
    });
  });

  return errors;
}
