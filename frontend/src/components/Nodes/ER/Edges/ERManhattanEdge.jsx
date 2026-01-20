// edges/ERManhattanEdge.jsx
import { useTheme } from "../../../../context/ThemeContext";

export default function ERManhattanEdge({
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
  const isHorizontal = Math.abs(dx) > Math.abs(dy);

  const OFFSET = 50;

  const exitX = isHorizontal ? sourceX + Math.sign(dx) * OFFSET : sourceX;
  const exitY = isHorizontal ? sourceY : sourceY + Math.sign(dy) * OFFSET;

  const entryX = isHorizontal ? targetX - Math.sign(dx) * OFFSET : targetX;
  const entryY = isHorizontal ? targetY : targetY - Math.sign(dy) * OFFSET;

  const edgePath = `
    M ${sourceX},${sourceY}
    L ${exitX},${exitY}
    L ${entryX},${entryY}
    L ${targetX},${targetY}
  `;

  return (
    <>
      {data.participation === "total" ? (
        <>
          {/* Línea externa */}
          <path
            id={`${id}-outer`}
            d={edgePath}
            stroke={color}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Línea interna */}
          <path
            d={edgePath}
            stroke={theme === "dark" ? "#1a1a1a" : "#ffffff"}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          id={id}
          d={edgePath}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {data.cardinality && (
        <text
          x={(exitX + entryX) / 2 + 6}
          y={(exitY + entryY) / 2 - 6}
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
