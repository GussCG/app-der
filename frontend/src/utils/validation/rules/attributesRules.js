import { ERROR_TYPES } from "../errorCatalog";

export function validateAttributeNames(elements) {
  const errors = [];

  elements.forEach((el) => {
    const attributes = el.data?.attributes ?? [];
    if (!Array.isArray(attributes)) return;

    validateLevel(attributes, el, errors);
  });

  return errors;
}

function validateLevel(attributes, el, errors) {
  const seen = new Set();

  attributes.forEach((attr) => {
    if (!attr?.name) return;
    const key = attr.name.trim().toLowerCase();
    if (seen.has(key)) {
      errors.push({
        type: ERROR_TYPES.DUPLICATE_ATTRIBUTE_NAME,
        elementId: el.id,
        elementKind: el.kind,
        meta: {
          attributeName: attr.name,
        },
      });
    }

    seen.add(key);

    if (Array.isArray(attr.children)) {
      validateLevel(attr.children, el, errors);
    }
  });
}
