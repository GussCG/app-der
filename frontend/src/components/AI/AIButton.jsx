import React from "react";
import Icons from "../Others/IconProvider.jsx";

const { RiAiGenerate } = Icons;

function AIButton({ onClick }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Evita que el evento se propague
    onClick();
  };
  return (
    <button className="ai__button" onClick={handleClick}>
      <RiAiGenerate />
    </button>
  );
}

export default AIButton;
