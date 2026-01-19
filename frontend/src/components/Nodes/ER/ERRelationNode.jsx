import React, { useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { colorToBgNode } from "../../../utils/colorToBgNode";
import {
  getRelationLayout,
  getRelationAttributePosition,
  getRelationAttributeWidth,
} from "../../../utils/er/relationLayout";
import { useTheme } from "../../../context/ThemeContext";

export default function ERRelationshipNode({ id, data, selected }) {
  const { name, attributes = [] } = data;
  const { theme } = useTheme();

  const updateNodeInternals = useUpdateNodeInternals();

  const layout = getRelationLayout(name, attributes);
  const { DIAMOND_W, DIAMOND_H, radius, attrCount } = layout;

  // Calculamos un margen de seguridad basado en el atributo más ancho posible
  const maxAttrWidth =
    attributes.length > 0
      ? Math.max(...attributes.map((a) => getRelationAttributeWidth(a)))
      : 40;

  // El tamaño debe cubrir desde el centro hasta el borde del atributo más lejano
  let svgWidth, svgHeight;

  if (attrCount === 0) {
    svgWidth = DIAMOND_W + 40;
    svgHeight = DIAMOND_H + 40;
  } else if (attrCount <= 1) {
    svgWidth = DIAMOND_W + 40;
    svgHeight = DIAMOND_H + 120; // Espacio para el atributo abajo
  } else {
    // Para circular, el tamaño total es el diámetro del círculo + el ancho de los atributos
    const size = (radius + maxAttrWidth) * 2;
    svgWidth = size;
    svgHeight = size;
  }

  const centerX = svgWidth / 2;
  const centerY = attrCount === 1 ? 40 + DIAMOND_H / 2 : svgHeight / 2;

  const halfW = DIAMOND_W / 2;
  const halfH = DIAMOND_H / 2;

  const points = `
    ${centerX},${centerY - halfH}
    ${centerX + halfW},${centerY}
    ${centerX},${centerY + halfH}
    ${centerX - halfW},${centerY}
  `;

  useEffect(() => {
    updateNodeInternals(id);
  }, [name, updateNodeInternals, id]);

  return (
    <div className={`er__relation${selected ? " selected" : ""}`}>
      {["top", "bottom", "left", "right"].map((pos) => (
        <React.Fragment key={pos}>
          <Handle
            type="source"
            id={pos}
            position={Position[pos.toUpperCase()]}
            style={{
              opacity: 0,
              top:
                pos === "top"
                  ? centerY - halfH
                  : pos === "bottom"
                    ? centerY + halfH
                    : centerY,
              left:
                pos === "left"
                  ? centerX - halfW
                  : pos === "right"
                    ? centerX + halfW
                    : centerX,
            }}
          />
          <Handle
            type="target"
            id={pos}
            position={Position[pos.toUpperCase()]}
            style={{
              opacity: 0,
              top:
                pos === "top"
                  ? centerY - halfH
                  : pos === "bottom"
                    ? centerY + halfH
                    : centerY,
              left:
                pos === "left"
                  ? centerX - halfW
                  : pos === "right"
                    ? centerX + halfW
                    : centerX,
            }}
          />
        </React.Fragment>
      ))}

      <svg width={svgWidth} height={svgHeight}>
        {/* Atributos */}
        {attributes.map((attr, i) => {
          const { x, y } = getRelationAttributePosition(
            i,
            layout,
            centerX,
            centerY,
          );
          const rx = getRelationAttributeWidth(attr);
          const ry = layout.ATTR_H / 2;

          const angle = Math.atan2(y - centerY, x - centerX);

          // Cálculo de intersección con el borde del rombo
          const cosA = Math.abs(Math.cos(angle));
          const sinA = Math.abs(Math.sin(angle));
          const distToEdge =
            (DIAMOND_W * DIAMOND_H) / (DIAMOND_H * cosA + DIAMOND_W * sinA) / 2;

          const x1 = centerX + distToEdge * Math.cos(angle);
          const y1 = centerY + distToEdge * Math.sin(angle);

          // Intersección con el elipse del atributo
          const x2 = x - rx * Math.cos(angle);
          const y2 = y - ry * Math.sin(angle);

          return (
            <g key={attr.id}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={data.color || "#0f1419"}
              />

              <ellipse
                cx={x}
                cy={y}
                rx={rx}
                ry={ry}
                fill={colorToBgNode(data.color) || "#0f1419"}
                stroke={data.color || "#0f1419"}
                strokeWidth="1.2"
              />

              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="10"
                fill={theme === "dark" ? "#ffffff" : "#000000"}
                fontWeight="100"
              >
                {attr.name}
              </text>
            </g>
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
            points={`
                    ${centerX},${centerY - halfH + 6}
                    ${centerX + halfW - 9},${centerY}
                    ${centerX},${centerY + halfH - 6}
                    ${centerX - halfW + 9},${centerY}
                  `}
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
          fontWeight="300"
        >
          {name}
        </text>
      </svg>
    </div>
  );
}
