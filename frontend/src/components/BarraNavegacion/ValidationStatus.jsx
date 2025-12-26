import Icons from "../../components/Others/IconProvider.jsx";

const { FaCircleCheck } = Icons;

function ValidationStatus({ state, progress }) {
  if (state === "loading") {
    return (
      <div
        className="nav__validation_progress loading"
        style={{ "--progress": `${progress}%` }}
      >
        <p>Validando...</p>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div class="nav__validation_progress invalid">
        <p>Inválido</p>
      </div>
    );
  }

  return (
    <div class="nav__validation_progress valid">
      <FaCircleCheck />
      <p>Válido</p>
    </div>
  );
}

export default ValidationStatus;
