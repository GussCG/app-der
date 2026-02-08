import { useTheme } from "../../../../context/ThemeContext";

export default function ERBezierEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  sourceHandleId,
  targetHandleId,
}) {
  const { theme } = useTheme();
  const color = data.color || "#888";

  console.log("Edge coordinates:", {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceHandleId,
    targetHandleId,
    data,
  });

  const getControlPoints = () => {
    const distance = Math.sqrt(
      (targetX - sourceX) ** 2 + (targetY - sourceY) ** 2,
    );
    // El offset determina qué tan "lejos" sale el cable antes de doblarse
    const offset = Math.min(distance * 0.25, 50);

    const getParam = (handleId) => {
      switch (handleId) {
        case "top":
          return { x: 0, y: -offset };
        case "bottom":
          return { x: 0, y: offset };
        case "left":
          return { x: -offset, y: 0 };
        case "right":
          return { x: offset, y: 0 };
        default:
          return { x: 0, y: 0 };
      }
    };

    const s = getParam(sourceHandleId);
    const t = getParam(targetHandleId);

    return {
      c1x: sourceX + s.x,
      c1y: sourceY + s.y,
      c2x: targetX + t.x,
      c2y: targetY + t.y,
    };
  };

  const { c1x, c1y, c2x, c2y } = getControlPoints();
  const path = `M ${Math.round(sourceX)},${Math.round(sourceY)} C ${Math.round(c1x)},${Math.round(c1y)} ${Math.round(c2x)},${Math.round(c2y)} ${Math.round(targetX)},${Math.round(targetY)}`;

  // Función Bezier para posicionar el label (cardinalidad)
  const bezier = (t, p0, p1, p2, p3) => {
    const mt = 1 - t;
    return (
      mt * mt * mt * p0 +
      3 * mt * mt * t * p1 +
      3 * mt * t * t * p2 +
      t * t * t * p3
    );
  };

  const T = data.side === "source" ? 0.2 : 0.8;
  const labelX = bezier(T, sourceX, c1x, c2x, targetX);
  const labelY = bezier(T, sourceY, c1y, c2y, targetY);

  return (
    <>
      {data.participation === "total" ? (
        <>
          <path d={path} stroke={color} strokeWidth={4} fill="none" />
          <path
            d={path}
            stroke={theme === "dark" ? "#1a1a1a" : "#fff"}
            strokeWidth={2}
            fill="none"
          />
        </>
      ) : (
        <path d={path} stroke={color} strokeWidth={2} fill="none" />
      )}

      {data.cardinality && (
        <text
          x={labelX}
          y={labelY - 20}
          fontSize={11}
          textAnchor="middle"
          fill={theme === "dark" ? "#fff" : "#000"}
        >
          {data.cardinality}
        </text>
      )}
    </>
  );
}
