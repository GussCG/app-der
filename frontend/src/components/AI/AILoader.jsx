import React from "react";

function AILoader() {
  return (
    <div className="ai__loader">
      <span className="ai__loader-text">Generando</span>
      <span className="ai__dots">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

export default AILoader;
