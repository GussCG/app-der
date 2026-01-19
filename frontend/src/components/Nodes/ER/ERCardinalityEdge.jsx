import { getBezierPath, getSmoothStepPath } from "reactflow";
import { useTheme } from "../../../context/ThemeContext.jsx";

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
  console.log("Rendering ERCardinalityEdge with data:", data);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
    offset: 0,
  });
  const { theme } = useTheme();
  const color = data.color || "#888";

  const OFFSET = 40;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const labelPosX =
    data.side === "source" ? sourceX + ux * OFFSET : targetX - ux * OFFSET;
  const labelPosY =
    data.side === "source" ? sourceY + uy * OFFSET : targetY - uy * OFFSET;

  return (
    <>
      {data.participation === "total" ? (
        <>
          <path
            id={id}
            d={edgePath}
            stroke={color}
            strokeWidth={6}
            fill="none"
          />
          <path d={edgePath} stroke="#1a1a1a" strokeWidth={2} fill="none" />
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
