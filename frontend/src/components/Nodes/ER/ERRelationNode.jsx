import React, { useEffect, useMemo } from "react";
import {
  Background,
  Handle,
  Position,
  useUpdateNodeInternals,
} from "reactflow";
import { colorToBgNode } from "../../../utils/colorToBgNode";
import {
  getRelationLayout,
  getRelationAttributePosition,
  getRelationAttributeWidth,
} from "../../../utils/er/relationLayout";
import { useTheme } from "../../../context/ThemeContext";
import ERAttributeNode from "./ERAttributeNode";
import ERDeleteNodeButton from "./ERDeleteNodeButton";

export default function ERRelationshipNode({ id, data, selected }) {
  const { name, attributes = [] } = data;
  const { theme } = useTheme();
  const updateNodeInternals = useUpdateNodeInternals();

  const layout = getRelationLayout(name, attributes);
  const { DIAMOND_W, DIAMOND_H, radius, attrCount, ATTR_H } = layout;

  const bounds = useMemo(() => {
    let minX = -DIAMOND_W / 2;
    let minY = -DIAMOND_H / 2;
    let maxX = DIAMOND_W / 2;
    let maxY = DIAMOND_H / 2;

    attributes.forEach((attr, i) => {
      const { x, y } = getRelationAttributePosition(i, layout, 0, 0);
      // Usamos 40 como ancho mínimo para el cálculo del área
      const w = Math.max(attr.name.length * 4.5 + 20, 40);
      const rx = w / 2;
      const ry = ATTR_H / 2;

      minX = Math.min(minX, x - rx - 40);
      maxX = Math.max(maxX, x + rx + 40);
      minY = Math.min(minY, y - ry - 40);
      maxY = Math.max(maxY, y + ry + 40);
    });

    return { minX, minY, maxX, maxY };
  }, [attributes, layout, DIAMOND_W, DIAMOND_H, ATTR_H]);

  const PADDING = 40;
  const svgWidth = bounds.maxX - bounds.minX + PADDING * 2;
  const svgHeight = bounds.maxY - bounds.minY + PADDING * 2;
  const centerX = -bounds.minX + PADDING;
  const centerY = -bounds.minY + PADDING;

  const halfW = DIAMOND_W / 2;
  const halfH = DIAMOND_H / 2;

  // Puntos del rombo
  const points = `
    ${centerX},${centerY - halfH}
    ${centerX + halfW},${centerY}
    ${centerX},${centerY + halfH}
    ${centerX - halfW},${centerY}
  `;

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, svgWidth, svgHeight, updateNodeInternals]);

  const getHandleStyle = (pos) => {
    let top = centerY;
    let left = centerX;

    const offsetW = DIAMOND_W / 2;
    const offsetH = DIAMOND_H / 2;

    if (pos === "top") top -= offsetH;
    if (pos === "bottom") top += offsetH;
    if (pos === "left") left -= offsetW;
    if (pos === "right") left += offsetW;

    return {
      top: `${top}px`,
      left: `${left}px`,
      opacity: 1,
      position: "absolute",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      backgroundColor: data.color || "#0f1419",
      border: `1px solid ${theme === "dark" ? "#ffffff" : "#000000"}`,
    };
  };

  return (
    <div
      className={`er__relation${selected ? " selected" : ""}`}
      style={{ width: svgWidth, height: svgHeight, position: "relative" }}
    >
      {["top", "bottom", "left", "right"].map((pos) => (
        <React.Fragment key={pos}>
          <Handle
            type="source"
            id={pos}
            position={Position[pos.toUpperCase()]}
            style={getHandleStyle(pos)}
          />
          <Handle
            type="target"
            id={pos}
            position={Position[pos.toUpperCase()]}
            style={getHandleStyle(pos)}
          />
        </React.Fragment>
      ))}

      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Atributos */}
        {attributes.map((attr, i) => {
          const { x: attrX, y: attrY } = getRelationAttributePosition(
            i,
            layout,
            centerX,
            centerY,
          );

          // Ancho con mínimo de 40 para que la línea no entre al óvalo
          const rx = Math.max(attr.name.length * 4.5 + 20, 40);
          const ry = ATTR_H / 2;

          const angle = Math.atan2(attrY - centerY, attrX - centerX);
          const cosA = Math.abs(Math.cos(angle));
          const sinA = Math.abs(Math.sin(angle));

          // Intersección con el rombo
          const distToEdge =
            (DIAMOND_W * DIAMOND_H) / (DIAMOND_H * cosA + DIAMOND_W * sinA) / 2;

          const x1 = centerX + distToEdge * Math.cos(angle);
          const y1 = centerY + distToEdge * Math.sin(angle);

          // Intersección con el óvalo (offset si es multivaluado)
          const offset = attr.kind === "multivalued" ? 6 : 0;
          const x2 = attrX - (rx + offset) * Math.cos(angle);
          const y2 = attrY - (ry + offset) * Math.sin(angle);

          return (
            <line
              key={`line-${attr.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={data.color || "#0f1419"}
              strokeWidth="1.2"
            />
          );
        })}

        {/* Rombo */}
        <polygon
          points={points}
          fill={colorToBgNode(data.color) || "#0f1419"}
          stroke={data.color || "#0f1419"}
          strokeWidth="2"
        />

        {data.type === "identifying" && (
          <polygon
            points={`${centerX},${centerY - halfH + 6} ${centerX + halfW - 9},${centerY} ${centerX},${centerY + halfH - 6} ${centerX - halfW + 9},${centerY}`}
            fill="transparent"
            stroke={data.color || "#0f1419"}
            strokeWidth="1.2"
          />
        )}

        {/* Texto */}
        <text
          x={centerX}
          y={centerY + 4}
          textAnchor="middle"
          fontSize="14"
          fill={theme === "dark" ? "#ffffff" : "#000000"}
          fontWeight="500"
          style={{ textTransform: "uppercase" }}
        >
          {name}
        </text>

        {attributes.map((attr, i) => {
          const { x, y } = getRelationAttributePosition(
            i,
            layout,
            centerX,
            centerY,
          );

          return (
            <ERAttributeNode
              key={attr.id}
              attr={attr}
              position={{ x, y }}
              parentCenter={{ cx: centerX, cy: centerY }}
              attrHeight={ATTR_H}
              color={data.color}
              theme={theme}
            />
          );
        })}
      </svg>

      {selected && (
        <ERDeleteNodeButton onDelete={() => deleteElementsDiagram([id])} />
      )}
    </div>
  );
}
