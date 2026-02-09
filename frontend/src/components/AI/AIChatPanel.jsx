import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "../Others/IconProvider.jsx";
import AIMessage from "./AIMessage.jsx";
import AILoader from "./AILoader.jsx";

const { IoClose, FaArrowUp, FaArrowDown } = Icons;

function AIChatPanel({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hola, soy tu asistente de inteligencia artificial. ¿En qué puedo ayudarte con tu diagrama ER?",
    },
  ]);

  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBtn(isFarFromBottom);
  };

  function sendMessage() {
    if (thinking) return;
    if (!input.trim()) return;

    const text = input;

    setMessages((msgs) => [...msgs, { role: "user", text }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      setMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          text: "¡Gracias por tu mensaje! Estoy procesando tu solicitud.",
        },
      ]);
    }, 2000);
  }

  function handleChange(e) {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  if (!open) return null;

  return (
    <div className="ai__panel">
      <header className="ai__header">
        <h2>AppDER-IA</h2>
        <button className="ai__close-button" onClick={onClose}>
          <IoClose />
        </button>
      </header>

      <div className="ai__messages" ref={containerRef} onScroll={handleScroll}>
        {messages.map((msg, i) => (
          <AIMessage key={i} {...msg} />
        ))}
        {thinking && <AILoader />}

        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            className="ai__scroll-button"
            onClick={scrollToBottom}
            initial={{ opacity: 0, y: 10, x: "50%" }}
            animate={{ opacity: 1, y: 0, x: "50%" }}
            exit={{ opacity: 0, y: 10, x: "50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <FaArrowDown />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="ai__input">
        <textarea
          rows={1}
          value={input}
          disabled={thinking}
          placeholder={
            thinking ? "Espera un momento..." : "Escribe tu mensaje..."
          }
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (thinking) return;
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className={"ai__chat-button"}
          onClick={sendMessage}
          disabled={thinking}
        >
          <FaArrowUp />
        </button>
      </footer>
    </div>
  );
}

export default AIChatPanel;
