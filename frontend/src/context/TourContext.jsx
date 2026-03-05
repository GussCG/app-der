import React, { createContext, useContext, useState, useCallback } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useEditor } from "./EditorContext";
import { startTutorialTour } from "../utils/tour/tutorialTour";
import { useEditorMode } from "./EditorModeContext";

const TourContext = createContext();

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff64f7" />
            <stop offset="100%" stopColor="#00c8ff" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={48}
        thickness={5}
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </React.Fragment>
  );
}

export function TourProvider({ children }) {
  const { loadDiagramFromObject, createNewDiagram } = useEditor();
  const { setMode } = useEditorMode();

  const [isTourActive, setIsTourActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const startTutorial = useCallback(async () => {
    setIsLoading(true);
    setIsTourActive(true);

    setMode("er", true);

    try {
      const response = await fetch("/tour/DiagramaTour.der");
      if (!response.ok) throw new Error("Error al cargar el tutorial");

      const erTutorial = await response.json();

      loadDiagramFromObject({
        diagram: erTutorial.diagram,
        name: erTutorial.name,
        relationalMeta: erTutorial.relationalMeta,
      });

      setTimeout(() => {
        setIsLoading(false);

        startTutorialTour({
          setMode: (mode, force = true) => setMode(mode, force),
          onFinish: () => {
            setIsTourActive(false);
            setIsLoading(false);

            createNewDiagram();
            requestAnimationFrame(() => {
              setMode("er", true);
            });
          },
        });
      }, 1500);
    } catch (error) {
      console.error("Error al cargar tutorial:", error);
      setIsLoading(false);
      setIsTourActive(false);
      setMode("er");
    }
  }, [loadDiagramFromObject, createNewDiagram, setMode]);

  const finishAndClean = useCallback(() => {
    createNewDiagram();
    setMode("er");
    setShowFinishModal(false);
  }, [createNewDiagram, setMode]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        startTutorial,
        showFinishModal,
        setShowFinishModal,
        finishAndClean,
      }}
    >
      {children}
      {isLoading && (
        <div className="tour-loading-overlay">
          <div className="tour-loader-content">
            <GradientCircularProgress />
            <span>Cargando tutorial...</span>
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
}

export const useTour = () => useContext(TourContext);
