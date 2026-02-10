import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { saveDERFile, openDERFile } from "../utils/derFile";
import { validateDiagram } from "../utils/validation/validateDiagram";
import { autoLayoutERDiagram } from "../utils/autolayout/autoLayoutELK";
import { DER_SCHEMA_PROMPT } from "../utils/ai/DiagramSchema";
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const EditorContext = createContext();

const EMPTY_DIAGRAM = {
  entities: [],
  relations: [],
};

export function EditorProvider({ children }) {
  const [history, setHistory] = useState({
    past: [],
    present: EMPTY_DIAGRAM,
    future: [],
  });

  const diagram = history.present;
  const [diagramName, setDiagramName] = useState("Sin nombre");
  const [isDirty, setIsDirty] = useState(false);

  const [selectedElementIds, setSelectedElementIds] = useState([]);
  const [bgVariant, setBgVariant] = useState("dots");

  const [showLimitModal, setShowLimitModal] = useState(false);

  const [validationState, setValidationState] = useState("idle"); // idle | validating | valid | invalid
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationProgress, setValidationProgress] = useState(0);

  const [isRelationCreationModalOpen, setIsRelationCreationModalOpen] =
    useState(false);

  const [relationalPositions, setRelationalPositions] = useState({});

  const [relationalOverrides, setRelationalOverrides] = useState({});

  const [isAutoLayouting, setIsAutoLayouting] = useState(false);

  const updateRelationalOverride = (table, column, patch) => {
    setRelationalOverrides((prev) => ({
      ...prev,
      [table]: {
        ...prev[table],
        [column]: {
          ...prev[table]?.[column],
          ...patch,
        },
      },
    }));
    setIsDirty(true);
  };

  const updateRelationalPosition = (id, position) => {
    setRelationalPositions((prev) => ({
      ...prev,
      [id]: position,
    }));
    setIsDirty(true);
  };

  const createNewDiagram = () => {
    localStorage.removeItem("autosave-der");
    setHistory({
      past: [],
      present: EMPTY_DIAGRAM,
      future: [],
    });
    setDiagramName("Sin nombre");
    setIsDirty(false);
    setSelectedElementIds([]);
    setValidationState("idle");
    setValidationErrors([]);
  };

  const applyChange = (newDiagram) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newDiagram,
      future: [],
    }));

    setIsDirty(true);
    setValidationState("idle");
    setValidationErrors([]);
  };

  const undo = () => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past.at(-1);
      const newPast = prev.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });

    setSelectedElementIds([]);
  };

  const redo = () => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });

    setSelectedElementIds([]);
  };

  const selectedElement = useMemo(() => {
    if (selectedElementIds.length !== 1) return null;

    const entity = diagram.entities.find((e) => e.id === selectedElementIds[0]);
    if (entity) {
      return {
        id: entity.id,
        kind: "entity",
        data: entity.data,
      };
    }

    const relation = diagram.relations.find(
      (r) => r.id === selectedElementIds[0],
    );
    if (relation) {
      return {
        id: relation.id,
        kind: "relation",
        data: relation.data,
      };
    }

    return null;
  }, [selectedElementIds, diagram]);

  const updateElement = (updated) => {
    applyChange({
      ...diagram,
      entities:
        updated.kind === "entity"
          ? diagram.entities.map((e) =>
              e.id === updated.id ? { ...e, data: updated.data } : e,
            )
          : diagram.entities,
      relations:
        updated.kind === "relation"
          ? diagram.relations.map((r) =>
              r.id === updated.id ? { ...r, data: updated.data } : r,
            )
          : diagram.relations,
    });
  };

  const deleteElementsDiagram = (elementIds) => {
    const ids = new Set(elementIds);

    applyChange({
      entities: diagram.entities.filter((entity) => !ids.has(entity.id)),
      relations: diagram.relations.filter((relation) => {
        // borrar relaciones seleccionadas
        if (ids.has(relation.id)) return false;

        // borrar relaciones conectadas a entidades borradas
        const { source, target } = relation.data.connections || {};
        const connectedToDeletedEntity =
          ids.has(source?.entityId) || ids.has(target?.entityId);

        return !connectedToDeletedEntity;
      }),
    });

    setSelectedElementIds([]);
  };

  const duplicateSelectedElements = () => {
    if (selectedElementIds.length > 1) {
      setShowLimitModal(true);
      return;
    }

    if (selectedElementIds.length === 0) return;

    const ids = new Set(selectedElementIds);

    const duplicatedEntities = diagram.entities
      .filter((e) => ids.has(e.id))
      .map((e) => ({
        ...e,
        id: crypto.randomUUID(),
        position: {
          x: e.position.x + 20,
          y: e.position.y + 20,
        },
      }));

    const duplicatedRelations = diagram.relations
      .filter((r) => ids.has(r.id))
      .map((r) => ({
        ...r,
        id: crypto.randomUUID(),
        position: {
          x: r.position.x + 20,
          y: r.position.y + 20,
        },
      }));

    applyChange({
      ...diagram,
      entities: [...diagram.entities, ...duplicatedEntities],
      relations: [...diagram.relations, ...duplicatedRelations],
    });

    setSelectedElementIds([
      ...duplicatedEntities.map((e) => e.id),
      ...duplicatedRelations.map((r) => r.id),
    ]);
  };

  const saveDiagram = () => {
    saveDERFile({ diagram, diagramName });
    localStorage.removeItem("autosave-der");
    setIsDirty(false);
  };

  const openDiagram = () => {
    openDERFile({
      onLoad: ({ diagram, name, relationalMeta }) => {
        localStorage.removeItem("autosave-der");
        setHistory({
          past: [],
          present: diagram,
          future: [],
        });
        setDiagramName(name || "Sin nombre");

        setRelationalPositions(relationalMeta?.positions || {});
        setRelationalOverrides(relationalMeta?.overrides || {});

        setIsDirty(false);
        setSelectedElementIds([]);
        setValidationState("idle");
        setValidationErrors([]);
      },
    });
  };

  const loadDiagramFromObject = ({
    diagram,
    name = "Sin nombre",
    relationalMeta = {},
  }) => {
    localStorage.removeItem("autosave-der");

    setHistory({
      past: [],
      present: diagram ?? EMPTY_DIAGRAM,
      future: [],
    });

    setDiagramName(name);
    setRelationalPositions(relationalMeta?.positions || {});
    setRelationalOverrides(relationalMeta?.overrides || {});

    setIsDirty(false);
    setSelectedElementIds([]);
    setValidationState("idle");
    setValidationErrors([]);
  };

  const validateCurrentDiagram = async () => {
    setValidationState("validating");
    setValidationProgress(0);

    const steps = [20, 40, 60, 80, 100];
    for (const p of steps) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setValidationProgress(p);
    }

    const errors = validateDiagram(diagram);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationState("invalid");
    } else {
      setValidationErrors([]);
      setValidationState("valid");
    }

    return errors.length === 0;
  };

  const autoLayoutDiagram = async () => {
    setIsAutoLayouting(true);
    const layouted = await autoLayoutERDiagram(diagram);
    applyChange(layouted);
    setTimeout(() => setIsAutoLayouting(false), 0);
  };

  const usedColors = useMemo(() => {
    const colors = new Set();

    diagram.entities.forEach((e) => {
      if (e.data?.color) {
        colors.add(e.data.color.toLowerCase());
      }
    });

    diagram.relations.forEach((r) => {
      if (r.data?.color) {
        colors.add(r.data.color.toLowerCase());
      }
    });

    return [...colors];
  }, [diagram]);

  const [importedRelationalData, setImportedRelationalData] = useState(null);
  const importRelationalData = (nodes, edges) => {
    // 1. Mapear Entidades
    const newEntities = nodes.map((node) => ({
      id: node.id,
      type: "entity",
      position: node.position,
      data: {
        name: node.data.name,
        weak: false,
        color: node.data.color || "#323c4c",
        // Los atributos ahora llevan todo el peso de la data
        attributes: node.data.columns.map((col) => ({
          ...col,
          // Forzamos consistencia
          pk: !!col.pk || !!col.isPk,
          kind: col.kind || "simple",
        })),
      },
    }));

    // 2. Mapear Relaciones (Rombos)
    const newRelations = edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      // Intentar calcular posición media para el rombo
      const posX = (sourceNode?.position.x + targetNode?.position.x) / 2 || 100;
      const posY = (sourceNode?.position.y + targetNode?.position.y) / 2 || 100;

      return {
        id: edge.id || crypto.randomUUID(),
        type: "relation",
        position: { x: posX + 50, y: posY + 50 },
        data: {
          name: "Relación",
          color: "#323c4c",
          connections: {
            source: {
              entityId: edge.source,
              cardinality: "1",
              participation: "total",
            },
            target: {
              entityId: edge.target,
              cardinality: "N",
              participation: "partial",
            },
          },
        },
      };
    });

    // 3. Aplicar al historial
    applyChange({
      entities: newEntities,
      relations: newRelations,
    });

    setImportedRelationalData(null);
  };

  useEffect(() => {
    const raw = localStorage.getItem("autosave-der");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      setHistory({
        past: [],
        present: parsed.diagram ?? EMPTY_DIAGRAM,
        future: [],
      });

      setDiagramName(parsed.diagramName ?? "Sin nombre");
      setRelationalPositions(parsed.relationalPositions ?? {});
      setRelationalOverrides(parsed.relationalOverrides ?? {});
      setIsDirty(true);
    } catch (e) {
      console.warn("Autosave corrupto, ignorado");
    }
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const payload = {
      diagram,
      diagramName,
      relationalPositions,
      relationalOverrides,
    };

    localStorage.setItem("autosave-der", JSON.stringify(payload));
  }, [diagram, diagramName, relationalPositions, relationalOverrides, isDirty]);

  const [isAILoading, setIsAILoading] = useState(false);
  const askAI = async (instruction) => {
    if (!ai) throw new Error("API key de Gemini no configurada");

    setIsAILoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: DER_SCHEMA_PROMPT },
              { text: `DIAGRAMA ACTUAL: ${JSON.stringify(diagram)}` },
              { text: `INSTRUCCIÓN: ${instruction}` },
            ],
          },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      let text = response.text;
      if (!text) throw new Error("Respuesta vacía del modelo");

      const cleanedText = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanedText);
      const newEntities = result.diagram?.entities || result.entities;
      const newRelations = result.diagram?.relations || result.relations;

      if (newEntities) {
        applyChange({
          ...diagram,
          entities: newEntities,
          relations: newRelations || [],
        });
      }
    } catch (e) {
      console.error("Error al comunicarse con la API de Gemini:", e);
      throw e;
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <EditorContext.Provider
      value={{
        diagram,
        diagramName,
        setDiagramName,
        isDirty,
        setIsDirty,
        saveDiagram,
        openDiagram,
        loadDiagramFromObject,
        createNewDiagram,

        selectedElement,
        selectedElementIds,
        setSelectedElementIds,

        updateElement,
        deleteElementsDiagram,
        applyChange,
        duplicateSelectedElements,

        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,

        bgVariant,
        setBgVariant,

        showLimitModal,
        setShowLimitModal,

        validationState,
        setValidationState,
        validationErrors,
        setValidationErrors,
        validateCurrentDiagram,
        validationProgress,

        isRelationCreationModalOpen,
        setIsRelationCreationModalOpen,

        relationalPositions,
        updateRelationalPosition,

        relationalOverrides,
        updateRelationalOverride,

        autoLayoutDiagram,
        isAutoLayouting,
        setIsAutoLayouting,

        usedColors,

        importedRelationalData,
        setImportedRelationalData,
        importRelationalData,

        isAILoading,
        askAI,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
