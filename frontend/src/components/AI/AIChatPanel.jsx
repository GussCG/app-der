import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "../Others/IconProvider.jsx";
import AIMessage from "./AIMessage.jsx";
import AILoader from "./AILoader.jsx";
import { useEditor } from "../../context/EditorContext.jsx";

const { IoClose, FaArrowDown, TbWand, TbWandOff } = Icons;

const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 420;

function AIChatPanel({ open, onClose, originPosition }) {
  const { askAI } = useEditor();

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
  const panelRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, thinking, open]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBtn(isFarFromBottom);
  };

  async function sendMessage() {
    if (thinking) return;
    if (!input.trim()) return;

    const text = input;

    setMessages((msgs) => [...msgs, { role: "user", text }]);
    setInput("");
    setThinking(true);

    if (containerRef.current) {
      const textarea = containerRef.current.querySelector("textarea");
      if (textarea) textarea.style.height = "auto";
    }

    try {
      await askAI(text);

      setMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          text: "¡Diagrama actualizado correctamente! He aplicado los cambios que solicitaste.",
        },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          text: "Ocurrió un error al comunicarse con la IA. Intenta de nuevo.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function handleChange(e) {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  if (!open && !originPosition) return null;

  const finalX = originPosition
    ? originPosition.x - PANEL_WIDTH + originPosition.width
    : 60;
  const finalY = originPosition ? originPosition.y : 100;

  return (
    <motion.div
      className="ai__panel"
      ref={panelRef}
      initial={{
        opacity: 0,
        scale: 0.5,
        x: originPosition?.x || 0,
        y: originPosition?.y || 0,
        width: originPosition?.width || 40,
        height: originPosition?.height || 40,
        transformOrigin: "top right",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: finalX,
        y: finalY,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        x: originPosition?.x || 0,
        y: originPosition?.y || 0,
        width: originPosition?.width || 40,
        height: originPosition?.height || 40,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25,
      }}
      style={{ isolation: "isolate" }}
    >
      <motion.div
        className="ai__panel-content-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        style={{
          display: "grid",
          gridTemplateRows: "60px minmax(0, 1fr) auto",
          gridTemplateAreas: '"header" "content" "footer"',
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <header className="ai__header">
          <h2>AppDER-IA</h2>
          <button className="ai__close-button" onClick={onClose}>
            <IoClose />
          </button>
        </header>

        <div
          className="ai__messages"
          ref={containerRef}
          onScroll={handleScroll}
        >
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
            {thinking ? <TbWandOff /> : <TbWand />}
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default AIChatPanel;
