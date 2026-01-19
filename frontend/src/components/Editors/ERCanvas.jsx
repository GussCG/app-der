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
import { derToReactFlow } from "../../utils/derToReactFlow.js";
import EREntityNode from "../Nodes/ER/EREntityNode.jsx";
import ERRelationNode from "../Nodes/ER/ERRelationNode.jsx";
import ERCardinalityEdge from "../Nodes/ER/ERCardinalityEdge.jsx";

const nodeTypes = {
  entity: EREntityNode,
  relation: ERRelationNode,
};

const edgeTypes = {
  er: ERCardinalityEdge,
};

export default function ERCanvas() {
  const {
    diagram,
    applyChange,
    setSelectedElementIds,
    bgVariant,
    deleteElementsDiagram,
    selectedElementIds,
  } = useEditor();
  const { activeTool, setActiveTool } = useTool();
  const { fitView, screenToFlowPosition } = useReactFlow();

  const isSyncingRef = useRef(false);
  const lastDiagramIdRef = useRef(null);

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

  useEffect(() => {
    if (isSyncingRef.current) return;

    const { nodes: newNodes, edges: newEdges } = derToReactFlow(diagram);

    const validERIds = new Set([
      ...diagram.entities.map((e) => e.id),
      ...diagram.relations.map((r) => r.id),
      ...newEdges.map((e) => e.id),
    ]);

    setNodes((currentNodes) =>
      newNodes.map((newNode) => {
        const existing = currentNodes.find((n) => n.id === newNode.id);
        return {
          ...newNode,
          position: existing ? existing.position : newNode.position,
          selected:
            selectedElementIds.includes(newNode.id) &&
            validERIds.has(newNode.id),
        };
      }),
    );

    setEdges(
      newEdges.map((edge) => ({
        ...edge,
        selected:
          selectedElementIds.includes(edge.id) && validERIds.has(edge.id),
      })),
    );

    // 2. Lógica de Auto-Fit (NUEVA)
    const isNewDiagram = lastDiagramIdRef.current !== diagram;
    const hasContent = diagram.entities.length > 0;

    if (isNewDiagram && hasContent) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 50);
    }

    lastDiagramIdRef.current = diagram;
  }, [diagram, selectedElementIds, fitView]);

  const onSelectionChange = useCallback(
    ({ nodes: selNodes }) => {
      const newIds = selNodes.map((n) => n.id);
      setSelectedElementIds((prev) => {
        if (
          prev.length === newIds.length &&
          prev.every((id) => newIds.includes(id))
        )
          return prev;
        return newIds;
      });
    },
    [setSelectedElementIds],
  );

  const onNodeDragStop = useCallback(
    (event, node, draggedNodes) => {
      if (draggedNodes.length === 0) return;

      isSyncingRef.current = true;

      applyChange({
        ...diagram,
        entities: diagram.entities.map((e) =>
          draggedNodes.find((n) => n.id === e.id)
            ? {
                ...e,
                position: draggedNodes.find((n) => n.id === e.id).position,
              }
            : e,
        ),
        relations: diagram.relations.map((r) =>
          draggedNodes.find((n) => n.id === r.id)
            ? {
                ...r,
                position: draggedNodes.find((n) => n.id === r.id).position,
              }
            : r,
        ),
      });

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 100);
    },
    [applyChange, diagram],
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
    <div className="editor__canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={activeTool === "select"}
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
