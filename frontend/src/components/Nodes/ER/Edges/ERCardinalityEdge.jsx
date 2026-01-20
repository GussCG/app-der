import { getBezierPath, getSmoothStepPath } from "reactflow";
import { useTheme } from "../../../../context/ThemeContext.jsx";

export default function ERCardinalityEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
    offset: 40,
  });
  const { theme } = useTheme();
  const color = data.color || "#888";

  const OFFSET_LABEL = 40;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const labelPosX =
    data.side === "source"
      ? sourceX + ux * OFFSET_LABEL
      : targetX - ux * OFFSET_LABEL;
  const labelPosY =
    data.side === "source"
      ? sourceY + uy * OFFSET_LABEL
      : targetY - uy * OFFSET_LABEL;

  return (
    <>
      {data.participation === "total" ? (
        <>
          {/* Línea externa (gruesa) */}
          <path
            id={`${id}-outer`}
            d={edgePath}
            stroke={color}
            strokeWidth={4}
            fill="none"
          />
          {/* Línea interna (color de fondo) para crear el efecto de "vía de tren" */}
          <path
            d={edgePath}
            stroke={theme === "dark" ? "#1a1a1a" : "#ffffff"}
            strokeWidth={2}
            fill="none"
          />
        </>
      ) : (
        <path id={id} d={edgePath} stroke={color} strokeWidth={2} fill="none" />
      )}

      <text
        x={labelPosX}
        y={labelPosY}
        fontSize={11}
        className="er-edge-text"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={theme === "dark" ? "#fff" : "#000"}
      >
        {data.cardinality}
      </text>
    </>
  );
}
