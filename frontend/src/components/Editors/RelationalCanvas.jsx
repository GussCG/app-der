import { useEffect, useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import RelationalTableNode from "../Nodes/Relational/RelationalTableNode";
import RelationalEdge from "../Nodes/Relational/RelationalEdge";
import { useEditor } from "../../context/EditorContext";
import { useTool } from "../../context/ToolContext";
import { derToRelational } from "../../utils/derToRelational";

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

  const isSyncingRef = useRef(false);
  const selectedIdsRef = useRef([]);

  useEffect(() => {
    selectedIdsRef.current = selectedElementIds;
  }, [selectedElementIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (isSyncingRef.current) return;

    const { nodes: finalNodes, edges: finalEdges } = derToRelational(
      diagram,
      relationalPositions,
      relationalOverrides,
    );

    setNodes(
      finalNodes.map((n) => ({
        ...n,
        type: "relationalTable",
        position: {
          x: Number.isFinite(n.position?.x) ? n.position.x : 0,
          y: Number.isFinite(n.position?.y) ? n.position.y : 0,
        },
        selected: selectedIdsRef.current.includes(n.id),
      })),
    );

    setEdges(
      finalEdges.map((e) => ({
        ...e,
        type: "relationalEdge",
        source: String(e.source),
        target: String(e.target),
      })),
    );
  }, [diagram, relationalPositions, relationalOverrides]);

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
      }, 100);
    },
    [updateRelationalPosition],
  );

  const onPaneClick = useCallback(() => {
    setSelectedElementIds([]);
  }, [setSelectedElementIds]);

  return (
    <div className="editor__canvas" data-tour="relational-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        nodesDraggable={activeTool === "select"}
        elementsSelectable={activeTool === "select"}
        panOnDrag={activeTool === "pan"}
        nodesConnectable={false}
        fitView={nodes.length > 0}
      >
        {nodes.length > 0 && <Background variant={bgVariant} />}
        <Controls showZoom={true} showFitView={false} showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default RelationalCanvas;
