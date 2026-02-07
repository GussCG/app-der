import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ValidateInput({
  id,
  value,
  onChange,
  validator,
  placeholder,
  className = "",
  normalize,
  transform,
  disabled = false,
  onBlur,
  onKeyDown,
}) {
  const [touched, setTouched] = useState(false);

  const finalValue = transform ? transform(value) : value;
  const error = touched && validator ? validator(finalValue) : null;

  return (
    <div className="validate-input" style={{ position: "relative" }}>
      <input
        id={id}
        type="text"
        value={finalValue}
        disabled={disabled}
        placeholder={placeholder}
        className={`${className} ${error ? "input--error" : ""}`}
        onFocus={() => setTouched(true)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          let next = e.target.value;

          if (normalize) {
            next = normalize(next);
          }

          if (transform) {
            next = transform(next);
          }

          onChange(next);
        }}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            className="input-error-popover"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
