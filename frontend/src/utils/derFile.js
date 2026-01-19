export const saveDERFile = ({ diagram, diagramName }) => {
  const content = {
    version: "1.0",
    type: "DER",
    name: diagramName || "newDiagram",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    diagram: diagram,
  };

  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${(diagramName || "newDiagram").trim()}.der`;
  a.click();

  URL.revokeObjectURL(url);
};

export const openDERFile = ({ onLoad }) => {
  if (typeof onLoad !== "function") {
    throw new Error("onLoad must be a function");
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".der,application/json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result);

      if (data.type !== "DER") {
        alert("Archivo inválido");
        return;
      }

      onLoad({
        diagram: data.diagram,
        name: data.name,
      });
    };

    reader.readAsText(file);
  };

  input.click();
};
