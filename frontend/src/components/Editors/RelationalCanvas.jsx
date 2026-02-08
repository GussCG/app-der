import { useEffect, useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import RelationalTableNode from "../Nodes/Relational/RelationalTableNode";
import RelationalEdge from "../Nodes/Relational/RelationalEdge";
import { useEditor } from "../../context/EditorContext";
import { useTool } from "../../context/ToolContext";
import { derToRelational } from "../../utils/derToRelational";
import { getSmartHandles } from "../../utils/relational/relSmartHandles";

const nodeTypes = {
  relationalTable: RelationalTableNode,
};

const edgeTypes = {
  relationalEdge: RelationalEdge,
};

function RelationalCanvas() {
  const {
    diagram,
    bgVariant,
    selectedElementIds,
    setSelectedElementIds,
    relationalPositions,
    updateRelationalPosition,
    relationalOverrides,
  } = useEditor();

  const { activeTool } = useTool();
  const { fitView, getNodes } = useReactFlow();
  const isSyncingRef = useRef(false);
  const selectedIdsRef = useRef([]);

  useEffect(() => {
    selectedIdsRef.current = selectedElementIds;
  }, [selectedElementIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const initialFitDoneRef = useRef(false);
  const diagramChangedRef = useRef(false);

  useEffect(() => {
    if (isSyncingRef.current) return;

    const { nodes: finalNodes, edges: finalEdges } = derToRelational(
      diagram,
      relationalPositions,
      relationalOverrides,
    );

    setNodes((prevNodes) => {
      return finalNodes.map((n) => ({
        ...n,
        type: "relationalTable",
        position: relationalPositions[n.id] || n.position || { x: 0, y: 0 },
        selected: selectedIdsRef.current.includes(n.id),
      }));
    });

    setEdges(
      finalEdges.map((e) => ({
        ...e,
        type: "relationalEdge",
        source: String(e.source),
        target: String(e.target),
      })),
    );

    diagramChangedRef.current = true;
  }, [diagram, relationalPositions, relationalOverrides]);

  useEffect(() => {
    if (
      nodes.length > 0 &&
      (!initialFitDoneRef.current || diagramChangedRef.current)
    ) {
      setTimeout(() => {
        fitView({
          padding: 0.3,
          duration: 300,
          minZoom: 0.1,
          maxZoom: 2,
          includeHiddenNodes: false,
        });
        initialFitDoneRef.current = true;
        diagramChangedRef.current = false;
      }, 150);
    }
  }, [nodes.length, fitView]);

  const onSelectionChange = useCallback(
    ({ nodes: selNodes, edges: selEdges }) => {
      const ids = [...selNodes.map((n) => n.id), ...selEdges.map((e) => e.id)];

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
    (event, node) => {
      isSyncingRef.current = true;
      updateRelationalPosition(node.id, node.position);

      // Liberar el bloqueo de sincronización después de un breve delay
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 150);
    },
    [updateRelationalPosition],
  );

  const onPaneClick = useCallback(() => {
    setSelectedElementIds([]);
  }, [setSelectedElementIds]);

  const onNodeDrag = useCallback(
    (event, node, draggedNodes) => {
      setEdges((eds) => {
        const allNodes = getNodes();
        const nodeMap = new Map(allNodes.map((n) => [n.id, n]));

        return eds.map((e) => {
          const isAffected = draggedNodes.some(
            (dn) => dn.id === e.source || dn.id === e.target,
          );
          if (!isAffected) return e;

          const sourceNode = nodeMap.get(e.source);
          const targetNode = nodeMap.get(e.target);

          if (!sourceNode || !targetNode) return e;

          const { sourceHandle, targetHandle } = getSmartHandles(
            sourceNode,
            targetNode,
          );

          return {
            ...e,
            sourceHandle,
            targetHandle,
          };
        });
      });
    },
    [getNodes, setEdges],
  );

  return (
    <div className="editor__canvas" data-tour="relational-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        nodesDraggable={activeTool === "select"}
        elementsSelectable={activeTool === "select"}
        panOnDrag={activeTool === "pan"}
        nodesConnectable={false}
      >
        <Background variant={bgVariant} />
        <Controls showZoom={true} showFitView={false} showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default RelationalCanvas;
