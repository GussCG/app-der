import { useEffect, useRef, useCallback, useMemo, act } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  SelectionMode,
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
    relationalPositions,
    updateRelationalPosition,
  } = useEditor();
  const { activeTool } = useTool();

  const relationalData = useMemo(
    () => derToRelational(diagram, relationalPositions),
    [diagram, relationalPositions],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(
    relationalData.nodes.map((n) => ({ ...n, type: "relationalTable" })),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    relationalData.edges.map((e) => ({ ...e, type: "relationalEdge" })),
  );

  useEffect(() => {
    const validRelationalIds = new Set(relationalData.nodes.map((n) => n.id));

    setNodes((currentNodes) =>
      relationalData.nodes.map((newNode) => {
        const existing = currentNodes.find((n) => n.id === newNode.id);
        return {
          ...newNode,
          type: "relationalTable",
          position: existing ? existing.position : newNode.position,
          selected:
            selectedElementIds.includes(newNode.id) &&
            validRelationalIds.has(newNode.id),
        };
      }),
    );
    setEdges(
      relationalData.edges.map((e) => ({
        ...e,
        selected: selectedElementIds.includes(e.id),
      })),
    );
  }, [relationalData, selectedElementIds]);

  const onNodeDragStop = useCallback(
    (event, node) => {
      // Guardamos la posición en el estado volátil del contexto
      updateRelationalPosition(node.id, node.position);
    },
    [updateRelationalPosition],
  );

  return (
    <div className="editor__canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={onEdgesChange}
        nodesDraggable={activeTool === "select"}
        elementsSelectable={activeTool === "select"}
        panOnDrag={activeTool === "pan"}
        nodesConnectable={false}
        onSelectionChange={undefined}
        fitView
      >
        <Background variant={bgVariant} />
        <Controls showZoom={true} showFitView={false} showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default RelationalCanvas;
