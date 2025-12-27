import Icons from "../Others/IconProvider.jsx";
import HidePanelButton from "../Others/TogglePanelButton.jsx";

const { FaSearch, HiOutlineTableCells, LuPanelLeftClose, LuPanelLeftOpen } =
  Icons;

function BarraEntidades({ hidden, onToggle }) {
  return (
    <div className={`entities ${hidden ? "hidden" : ""}`}>
      <HidePanelButton
        onClick={onToggle}
        icon={hidden ? LuPanelLeftOpen : LuPanelLeftClose}
        title={hidden ? "Mostrar panel" : "Esconder panel"}
      />

      {!hidden && (
        <>
          <h1>Tablas/Entidades</h1>
          <div className="entities__container">
            <div className="entities__searchbar">
              <FaSearch />
              <input type="text" placeholder="Buscar entidad..." />
            </div>
            <div className="entities__list">
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>{" "}
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
              <div className="entities__item">
                <HiOutlineTableCells />
                <span>Entidad 1</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BarraEntidades;
