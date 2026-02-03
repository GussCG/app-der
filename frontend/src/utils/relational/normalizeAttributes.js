export function normalizeAttributes(attributes = []) {
  const columns = [];
  const multivalued = [];

  attributes.forEach((attr) => {
    if (attr.kind === "derived") return;

    if (attr.kind === "composite" && Array.isArray(attr.children)) {
      attr.children.forEach((child) => {
        columns.push({
          ...child,
          name: `${attr.name}_${child.name}`,
          parentId: attr.id,
          parentName: attr.name,
          isPk: !!attr.pk,
        });
      });
      return;
    }

    if (attr.kind === "multivalued") {
      multivalued.push(attr);
      return;
    }

    columns.push(attr);
  });

  return { columns, multivalued };
}
