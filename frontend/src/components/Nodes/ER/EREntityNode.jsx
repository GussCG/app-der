import { useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { colorToBgNode } from "../../../utils/colorToBgNode";
import {
  getEntityLayout,
  getAttributePosition,
  getAttributeWidth,
} from "../../../utils/er/entityLayout";
import { getLineRectToEllipse } from "../../../utils/er/geometry";
import { useTheme } from "../../../context/ThemeContext";

export default function EREntityNode({ id, data, selected }) {
  const { name, attributes, relations = [] } = data;

  const { theme } = useTheme();

  const updateNodeInternals = useUpdateNodeInternals();

  const layout = getEntityLayout(name, attributes);

  const { ENTITY_W, ENTITY_H, ATTR_H, radius, attrCount } = layout;
  const PADDING = 20;

  const HANDLE_OFFSET = 1.5;

  let svgWidth = ENTITY_W + PADDING * 2;
  let svgHeight = ENTITY_H + PADDING * 2;

  if (attrCount === 1) {
    svgWidth += 120;
    svgHeight += ENTITY_H / 2 + 30 + ATTR_H;
  }

  if (attrCount >= 2) {
    svgWidth += radius * 2;
    svgHeight += radius * 2;
  }

  const centerX = svgWidth / 2;
  const centerY = attrCount === 1 ? PADDING + ENTITY_H / 2 : svgHeight / 2;

  useEffect(() => {
    updateNodeInternals(id);
  }, [attributes.length, name, updateNodeInternals, id]);

  return (
    <div className={`er__entity${selected ? " selected" : ""}`}>
      {["top", "right", "bottom", "left"].map((pos) => (
        <Handle
          key={`s-${pos}`}
          type="source"
          position={Position[pos.toUpperCase()]}
          id={pos}
          style={{
            // Posicionamiento dinámico basado en el centro del rect
            top:
              pos === "top"
                ? centerY - ENTITY_H / 2 - HANDLE_OFFSET
                : pos === "bottom"
                  ? centerY + ENTITY_H / 2 + HANDLE_OFFSET
                  : centerY,
            left:
              pos === "left"
                ? centerX - ENTITY_W / 2 - HANDLE_OFFSET
                : pos === "right"
                  ? centerX + ENTITY_W / 2 + HANDLE_OFFSET
                  : centerX,
            opacity: 0, // Cambia a 1 para debugear si es necesario
          }}
        />
      ))}

      {["top", "right", "bottom", "left"].map((pos) => (
        <Handle
          key={`t-${pos}`}
          type="target"
          position={Position[pos.toUpperCase()]}
          id={pos}
          style={{
            top:
              pos === "top"
                ? centerY - ENTITY_H / 2 - HANDLE_OFFSET
                : pos === "bottom"
                  ? centerY + ENTITY_H / 2 + HANDLE_OFFSET
                  : centerY,
            left:
              pos === "left"
                ? centerX - ENTITY_W / 2 - HANDLE_OFFSET
                : pos === "right"
                  ? centerX + ENTITY_W / 2 + HANDLE_OFFSET
                  : centerX,
            opacity: 0,
          }}
        />
      ))}

      <svg width={svgWidth} height={svgHeight}>
        {/* Conexiones primero */}
        {attributes.map((_, i) => {
          const { x, y } = getAttributePosition(i, layout, centerX, centerY);
          const { x1, y1, x2, y2 } = getLineRectToEllipse(
            { x: centerX, y: centerY },
            { width: ENTITY_W, height: ENTITY_H },
            { x, y },
            { rx: getAttributeWidth(attributes[i]) / 2, ry: ATTR_H / 2 },
          );

          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={data.color || "#0f1419"}
            />
          );
        })}

        {/* Entidad */}
        <rect
          x={centerX - ENTITY_W / 2}
          y={centerY - ENTITY_H / 2}
          width={ENTITY_W}
          height={ENTITY_H}
          rx="10"
          fill={colorToBgNode(data.color) || "#0f1419"}
          stroke={data.color || "#0f1419"}
          strokeWidth="1.5"
        />

        {data.weak && (
          <rect
            x={centerX - ENTITY_W / 2 + 4}
            y={centerY - ENTITY_H / 2 + 4}
            width={ENTITY_W - 8}
            height={ENTITY_H - 8}
            rx="7"
            fill="transparent"
            stroke={data.color || "#0f1419"}
            strokeWidth="1"
          />
        )}

        <text
          x={centerX}
          y={centerY + 4}
          textAnchor="middle"
          fontWeight="300"
          fill={theme === "dark" ? "#ffffff" : "#000000"}
          fontSize="14"
        >
          {name}
        </text>

        {/* === ATRIBUTOS === */}
        {attributes.map((attr, i) => {
          const { x, y } = getAttributePosition(i, layout, centerX, centerY);
          const rx = getAttributeWidth(attr) / 2;

          return (
            <g key={attr.id}>
              <ellipse
                cx={x}
                cy={y}
                rx={rx}
                ry={ATTR_H / 2}
                fill={colorToBgNode(data.color) || "#0f1419"}
                stroke={data.color || "#0f1419"}
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={y + 4}
                fontSize="10"
                textAnchor="middle"
                style={{ textDecoration: attr.pk ? "underline" : "none" }}
                fill={theme === "dark" ? "#ffffff" : "#000000"}
                fontWeight="100"
              >
                {attr.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
