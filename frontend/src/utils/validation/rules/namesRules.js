import { validateERName } from "../../../constants/validators";
import { ERROR_TYPES } from "../errorCatalog.js";

export function validateNames({ entities, relations }) {
  const errors = [];

  entities.forEach((e) => {
    const errorMsg = validateERName(e.data.name);
    if (errorMsg) {
      errors.push({
        type: ERROR_TYPES.INVALID_NAME_FORMAT,
        elementId: e.id,
        elementKind: e.kind,
        meta: { name: e.data.name, reason: errorMsg },
      });
    }

    validateAttributeFormat(
      e.data.attributes,
      e.id,
      e.kind,
      e.data.name,
      errors,
    );
  });

  relations.forEach((r) => {
    const errorMsg = validateERName(r.data.name);
    if (errorMsg) {
      errors.push({
        type: ERROR_TYPES.INVALID_NAME_FORMAT,
        elementId: r.id,
        elementKind: r.kind,
        meta: { name: r.data.name, reason: errorMsg },
      });
    }

    validateAttributeFormat(
      r.data.attributes,
      r.id,
      r.kind,
      r.data.name,
      errors,
    );
  });

  return errors;
}

function validateAttributeFormat(
  attributes = [],
  parentId,
  parentKind,
  parentName,
  errors,
) {
  attributes.forEach((attr) => {
    const errorMsg = validateERName(attr.name);
    if (errorMsg) {
      errors.push({
        type: ERROR_TYPES.INVALID_ATTRIBUTE_NAME_FORMAT,
        elementId: parentId,
        elementKind: parentKind,
        meta: {
          name: parentName,
          attributeName: attr.name,
          reason: errorMsg,
        },
      });
    }

    if (Array.isArray(attr.children)) {
      validateAttributeFormat(
        attr.children,
        parentId,
        parentKind,
        parentName,
        errors,
      );
    }
  });
}
