import { useRef } from "react";
import Icons from "../Others/IconProvider.jsx";

const { RiChatAiLine } = Icons;

function AIButton({ onClick, active }) {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const mainRect = document
      .querySelector(".editor__canvas")
      .getBoundingClientRect();

    onClick({
      x: buttonRect.left - mainRect.left,
      y: buttonRect.top - mainRect.top,
      width: buttonRect.width,
      height: buttonRect.height,
    });
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
