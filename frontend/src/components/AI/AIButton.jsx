import { useRef } from "react";
import Icons from "../Others/IconProvider.jsx";

const { RiChatAiLine } = Icons;

function AIButton({ onClick, active }) {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      className={`ai__button ${active ? "active" : ""}`}
      onClick={handleClick}
      ref={buttonRef}
      style={{
        zIndex: 40,
        opacity: active ? 0 : 1,
        pointerEvents: active ? "none" : "auto",
      }}
    >
      <RiChatAiLine />
    </button>
  );
}

export default AIButton;
