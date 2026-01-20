import { useTheme } from "../../../../context/ThemeContext";

export default function ERBezierEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) {
  const { theme } = useTheme();
  const color = data.color || "#888";

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  const horizontal = Math.abs(dx) > Math.abs(dy);
  const OFFSET = 80;

  const c1x = horizontal ? sourceX + Math.sign(dx) * OFFSET : sourceX;
  const c1y = horizontal ? sourceY : sourceY + Math.sign(dy) * OFFSET;

  const c2x = horizontal ? targetX - Math.sign(dx) * OFFSET : targetX;
  const c2y = horizontal ? targetY : targetY - Math.sign(dy) * OFFSET;

  const path = `
    M ${sourceX},${sourceY}
    C ${c1x},${c1y} ${c2x},${c2y} ${targetX},${targetY}
  `;

  function bezierPoint(t, p0, p1, p2, p3) {
    const mt = 1 - t;
    return (
      mt * mt * mt * p0 +
      3 * mt * mt * t * p1 +
      3 * mt * t * t * p2 +
      t * t * t * p3
    );
  }

  const T = data.side === "source" ? 0.15 : 0.85;

  const labelX = bezierPoint(T, sourceX, c1x, c2x, targetX);

  const labelY = bezierPoint(T, sourceY, c1y, c2y, targetY);
  return (
    <>
      {data.participation === "total" ? (
        <>
          {/* Línea externa */}
          <path
            id={`${id}-outer`}
            d={path}
            stroke={color}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />

          {/* Línea interna (recorte) */}
          <path
            d={path}
            stroke={theme === "dark" ? "#1a1a1a" : "#ffffff"}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          id={id}
          d={path}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      )}

      {data.cardinality && (
        <text
          x={labelX}
          y={labelY - 8}
          fontSize={11}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={theme === "dark" ? "#fff" : "#000"}
        >
          {data.cardinality}
        </text>
      )}
    </>
  );
}
