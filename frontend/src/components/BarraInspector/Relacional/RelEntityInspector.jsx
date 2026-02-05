import React, { Fragment } from "react";
import Icons from "../../Others/IconProvider";

const { FaKey, LuKeySquare, FaLock, FaCircleInfo, IoClose } = Icons;

function RelEntityInspector({ table, overrides = {}, updateOverride }) {
  const renderTypeParams = (type, col, override) => {
    const currentValues = override.values ?? col.values ?? [];
    switch (type) {
      case "varchar":
      case "char":
        return (
          <input
            type="number"
            min={1}
            value={override.length ?? col.length ?? 255}
            onChange={(e) => {
              updateOverride(table.name, col.name, {
                length: Number(e.target.value),
              });
            }}
          />
        );

      case "decimal":
      case "numeric":
        return (
          <>
            <input
              type="number"
              min={1}
              value={override.precision ?? col.precision ?? 10}
              onChange={(e) => {
                updateOverride(table.name, col.name, {
                  precision: Number(e.target.value),
                });
              }}
            />
            <input
              type="number"
              min={0}
              value={override.scale ?? col.scale ?? 0}
              onChange={(e) => {
                updateOverride(table.name, col.name, {
                  scale: Number(e.target.value),
                });
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  const renderEnumEditor = (col, override) => {
    const currentValues = override.values ?? col.values ?? [];
    return (
      <div className="enum-editor-container">
        <span className="bracket">[</span>
        <div className="enum-tags">
          {currentValues.map((val, idx) => (
            <span key={idx} className="enum-tag-wrapper">
              <span className="quote">"</span>
              <span className="enum-tag">
                {val}
                <button
                  className="remove-tag"
                  onClick={() => {
                    const newVals = currentValues.filter((_, i) => i !== idx);
                    updateOverride(table.name, col.name, { values: newVals });
                  }}
                >
                  <IoClose />
                </button>
              </span>
              <span className="quote">"</span>
              {idx < currentValues.length - 1 && (
                <span className="comma">,</span>
              )}
            </span>
          ))}
        </div>
        <div className="enum-input-wrapper">
          {currentValues.length > 0 && <span className="comma">,</span>}
          <span className="quote">"</span>
          <input
            type="text"
            className="enum-inline-input"
            placeholder="Nuevo valor"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const newVal = e.target.value.trim();
                if (!currentValues.includes(newVal)) {
                  updateOverride(table.name, col.name, {
                    values: [...currentValues, newVal],
                  });
                }
                e.target.value = "";
              }
            }}
          />
          <span className="quote">"</span>
        </div>
        <span className="bracket">]</span>
      </div>
    );
  };

  if (!table) {
    return (
      <div className="properties__container">
        <p>No hay tabla seleccionada</p>
      </div>
    );
  }

  return (
    <div className="properties__container" data-tour="inspector-rel">
      <div className="properties__item">
        <div
          className="item input--text"
          title="Si quieres editar el nombre de esta tabla, regresa al modo E-R"
        >
          <label>Nombre de la entidad (Tabla)</label>
          <input type="text" value={table.name} readOnly />
          <FaLock className="locked" />
        </div>
      </div>

      <div className="properties__attributes">
        <h2>Columnas</h2>

        <table className="attributes">
          {table.columns.length > 0 && (
            <thead>
              <tr>
                <th>Columna</th>
                <th>Tipo SQL</th>
                <th title="Primary Key">
                  <FaKey size={12} />
                </th>
                <th title="Foreign Key">
                  <LuKeySquare size={12} />
                </th>
                <th title="Not Null">NN</th>
                <th title="Unique">UQ</th>
                <th title="Auto Increment">AI</th>
              </tr>
            </thead>
          )}

          <tbody>
            {table.columns.map((col) => {
              const override = overrides?.[table.name]?.[col.name] ?? {};
              const currentType = override.type ?? col.type;

              const isPK = col.isPk;
              const isFK = col.isFk;

              const effectiveNN = isPK
                ? true
                : (override.isNotNull ?? col.isNotNull);
              const effectiveUQ = isPK
                ? true
                : (override.isUnique ?? col.isUnique);

              const canBeAi =
                isPK &&
                ["int", "bigint", "smallint", "tinyint"].includes(currentType);
              const effectiveAI = canBeAi
                ? (override.isAutoIncrement ?? col.isAutoIncrement)
                : false;

              const isTypeDisabled = isFK;
              return (
                <Fragment key={col.name}>
                  <tr className={isFK ? "fk-column" : ""}>
                    <td
                      className="rel-name-column"
                      title="Si quieres editar esta columna, regresa al modo E-R"
                    >
                      <input type="text" value={col.name || ""} readOnly />
                      <FaLock />
                      {isTypeDisabled && (
                        <div
                          className="fk-info"
                          title="Toda esta información es derivada de la relación, por lo que no puede ser modificada aquí."
                        >
                          <FaCircleInfo />
                        </div>
                      )}
                    </td>
                    {/* Tipo SQL */}
                    <td
                      title={
                        isTypeDisabled ? "Tipo derivado de la relación" : ""
                      }
                    >
                      <div
                        className={`type-cell ${isTypeDisabled ? "disabled-cell" : ""}`}
                      >
                        <select
                          value={currentType}
                          disabled={isTypeDisabled}
                          onChange={(e) =>
                            updateOverride(table.name, col.name, {
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="int">INT</option>
                          <option value="tinyint">TINYINT</option>
                          <option value="smallint">SMALLINT</option>
                          <option value="bigint">BIGINT</option>
                          <option value="varchar">VARCHAR</option>
                          <option value="char">CHAR</option>
                          <option value="text">TEXT</option>
                          <option value="enum">ENUM</option>
                          <option value="set">SET</option>
                          <option value="decimal">DECIMAL</option>
                          <option value="numeric">NUMERIC</option>
                          <option value="float">FLOAT</option>
                          <option value="double">DOUBLE</option>
                          <option value="date">DATE</option>
                          <option value="time">TIME</option>
                          <option value="datetime">DATETIME</option>
                          <option value="timestamp">TIMESTAMP</option>
                          <option value="year">YEAR</option>
                          <option value="boolean">BOOLEAN</option>
                        </select>

                        {!isTypeDisabled && (
                          <div className="type-params">
                            {renderTypeParams(currentType, col, override)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* PK */}
                    <td>
                      <label className={`checkbox disabled`}>
                        <input type="checkbox" checked={isPK} disabled />
                        <span className="checkbox__box" />
                      </label>
                    </td>

                    {/* FK */}
                    <td>
                      <label className="checkbox disabled">
                        <input type="checkbox" checked={isFK} disabled />
                        <span className="checkbox__box" />
                      </label>
                    </td>

                    {/* Not Null */}
                    <td>
                      <label
                        className={`checkbox ${isPK || isFK ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={effectiveNN}
                          disabled={isPK || isFK}
                          onChange={(e) => {
                            updateOverride(table.name, col.name, {
                              isNotNull: e.target.checked,
                            });
                          }}
                        />
                        <span className="checkbox__box" />
                      </label>
                    </td>

                    {/* Unique */}
                    <td>
                      <label
                        className={`checkbox ${isPK || isFK ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={effectiveUQ}
                          disabled={isPK || isFK}
                          onChange={(e) => {
                            updateOverride(table.name, col.name, {
                              isUnique: e.target.checked,
                            });
                          }}
                        />
                        <span className="checkbox__box" />
                      </label>
                    </td>

                    {/* Auto Increment */}
                    <td>
                      <label
                        className={`checkbox ${!canBeAi || isFK ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={effectiveAI}
                          disabled={!canBeAi || isFK}
                          onChange={(e) => {
                            updateOverride(table.name, col.name, {
                              isAutoIncrement: e.target.checked,
                            });
                          }}
                        />
                        <span className="checkbox__box" />
                      </label>
                    </td>
                  </tr>

                  {!isTypeDisabled &&
                    (currentType === "enum" || currentType === "set") && (
                      <tr className="subattributes-row">
                        <td colSpan={7}>
                          <div className="subattributes">
                            <div className="subattribute-item">
                              {renderEnumEditor(col, override)}
                              <FaCircleInfo
                                className="info"
                                title="Para agregar mas valores, dale enter"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                  {/* Fila Extra para Opciones de Integridad Referencial solo si es FK */}
                  {isFK && (
                    <tr>
                      <td colSpan={7}>
                        <div className="fk-options">
                          <div className="fk-option">
                            <label>ON DELETE:</label>
                            <select
                              value={
                                override.onDelete || col.onDelete || "RESTRICT"
                              }
                              onChange={(e) => {
                                updateOverride(table.name, col.name, {
                                  onDelete: e.target.value,
                                });
                              }}
                            >
                              <option value="RESTRICT">RESTRICT</option>
                              <option value="CASCADE">CASCADE</option>
                              <option value="SET NULL">SET NULL</option>
                              <option value="NO ACTION">NO ACTION</option>
                              <option value="SET DEFAULT">SET DEFAULT</option>
                            </select>
                          </div>

                          <div className="fk-option">
                            <label>ON UPDATE:</label>
                            <select
                              value={
                                override.onUpdate || col.onUpdate || "RESTRICT"
                              }
                              onChange={(e) => {
                                updateOverride(table.name, col.name, {
                                  onUpdate: e.target.value,
                                });
                              }}
                            >
                              <option value="RESTRICT">RESTRICT</option>
                              <option value="CASCADE">CASCADE</option>
                              <option value="SET NULL">SET NULL</option>
                              <option value="NO ACTION">NO ACTION</option>
                              <option value="SET DEFAULT">SET DEFAULT</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RelEntityInspector;
