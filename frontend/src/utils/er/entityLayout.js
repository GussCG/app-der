const CHAR_W = 8;
const ATTR_H = 28;
const ATTR_BASE_W = 72;

export function getEntityLayout(name, attributes) {
  const attrCount = attributes.length;

  const ENTITY_W = Math.max(120, name.length * CHAR_W + 24);
  const ENTITY_H = 40;

  const MIN_RADIUS = 60;
  const MAX_RADIUS = 130;

  let radius = 0;
  if (attrCount >= 2) {
    radius = Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, 50 + attrCount * 14));
  }

  return {
    ENTITY_W,
    ENTITY_H,
    ATTR_H,
    radius,
    attrCount,
  };
}

export function getAttributeWidth(attr) {
  return Math.max(ATTR_BASE_W, attr.name.length * CHAR_W + 16);
}

export function getAttributePosition(i, layout, centerX, centerY) {
  const { attrCount, radius, ENTITY_H } = layout;

  if (attrCount === 1) {
    return { x: centerX, y: centerY + ENTITY_H / 2 + 30 };
  }

  if (attrCount === 2) {
    return {
      x: centerX,
      y: i === 0 ? centerY - ENTITY_H / 2 - 30 : centerY + ENTITY_H / 2 + 30,
    };
  }

  const angleOffset = -Math.PI / 2;
  const angle = (2 * Math.PI * i) / attrCount + angleOffset;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
