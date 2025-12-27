import { useState } from "react";
import BarraEntidades from "../components/BarraElementos/BarraElementos";
import BarraNav from "../components/BarraNavegacion/BarraNav";
import BarraInspector from "../components/BarraInspector/BarraInspector";
import BarraHerramientas from "../components/BarraHerramientas/BarraHerramientas";

function SQLayout() {
  const [panels, setPanels] = useState({
    entidades: false,
    herramientas: false,
    inspector: false,
  });

  const togglePanel = (name) => {
    setPanels((p) => ({ ...p, [name]: !p[name] }));
  };

  return (
    <div className="app__layout relational">
      <BarraEntidades
        hidden={panels.entidades}
        onToggle={() => togglePanel("entidades")}
      />
      <BarraNav />
      <BarraInspector
        hidden={panels.inspector}
        onToggle={() => togglePanel("inspector")}
      />
      <BarraHerramientas />
    </div>
  );
}

export default SQLayout;
