import { useState } from "react";
import BarraElementos from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";
import ERCanvas from "../components/Editors/ERCanvas";
import { ReactFlowProvider } from "reactflow";

function ERLayout() {
  const [panels, setPanels] = useState({
    elementos: false,
    herramientas: false,
    inspector: true,
  });

  const togglePanel = (name) => {
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  return (
    <ReactFlowProvider>
      <div className="app__layout relational">
        <BarraElementos
          hidden={panels.elementos}
          onToggle={() => togglePanel("elementos")}
        />
        <BarraNav />
        <BarraInspector
          hidden={panels.inspector}
          onToggle={() => togglePanel("inspector")}
        />
        <BarraHerramientas />
        <ERCanvas />
      </div>
    </ReactFlowProvider>
  );
}

export default ERLayout;
