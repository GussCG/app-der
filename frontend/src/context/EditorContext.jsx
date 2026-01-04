import { createContext, useContext, useMemo, useState } from "react";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [diagram, setDiagram] = useState({
    entities: [],
    relations: [],
  });

  const [selectedElementId, setSelectedElementId] = useState(null);

  const selectedElement = useMemo(() => {
    if (!selectedElementId) return null;

    const entity = diagram.entities.find((e) => e.id === selectedElementId);
    if (entity) {
      return {
        id: entity.id,
        kind: "entity",
        data: entity.data,
      };
    }

    const relation = diagram.relations.find((r) => r.id === selectedElementId);
    if (relation) {
      return {
        id: relation.id,
        kind: "relation",
        data: relation.data,
      };
    }

    return null;
  }, [selectedElementId, diagram]);

  const updateElement = (updated) => {
    setDiagram((prev) => {
      if (updated.kind === "entity") {
        return {
          ...prev,
          entities: prev.entities.map((e) =>
            e.id === updated.id
              ? {
                  ...e, // mantiene id, position, type
                  data: updated.data,
                }
              : e
          ),
        };
      }

      if (updated.kind === "relation") {
        return {
          ...prev,
          relations: prev.relations.map((r) =>
            r.id === updated.id
              ? {
                  ...r,
                  data: updated.data,
                }
              : r
          ),
        };
      }

      return prev;
    });
  };

  return (
    <EditorContext.Provider
      value={{
        diagram,
        setDiagram,
        selectedElement,
        selectedElementId,
        setSelectedElementId,
        updateElement,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
