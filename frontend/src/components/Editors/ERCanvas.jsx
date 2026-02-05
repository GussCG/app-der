import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

import { useEffect, useRef, useCallback, useMemo } from "react";

import { useEditor } from "../../context/EditorContext";
import { useTool } from "../../context/ToolContext";
import {
  derToReactFlow,
  getCenter,
  getRecursiveHandles,
} from "../../utils/derToReactFlow.js";
import {
  chooseEntityHandle,
  chooseRelationHandle,
} from "../../utils/er/chooseBestHandle.js";
import EREntityNode from "../Nodes/ER/EREntityNode.jsx";
import ERRelationNode from "../Nodes/ER/ERRelationNode.jsx";
import ERCardinalityEdge from "../Nodes/ER/Edges/ERCardinalityEdge.jsx";
import ERManhattanEdge from "../Nodes/ER/Edges/ERManhattanEdge.jsx";
import ERBezierEdge from "../Nodes/ER/Edges/ERBezierEdge.jsx";

const nodeTypes = {
  entity: EREntityNode,
  relation: ERRelationNode,
};

const edgeTypes = {
  er: ERBezierEdge,
};

export default function ERCanvas() {
  const {
    diagram,
    applyChange,
    setSelectedElementIds,
    bgVariant,
    deleteElementsDiagram,
    selectedElementIds,
    isAutoLayouting,
  } = useEditor();
  const { activeTool, setActiveTool } = useTool();
  const {
    fitView,
    screenToFlowPosition,
    setNodes: rfSetNodes,
    getNodes,
    setViewport,
  } = useReactFlow();

  console.log("ERCanvas render", { diagram });

  const isSyncingRef = useRef(false);
  const lastSelectionRef = useRef(null);

  const initial = useMemo(() => {
    const data = derToReactFlow(diagram);
    return {
      nodes: data.nodes.map((n) => ({
        ...n,
        type: n.type === "relation" ? "relation" : "entity",
      })),
      edges: data.edges,
    };
  }, []); // Solo al montar
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  const selectedIdsRef = useRef([]);
  useEffect(() => {
    selectedIdsRef.current = selectedElementIds;
  }, [selectedElementIds]);

  useEffect(() => {
    if (isSyncingRef.current) return;

    const { nodes: newNodes, edges: newEdges } = derToReactFlow(diagram);

    setNodes((currentNodes) =>
      newNodes.map((newNode) => {
        const existing = currentNodes.find((n) => n.id === newNode.id);
        return {
          ...newNode,
          type: newNode.type,
          position: existing ? existing.position : newNode.position,
          selected: selectedIdsRef.current.includes(newNode.id),
        };
      }),
    );

    setEdges((currentEdges) =>
      newEdges.map((newEdge) => {
        const existing = currentEdges.find((e) => e.id === newEdge.id);
        if (existing) {
          return {
            ...newEdge,
            sourceHandle: existing.sourceHandle,
            targetHandle: existing.targetHandle,
          };
        }
        return newEdge;
      }),
    );

    requestAnimationFrame(() => {
      const selectedIds = lastSelectionRef.current;

      if (selectedIds.length === 0) return;

      rfSetNodes((nds) =>
        nds.map((n) =>
          selectedIds.includes(n.id) ? { ...n, selected: true } : n,
        ),
      );
    });
  }, [diagram]);

  const onSelectionChange = useCallback(
    ({ nodes: selNodes }) => {
      const ids = selNodes.map((n) => n.id);
      lastSelectionRef.current = ids;

      setSelectedElementIds((prev) => {
        if (prev.length !== ids.length) return ids;

        const a = [...prev].sort().join(",");
        const b = [...ids].sort().join(",");

        return a !== b ? ids : prev;
      });
    },
    [setSelectedElementIds],
  );

  const onNodeDragStop = useCallback(
    (event, node, draggedNodes) => {
      if (draggedNodes.length === 0) return;

      isSyncingRef.current = true;

      const allNodes = getNodes();
      const nodeMap = Object.fromEntries(allNodes.map((n) => [n.id, n]));

      const updatedRelations = diagram.relations.map((rel) => {
        const draggedRel = draggedNodes.find((dn) => dn.id === rel.id);
        const currentPos = draggedRel ? draggedRel.position : rel.position;

        const { source, target } = rel.data.connections || {};
        if (!source?.entityId || !target?.entityId) {
          return { ...rel, position: currentPos };
        }

        const sourceNode = nodeMap[source.entityId];
        const targetNode = nodeMap[target.entityId];
        const relNode = nodeMap[rel.id];

        if (!sourceNode || !targetNode || !relNode)
          return { ...rel, position: currentPos };

        const sCenter = getCenter(sourceNode, "entity");
        const tCenter = getCenter(targetNode, "entity");
        const rCenter = getCenter(relNode, "relation");

        return {
          ...rel,
          position: currentPos,
          data: {
            ...rel.data,
            connections: {
              source: {
                ...source,
                handleId: chooseEntityHandle(sCenter, rCenter),
              },
              target: {
                ...target,
                handleId: chooseEntityHandle(tCenter, rCenter),
              },
            },
          },
        };
      });

      applyChange({
        ...diagram,
        entities: diagram.entities.map((e) => {
          const dragged = draggedNodes.find((dn) => dn.id === e.id);
          return dragged ? { ...e, position: dragged.position } : e;
        }),
        relations: updatedRelations,
      });

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 100);
    },
    [applyChange, diagram, getNodes],
  );

  const onNodeDrag = useCallback(
    (event, node, draggedNodes) => {
      setEdges((eds) => {
        // Obtenemos todos los nodos actuales para tener sus posiciones frescas
        const allNodes = getNodes();
        const nodeMap = Object.fromEntries(allNodes.map((n) => [n.id, n]));

        return eds.map((edge) => {
          // Solo recalculamos si el edge está conectado a uno de los nodos que se mueve
          if (
            draggedNodes.some(
              (dn) => dn.id === edge.source || dn.id === edge.target,
            )
          ) {
            const sourceNode = nodeMap[edge.source];
            const targetNode = nodeMap[edge.target];

            if (!sourceNode || !targetNode) return edge;

            const sCenter = getCenter(sourceNode, sourceNode.type);
            const tCenter = getCenter(targetNode, targetNode.type);

            // Si es recursivo, usamos la lógica de la "U"
            if (edge.data.isRecursive) {
              const recHandles = getRecursiveHandles(sCenter, tCenter);
              return {
                ...edge,
                sourceHandle:
                  edge.data.side === "source"
                    ? recHandles.source.entity
                    : recHandles.target.relation,
                targetHandle:
                  edge.data.side === "source"
                    ? recHandles.source.relation
                    : recHandles.target.entity,
              };
            }

            // Si es normal, recalculamos el mejor handle
            return {
              ...edge,
              sourceHandle: chooseEntityHandle(sCenter, tCenter),
              targetHandle: chooseRelationHandle(tCenter, sCenter),
            };
          }
          return edge;
        });
      });
    },
    [getNodes, setEdges],
  );

  const onPaneClick = (event) => {
    if (activeTool !== "entity" && activeTool !== "relation") return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    if (activeTool === "entity") {
      // Crear entidad
      const newEntity = {
        id: crypto.randomUUID(),
        position: position,
        type: "entity",
        data: {
          name: "Nueva Entidad",
          weak: false,
          attributes: [],
          color: "#323c4c",
        },
      };

      // Agregar entidad al diagrama
      applyChange({
        ...diagram,
        entities: [...diagram.entities, newEntity],
      });
    } else if (activeTool === "relation") {
      // Crear relación
      const newRelation = {
        id: crypto.randomUUID(),
        position: position,
        type: "relation",
        data: {
          name: "Nueva Relación",
          type: "simple",
          attributes: [],
          connections: {
            source: {
              entityId: null,
              cardinality: "1",
              participation: "partial",
              handleId: null,
            },
            target: {
              entityId: null,
              cardinality: "1",
              participation: "partial",
              handleId: null,
            },
          },
          color: "#323c4c",
        },
      };

      // Agregar relación al diagrama
      applyChange({
        ...diagram,
        relations: [...diagram.relations, newRelation],
      });
    }

    setActiveTool("select");
  };

  const onConnect = (connection) => {
    const { source, target, sourceHandle, targetHandle } = connection;

    const relation = diagram.relations.find(
      (r) => r.id === source || r.id === target,
    );
    if (!relation) return;

    const isSource = source === relation.id;
    const isTarget = target === relation.id;

    let updatedRelation = {
      ...relation,
      data: {
        ...relation.data,
        connections: {
          ...relation.data.connections,
        },
      },
    };

    if (
      isSource &&
      updatedRelation.data.connections.target?.entityId === target
    ) {
      updatedRelation.data.connections.target = {
        entityId: null,
        cardinality: "1",
        participation: "partial",
        handleId: null,
      };
    } else if (
      isTarget &&
      updatedRelation.data.connections.source?.entityId === source
    ) {
      updatedRelation.data.connections.source = {
        entityId: null,
        cardinality: "1",
        participation: "partial",
        handleId: null,
      };
    } else {
      if (isTarget) {
        updatedRelation.data.connections.source = {
          entityId: source,
          cardinality: "1",
          participation:
            updatedRelation.data.connections.source?.participation ?? "partial",
          handleId: sourceHandle,
        };
      } else if (isSource) {
        updatedRelation.data.connections.target = {
          entityId: target,
          cardinality: "1",
          participation:
            updatedRelation.data.connections.target?.participation ?? "partial",
          handleId: targetHandle,
        };
      }
    }

    applyChange({
      ...diagram,
      relations: diagram.relations.map((r) =>
        r.id === relation.id ? updatedRelation : r,
      ),
    });
  };

  const onNodesDelete = (deletedNodes) => {
    if (deletedNodes.length === 0) return;
    const deletedIds = new Set(deletedNodes.map((node) => node.id));
    deleteElementsDiagram(deletedIds);
  };

  return (
    <div className="editor__canvas" data-tour="er-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={activeTool === "select" || activeTool === "lasso"}
        panOnDrag={activeTool === "pan"}
        nodesDraggable={activeTool === "select"}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeDragThreshold={8}
        onNodesDelete={onNodesDelete}
        fitView
      >
        <Background variant={bgVariant} />
        <Controls showZoom={true} showFitView={false} showInteractive={false} />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
}
