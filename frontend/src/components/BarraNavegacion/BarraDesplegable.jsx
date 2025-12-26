import { MENUS } from "../../constants/menus";

function BarraDesplegable({ tipo }) {
  const items = MENUS[tipo];

  if (!items) return null;

  return (
    <div className="nav__desplegable">
      {items.map(({ icon: Icon, label, divider }) => (
        <div key={label} className={`nav__item ${divider ? " divider" : ""}`}>
          <Icon />
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default BarraDesplegable;
