import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

import { useEffect, useRef } from "react";

import { useEditor } from "../../context/EditorContext";
import { useTool } from "../../context/ToolContext";
import { derToReactFlow } from "../../utils/derToReactFlow.js";

export default function ERCanvas() {
  const flowRef = useRef(null);

  const { diagram, setDiagram, setSelectedElementId } = useEditor();
  const { activeTool, setActiveTool } = useTool();
  const { fitView, screenToFlowPosition } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = derToReactFlow(diagram);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = (_, node) => {
    setSelectedElementId(node.id);
  };

  const onNodeDragStop = (_, node) => {
    setDiagram((prev) => ({
      ...prev,
      entities: prev.entities.map((entity) =>
        entity.id === node.id ? { ...entity, position: node.position } : entity
      ),
    }));
  };

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
          attributes: [],
        },
      };

      // Agregar entidad al diagrama
      setDiagram((prev) => ({
        ...prev,
        entities: [...prev.entities, newEntity],
      }));
    } else if (activeTool === "relation") {
      // Crear relación
      const newRelation = {
        id: crypto.randomUUID(),
        position: position,
        type: "relation",
        data: {
          name: "Nueva Relación",
          connections: {
            source: {
              entityId: null,
              entityName: "",
              cardinality: "1",
            },
            target: {
              entityId: null,
              entityName: "",
              cardinality: "1",
            },
          },
        },
      };

      // Agregar relación al diagrama
      setDiagram((prev) => ({
        ...prev,
        relations: [...prev.relations, newRelation],
      }));
    }

    setActiveTool("select");
  };

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = derToReactFlow(diagram);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [diagram]);

  return (
    <div className="editor__canvas">
      <ReactFlow
        onInit={(instance) => {
          flowRef.current = instance;
        }}
        onPaneClick={onPaneClick}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={activeTool === "select" ? true : false}
        panOnDrag={activeTool === "pan" ? true : false}
      >
        <Background />
        <Controls showZoom={true} showFitView={false} showInteractive={false} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
