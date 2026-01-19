import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { saveDERFile, openDERFile } from "../utils/derFile";
import { validateDiagram } from "../utils/validation/validateDiagram";

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

  const createNewDiagram = () => {
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
    setIsDirty(false);
  };

  const openDiagram = () => {
    openDERFile({
      onLoad: ({ diagram, name }) => {
        setHistory({
          past: [],
          present: diagram,
          future: [],
        });
        setDiagramName(name || "Sin nombre");
        setIsDirty(false);
        setSelectedElementIds([]);
        setValidationState("idle");
        setValidationErrors([]);
      },
    });
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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

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
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
