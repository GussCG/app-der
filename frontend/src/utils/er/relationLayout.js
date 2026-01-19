const CHAR_W = 8;

export function getRelationLayout(name, attributes) {
  const attrCount = attributes.length;
  const DIAMOND_W = Math.max(100, name.length * CHAR_W + 40);
  const DIAMOND_H = 65;
  const ATTR_H = 26;

  let radius = 80;
  if (attrCount > 3) {
    radius = 70 + attrCount * 12;
  }
  radius = Math.max(radius, DIAMOND_W / 2 + 20);

  return { DIAMOND_W, DIAMOND_H, ATTR_H, radius, attrCount };
}

export function getRelationAttributePosition(i, layout, centerX, centerY) {
  const { attrCount, radius, DIAMOND_H } = layout;

  if (attrCount === 1) {
    return { x: centerX, y: centerY + DIAMOND_H / 2 + 50 };
  }
  if (attrCount === 2) {
    return {
      x: centerX,
      y: i === 0 ? centerY - DIAMOND_H / 2 - 50 : centerY + DIAMOND_H / 2 + 50,
    };
  }

  const angleOffset = -Math.PI / 2;
  const angle = (2 * Math.PI * i) / attrCount + angleOffset;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

// ESTA ES LA FUNCIÓN QUE FALTABA EXPORTAR
export function getRelationAttributeWidth(attr) {
  return Math.max(45, (attr.name?.length || 0) * CHAR_W * 0.7);
}
