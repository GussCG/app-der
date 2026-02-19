import { useState, useEffect, useRef } from "react";
import { useEditor } from "../../../context/EditorContext.jsx";
import { Compact } from "@uiw/react-color";
import { hsvaToRgbaString, rgbaToHsva } from "@uiw/color-convert";
import { Colorful } from "@uiw/react-color";
import { AnimatePresence, motion } from "framer-motion";
import { allFonts } from "../../../constants/fonts.js";
import Icons from "../../Others/IconProvider.jsx";

const {
  CiTextAlignCenter,
  CiTextAlignJustify,
  CiTextAlignLeft,
  CiTextAlignRight,
  PiTextBBold,
  PiTextItalicBold,
  IoClose,
  FaLink,
  FaLock,
} = Icons;

const parseRgba = (colorString) => {
  if (!colorString) return null;

  // Si es un color hexadecimal o rgb, convertir a rgba
  const tempDiv = document.createElement("div");
  tempDiv.style.color = colorString;
  document.body.appendChild(tempDiv);
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  // Parsear rgba(r, g, b, a)
  const match = computedColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)/,
  );
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1,
    };
  }
  return null;
};

const rgbaToHsvaManual = (r, g, b, a = 1) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: a,
  };
};

const createDefaultHsva = (colorType = "text") => {
  switch (colorType) {
    case "text":
      return { h: 0, s: 0, v: 0, a: 1 }; // Negro
    case "background":
      return { h: 60, s: 100, v: 100, a: 1 }; // Amarillo
    case "border":
      return { h: 0, s: 0, v: 0, a: 1 }; // Negro
    default:
      return { h: 0, s: 0, v: 0, a: 1 };
  }
};

const safeColorToHsva = (colorString, defaultValue = "text") => {
  if (!colorString) return createDefaultHsva(defaultValue);

  try {
    // Intentar con la librería primero
    const hsva = rgbaToHsva(colorString);
    if (hsva && !isNaN(hsva.v)) {
      return {
        h: hsva.h ?? 0,
        s: hsva.s ?? 0,
        v: hsva.v ?? (defaultValue === "text" ? 0 : 100),
        a: hsva.a ?? 1,
      };
    }
  } catch (error) {
    console.warn(
      "Error with rgbaToHsva, trying manual conversion:",
      colorString,
    );
  }

  // Si falla, intentar parseo manual
  const rgba = parseRgba(colorString);
  if (rgba && !isNaN(rgba.r)) {
    return rgbaToHsvaManual(rgba.r, rgba.g, rgba.b, rgba.a);
  }

  // Si todo falla, devolver valores por defecto
  return createDefaultHsva(defaultValue);
};

function NoteInspector() {
  const { selectedElement, updateElement } = useEditor();

  const isInternalUpdate = useRef(false);

  const isNote = selectedElement && selectedElement.kind === "note";
  if (!isNote) return null;

  const data = selectedElement?.data || {};
  const text = data.text || "";
  const style = data.style || {};

  const [separateRadius, setSeparateRadius] = useState(() => {
    const {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
    } = style;
    return (
      new Set([
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
      ]).size > 1
    );
  });

  const [separatePadding, setSeparatePadding] = useState(() => {
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = style;
    return (
      new Set([paddingTop, paddingRight, paddingBottom, paddingLeft]).size > 1
    );
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBGColorPicker, setShowBGColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);

  const [textHsva, setTextHsva] = useState(() =>
    safeColorToHsva(style.color, "text"),
  );
  const [bgHsva, setBgHsva] = useState(() =>
    safeColorToHsva(style.backgroundColor, "background"),
  );
  const [borderHsva, setBorderHsva] = useState(() =>
    safeColorToHsva(style.borderColor, "border"),
  );
  const [borderWidthInput, setBorderWidthInput] = useState(
    style.borderWidth ?? "",
  );

  useEffect(() => {
    if (!selectedElement?.data?.style) return;

    if (!isInternalUpdate.current) {
      const currentStyle = selectedElement.data.style;

      setTextHsva(safeColorToHsva(currentStyle.color, "text"));
      setBgHsva(safeColorToHsva(currentStyle.backgroundColor, "background"));
      setBorderHsva(safeColorToHsva(currentStyle.borderColor, "border"));
      setBorderWidthInput(currentStyle.borderWidth ?? "");

      setSeparateRadius(() => {
        const {
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
        } = currentStyle;
        return (
          new Set([
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
          ]).size > 1
        );
      });

      setSeparatePadding(() => {
        const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
          currentStyle;
        return (
          new Set([paddingTop, paddingRight, paddingBottom, paddingLeft]).size >
          1
        );
      });
    }

    isInternalUpdate.current = false;
  }, [selectedElement?.id, selectedElement?.data?.style]);

  const updateStyle = (updates) => {
    if (!selectedElement) return;

    isInternalUpdate.current = true;

    updateElement({
      id: selectedElement.id,
      kind: "note",
      data: {
        ...selectedElement.data,
        style: { ...selectedElement.data.style, ...updates },
      },
    });
  };

  const updateText = (value) => {
    if (!selectedElement) return;
    updateElement({
      id: selectedElement.id,
      kind: "note",
      data: {
        ...selectedElement.data,
        text: value,
      },
    });
  };

  return (
    <motion.div className="properties__container note">
      <div className="properties__item">
        <div className="item input--text">
          <label>Contenido</label>
          <textarea
            value={text}
            onChange={(e) => updateText(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              backgroundColor: "var(--properties-input-bg-color)",
              border: "1px solid transparent",
              borderRadius: "5px",
              color: "var(--properties-input-color)",
              padding: "8px",
              fontFamily: "inherit",
              resize: "none",
            }}
          />
        </div>
      </div>

      <div className="properties__item divider">
        <div className="item input--select">
          <label>Fuente</label>
          <select
            value={style.fontFamily}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            style={{
              fontFamily: style.fontFamily,
            }}
          >
            {allFonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="item input--text">
          <label>Tamaño (px)</label>
          <input
            type="number"
            min={8}
            max={72}
            value={style.fontSize || 14}
            onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
          />
        </div>

        <div className="font-style-row">
          <button
            className={`style-button ${style.fontWeight >= 600 ? "active" : ""}`}
            onClick={() =>
              updateStyle({ fontWeight: style.fontWeight >= 600 ? 400 : 700 })
            }
          >
            <PiTextBBold />
          </button>

          <button
            className={`style-button ${style.fontStyle === "italic" ? "active" : ""}`}
            onClick={() =>
              updateStyle({
                fontStyle: style.fontStyle === "italic" ? "normal" : "italic",
              })
            }
          >
            <PiTextItalicBold />
          </button>

          <button
            className={`style-button ${style.textAlign === "left" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "left" })}
          >
            <CiTextAlignLeft />
          </button>

          <button
            className={`style-button ${style.textAlign === "center" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "center" })}
          >
            <CiTextAlignCenter />
          </button>

          <button
            className={`style-button ${style.textAlign === "right" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "right" })}
          >
            <CiTextAlignRight />
          </button>

          <button
            className={`style-button ${style.textAlign === "justify" ? "active" : ""}`}
            onClick={() => updateStyle({ textAlign: "justify" })}
          >
            <CiTextAlignJustify />
          </button>
        </div>
      </div>

      <div className="properties__item color divider note-color">
        <div className="color-row flex-row">
          <label htmlFor="text-color">Color de texto</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{ backgroundColor: hsvaToRgbaString(textHsva) }}
            />

            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Colorful
                    color={textHsva}
                    disableAlpha={true}
                    onChange={(color) => {
                      setTextHsva(color.hsva);
                      isInternalUpdate.current = true;
                      updateStyle({
                        color: hsvaToRgbaString(color.hsva),
                      });
                    }}
                  />
                  <button
                    className="color-picker-close"
                    onClick={() => setShowColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="color-row flex-row">
          <label htmlFor="bg-color">Color de fondo</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowBGColorPicker(!showBGColorPicker)}
              style={{
                backgroundColor: hsvaToRgbaString(bgHsva),
              }}
            />

            <AnimatePresence>
              {showBGColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Colorful
                    color={bgHsva}
                    disableAlpha={false}
                    onChange={(color) => {
                      setBgHsva(color.hsva);
                      isInternalUpdate.current = true;
                      updateStyle({
                        backgroundColor: hsvaToRgbaString(color.hsva),
                      });
                    }}
                  />
                  <button
                    className="color-picker-close"
                    onClick={() => setShowBGColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="properties__item color divider note-border">
        <div className="item input--text">
          <label>Ancho del borde</label>
          <input
            type="text"
            inputMode="numeric"
            value={borderWidthInput}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setBorderWidthInput("");
                isInternalUpdate.current = true;
                updateStyle({ borderWidth: 0 });
                return;
              }

              if (/^\d+$/.test(val)) {
                const num = Number(val);
                if (num <= 10) {
                  setBorderWidthInput(val);
                  isInternalUpdate.current = true;
                  updateStyle({ borderWidth: num });
                }
              }
            }}
          />
        </div>

        <div className="color-row flex-row">
          <label htmlFor="border-color">Color del borde</label>

          <div className="color-picker-wrapper">
            <button
              className="color-swatch"
              onClick={() => setShowBorderColorPicker((v) => !v)}
              style={{
                backgroundColor: hsvaToRgbaString(borderHsva),
              }}
            />

            <AnimatePresence>
              {showBorderColorPicker && (
                <motion.div
                  className="color-picker-popover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Colorful
                    color={borderHsva}
                    disableAlpha={false}
                    onChange={(color) => {
                      setBorderHsva(color.hsva);
                      isInternalUpdate.current = true;
                      updateStyle({
                        borderColor: hsvaToRgbaString(color.hsva),
                      });
                    }}
                  />
                  <button
                    className="color-picker-close"
                    onClick={() => setShowBorderColorPicker(false)}
                  >
                    <IoClose />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="properties__item divider">
        <label>Radio de bordes</label>

        <div className="radius-visual-container">
          <div
            className="radius-box"
            style={{
              borderTopLeftRadius: `${style.borderTopLeftRadius || style.borderRadius || 0}px`,
              borderTopRightRadius: `${style.borderTopRightRadius || style.borderRadius || 0}px`,
              borderBottomLeftRadius: `${style.borderBottomLeftRadius || style.borderRadius || 0}px`,
              borderBottomRightRadius: `${style.borderBottomRightRadius || style.borderRadius || 0}px`,
            }}
          >
            <input
              className="r-input tl"
              type="number"
              placeholder="TL"
              value={
                separateRadius
                  ? style.borderTopLeftRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                separateRadius
                  ? updateStyle({ borderTopLeftRadius: val })
                  : updateStyle({
                      borderRadius: val,
                      borderTopLeftRadius: val,
                      borderTopRightRadius: val,
                      borderBottomLeftRadius: val,
                      borderBottomRightRadius: val,
                    });
              }}
            />
            {/* Esquina Superior Derecha */}
            <input
              className="r-input tr"
              type="number"
              placeholder="TR"
              disabled={!separateRadius}
              value={
                separateRadius
                  ? style.borderTopRightRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) =>
                updateStyle({ borderTopRightRadius: Number(e.target.value) })
              }
            />
            {/* Icono de enlace en el centro */}
            <div
              className="radius-center"
              onClick={() => setSeparateRadius(!separateRadius)}
            >
              {separateRadius ? <FaLock /> : <FaLink />}
            </div>
            {/* Esquina Inferior Izquierda */}
            <input
              className="r-input bl"
              type="number"
              placeholder="BL"
              disabled={!separateRadius}
              value={
                separateRadius
                  ? style.borderBottomLeftRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) =>
                updateStyle({
                  borderBottomLeftRadius: Number(e.target.value),
                })
              }
            />
            {/* Esquina Inferior Derecha */}
            <input
              className="r-input br"
              type="number"
              placeholder="BR"
              disabled={!separateRadius}
              value={
                separateRadius
                  ? style.borderBottomRightRadius || 0
                  : style.borderRadius || 0
              }
              onChange={(e) =>
                updateStyle({
                  borderBottomRightRadius: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="properties__item">
        <label>Padding</label>
        <div className="padding-visual-container">
          <div className="padding-box">
            {/* Input Arriba */}
            <input
              className="p-input top"
              type="number"
              value={style.paddingTop || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                separatePadding
                  ? updateStyle({ paddingTop: val })
                  : updateStyle({
                      paddingTop: val,
                      paddingRight: val,
                      paddingBottom: val,
                      paddingLeft: val,
                    });
              }}
            />
            {/* Input Derecha */}
            <input
              className="p-input right"
              type="number"
              disabled={!separatePadding}
              value={style.paddingRight || 0}
              onChange={(e) =>
                updateStyle({ paddingRight: Number(e.target.value) })
              }
            />
            {/* Centro / Switch */}
            <div
              className="padding-center"
              onClick={() => setSeparatePadding(!separatePadding)}
            >
              {separatePadding ? <FaLink /> : <FaLock />}
            </div>
            {/* Input Izquierda */}
            <input
              className="p-input left"
              type="number"
              disabled={!separatePadding}
              value={style.paddingLeft || 0}
              onChange={(e) =>
                updateStyle({ paddingLeft: Number(e.target.value) })
              }
            />
            {/* Input Abajo */}
            <input
              className="p-input bottom"
              type="number"
              disabled={!separatePadding}
              value={style.paddingBottom || 0}
              onChange={(e) =>
                updateStyle({ paddingBottom: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NoteInspector;
