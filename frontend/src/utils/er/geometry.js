export function getLineRectToEllipse(
  rectCenter,
  rectSize,
  ellipseCenter,
  ellipseRadius
) {
  const { x: cx, y: cy } = rectCenter;
  const { width: w, height: h } = rectSize;
  const { x: ex, y: ey } = ellipseCenter;
  const { rx, ry } = ellipseRadius;

  const dx = ex - cx;
  const dy = ey - cy;

  let x1 = cx;
  let y1 = cy;

  if (Math.abs(dy) * (w / 2) > Math.abs(dx) * (h / 2)) {
    y1 += dy > 0 ? h / 2 : -h / 2;
    x1 += (dx * (h / 2)) / Math.abs(dy);
  } else {
    x1 += dx > 0 ? w / 2 : -w / 2;
    y1 += (dy * (w / 2)) / Math.abs(dx);
  }

  const angle = Math.atan2(ey - y1, ex - x1);

  return {
    x1,
    y1,
    x2: ex - rx * Math.cos(angle),
    y2: ey - ry * Math.sin(angle),
  };
}
