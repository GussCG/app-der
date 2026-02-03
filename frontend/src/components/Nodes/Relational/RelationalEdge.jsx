import React from "react";
import { getSmoothStepPath, EdgeText } from "reactflow";
import { useTheme } from "../../../context/ThemeContext";

function RelationalEdge(props) {
  const {
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    data,
    selected,
  } = props;

  const isSelfReferencing = source === target;

  let edgePath = "";
  let labelX, labelY;

  if (isSelfReferencing) {
    // Definimos qué tan grande es el bucle
    const size = 50;

    edgePath = `
      M ${sourceX} ${sourceY} 
      C ${sourceX + size} ${sourceY}, 
        ${sourceX + size} ${sourceY - size}, 
        ${sourceX} ${sourceY - size}
    `;

    labelX = sourceX + size;
    labelY = sourceY - size;
  } else {
    const [path, x, y] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 12,
    });
    edgePath = path;
    labelX = x;
    labelY = y;
  }

  const { theme } = useTheme();

  const gradientId = `grad-${id}`;
  const startColor = data?.sourceColor || "#393939";
  const endColor = data?.targetColor || "#393939";

  const oneId = `one-${id}`;
  const manyId = `many-${id}`;

  return (
    <g key={`edge-group-${id}`}>
      <defs>
        <marker
          id={oneId}
          markerUnits="userSpaceOnUse"
          markerWidth="15"
          markerHeight="15"
          refX="5"
          refY="7.5"
          orient="auto"
        >
          <line
            x1="5"
            y1="2"
            x2="5"
            y2="13"
            stroke={theme === "dark" ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <line
            x1="10"
            y1="2"
            x2="10"
            y2="13"
            stroke={theme === "dark" ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
        </marker>

        <marker
          id={manyId}
          markerUnits="userSpaceOnUse"
          markerWidth="20"
          markerHeight="20"
          refX="15"
          refY="10"
          orient="auto"
        >
          <path
            d="M2,5 L12,10 L2,15"
            fill="none"
            stroke={theme === "dark" ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="4"
            x2="15"
            y2="16"
            stroke={theme === "dark" ? "#ffffff" : "#000000"}
            strokeWidth="2"
          />
        </marker>
      </defs>

      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>

      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: "pointer" }}
        onClick={(event) => props.onEdgeClick?.(event, props)}
      />

      <path
        id={id}
        className={`relational-edge-path ${selected ? "selected" : ""}`}
        d={edgePath}
        strokeWidth={2}
        stroke={selected ? "#317cff" : `url(#${gradientId})`}
        fill="none"
        markerEnd={`url(#${manyId})`}
        markerStart={`url(#${oneId})`}
        style={{
          // Si está seleccionado, se hace punteado (dashed)
          strokeDasharray: selected ? "5,5" : "0",
          transition: "stroke-width 0.2s, stroke-dasharray 0.1s",
        }}
      />

      {/* {label && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={label}
          onClick={(event) => props.onEdgeClick?.(event, props)}
          labelStyle={{
            fill: theme === "dark" ? "#ffffff" : "#000000",
            fontWeight: 600,
            fontSize: "14px", // Tamaño fijo en px es más seguro para exportar
            fontFamily: "Google Sans Flex",
          }}
          labelShowBg={true}
          labelBgPadding={[12, 8]}
          labelBgBorderRadius={4}
          labelBgStyle={{
            fill: theme === "dark" ? "#1a1a1a" : "#ffffff",
            fillOpacity: 1,
            stroke: selected ? "#317cff" : "#bbb",
            strokeWidth: 2,
            cursor: "pointer",
          }}
        />
      )} */}
    </g>
  );
}

export default RelationalEdge;
