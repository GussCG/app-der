import React from "react";

function AIMessage({ role, text }) {
  return <div className={`ai__message ai__message--${role}`}>{text}</div>;
}

export default AIMessage;
