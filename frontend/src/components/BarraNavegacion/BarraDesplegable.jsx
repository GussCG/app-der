import { MENUS } from "../../constants/menus";

function BarraDesplegable({ tipo, onSelect, canUndo, canRedo }) {
  const items = MENUS[tipo];

  if (!items) return null;

  return (
    <div className="nav__desplegable">
      {items.map(({ icon: Icon, label, divider, command }) => {
        const disabled =
          (label === "Deshacer" && !canUndo) ||
          (label === "Rehacer" && !canRedo);

        return (
          <div
            key={label}
            className={`nav__item ${divider ? "divider" : ""} ${
              disabled ? "disabled" : ""
            }`}
            onClick={() => !disabled && onSelect(label)}
          >
            <Icon />
            <p>{label}</p>
            <p className="nav__item-command">{command}</p>
          </div>
        );
      })}
    </div>
  );
}

export default BarraDesplegable;
