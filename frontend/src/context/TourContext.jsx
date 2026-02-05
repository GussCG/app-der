import React, { createContext, useContext, useState } from "react";
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

  const startTutorial = async () => {
    setIsLoading(true);
    setIsTourActive(true);
    setMode("er");

    try {
      const response = await fetch("/tour/DiagramaTour.der");
      if (!response.ok) throw new Error("Error al cargar");

      const erTutorial = await response.json();

      loadDiagramFromObject({
        diagram: erTutorial.diagram,
        name: erTutorial.name,
        relationalMeta: erTutorial.relationalMeta,
      });

      setTimeout(() => {
        setIsLoading(false);
        startTutorialTour({
          setMode,
          onFinish: () => {
            setIsTourActive(false);
            createNewDiagram();
            setMode("er");
          },
        });
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsTourActive(false);
    }
  };

  const finishAndClean = () => {
    createNewDiagram();
    setMode("er");
    setShowFinishModal(false);
  };

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
