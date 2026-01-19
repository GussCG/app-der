export function chooseEntityHandle(from, to) {
  if (!from || !to) return "top";

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "bottom" : "top";
}

export function chooseRelationHandle(from, to) {
  if (!from || !to) return "top";

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Si la diferencia en X es mayor, conectar por los lados
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  // Si no, conectar por arriba o abajo
  return dy > 0 ? "bottom" : "top";
}
