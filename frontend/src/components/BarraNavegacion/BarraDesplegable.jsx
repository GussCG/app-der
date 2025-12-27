import { MENUS } from "../../constants/menus";

function BarraDesplegable({ tipo, onSelect }) {
  const items = MENUS[tipo];

  if (!items) return null;

  return (
    <div className="nav__desplegable">
      {items.map(({ icon: Icon, label, divider, command }) => (
        <div
          key={label}
          className={`nav__item ${divider ? " divider" : ""}`}
          onClick={() => onSelect(label)}
        >
          <Icon />
          <p>{label}</p>
          <p className="nav__item-command">{command}</p>
        </div>
      ))}
    </div>
  );
}

export default BarraDesplegable;
