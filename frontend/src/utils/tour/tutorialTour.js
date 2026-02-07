import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function startTutorialTour({ setMode, onFinish }) {
  let tour = driver({
    allowClose: true,
    animate: true,
    smoothScroll: true,
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Finalizar",
    closeBtnText: "Cerrar",
    overlayClickNext: false,
    showProgress: true,
    progressText: "Paso {{current}} de {{total}}",

    popoverClass: "tutorial-popover",

    onDestroyed: () => {
      onFinish?.();
    },

    steps: [
      // Bienvenida
      {
        popover: {
          title: "¡Bienvenido al tutorial!",
          description:
            "En este recorrido, aprenderás las funciones básicas de la aplicación.",
          position: "bottom",
        },
      },
      // Área de trabajo en modo ER
      {
        element: '[data-tour="er-canvas"]',
        popover: {
          title: "Área de trabajo MODO ER",
          description:
            "Aquí es donde puedes crear y editar tus diagramas entidad-relación.",
          position: "bottom",
        },
      },
      // Mostrar barra de herramientas ER
      {
        element: '[data-tour="er-toolbar"]',
        popover: {
          title: "Barra de herramientas ER",
          description:
            "Utiliza esta barra para agregar entidades, relaciones y otros elementos a tu diagrama ER.",
          position: "right",
        },
      },
      // Elemento barra de herramientas (Selección)
      {
        element: '[data-tour="tool-select"]',
        popover: {
          title: "Herramienta de Selección",
          description:
            "Usa esta herramienta para seleccionar y mover elementos en tu diagrama ER.",
          position: "bottom",
        },
      },
      // Elemento barra de herramientas (Pan)
      {
        element: '[data-tour="tool-pan"]',
        popover: {
          title: "Herramienta de Panorámica",
          description:
            "Usa esta herramienta para desplazarte por el área de trabajo sin seleccionar elementos.",
          position: "bottom",
        },
      },
      // Elemento barra de herramientas (Agregar Entidad)
      {
        element: '[data-tour="tool-add-entity"]',
        popover: {
          title: "Agregar Entidad",
          description:
            "Haz clic aquí para agregar una nueva entidad a tu diagrama ER.",
          position: "bottom",
        },
      },
      // Elemento barra de herramientas (Agregar Relación)
      {
        element: '[data-tour="tool-add-relation"]',
        popover: {
          title: "Agregar Relación",
          description:
            "Haz clic aquí para agregar una nueva relación a tu diagrama ER.",
          position: "bottom",
        },
      },
      // Barra de Navegación
      {
        element: '[data-tour="navigation-bar"]',
        popover: {
          title: "Barra de Navegación",
          description:
            "Utiliza la barra de navegación para cambiar entre diferentes modos de edición y acceder a otras funciones.",
          position: "bottom",
        },
      },
      // Barra de Navegación (Input de nombre de diagrama)
      {
        element: '[data-tour="diagram-name-input"]',
        popover: {
          title: "Nombre del Diagrama",
          description:
            "Aquí puedes ver y editar el nombre de tu diagrama actual. Si hay cambios no guardados, se indicará con un asterisco (*).",
          position: "bottom",
        },
      },
      // Barra de Navegación (Validar diagrama)
      {
        element: '[data-tour="validate-diagram-button"]',
        popover: {
          title: "Validar Diagrama",
          description: `Haz clic en este botón para validar tu diagrama y asegurarte de que cumple con las reglas y restricciones definidas. Para guardar tu diagrama o exportar a PNG primero debes validar el diagrama y corregir los errores que se indiquen.`,
          position: "bottom",
        },
      },
      // Barra de Navegación (Cambiar a modo Relacional)
      {
        element: '[data-tour="switch-to-relational-mode-button"]',
        popover: {
          title: "Cambiar a Modo Relacional",
          description:
            "Utiliza este botón para cambiar al modo de edición relacional, donde puedes trabajar con tablas y relaciones basadas en tu diagrama ER.",
          position: "bottom",
        },
      },
      // Barra de Elementos
      {
        element: '[data-tour="elements-bar"]',
        popover: {
          title: "Barra de Elementos",
          description:
            "Aquí puedes ver y gestionar los elementos que has agregado a tu diagrama, como entidades y relaciones.",
          position: "top",
        },
      },
      // Barra de busqueda de elementos
      {
        element: '[data-tour="elements-search"]',
        popover: {
          title: "Buscar Elementos",
          description:
            "Utiliza esta barra de búsqueda para encontrar rápidamente elementos específicos en tu diagrama.",
          position: "bottom",
        },
      },
      // Seleccionar un elemento (Entidad) para abrir el inspector
      {
        element: '[data-tour="elements-bar-container"]',
        popover: {
          title: "¡Casi Terminas!",
          description:
            "Selecciona una entidad en el área de trabajo para abrir el inspector y explorar sus propiedades.",
          position: "bottom",
        },
      },
      // Con el inspector abierto mostrar cada una de sus partes (primero nombre)
      {
        element: '[data-tour="inspector"]',
        popover: {
          title: "Inspector de Propiedades",
          description:
            "El inspector te permite ver y editar las propiedades del elemento seleccionado en tu diagrama.",
          position: "left",
        },
      },
      // Inspector - Nombre
      {
        element: '[data-tour="inspector-name-input"]',
        popover: {
          title: "Inspector - Nombre y Propiedad del Elemento",
          description:
            "Aquí puedes ver y editar el nombre del elemento seleccionado. Si es entidad puedes marcar si es débil. Y en relaciones su tipo de relación (Simple o identificadora).",
          position: "right",
        },
      },
      // Inspector - Color
      {
        element: '[data-tour="inspector-color-picker"]',
        popover: {
          title: "Inspector - Color",
          description:
            "Utiliza este selector para cambiar el color asociado al elemento seleccionado. También se muestran los colores de los demás elementos para facilitar la identificación visual.",
          position: "right",
        },
      },
      // Inspector - Cardinalidad
      {
        element: '[data-tour="inspector-cardinality"]',
        popover: {
          title: "Inspector - Cardinalidad",
          description:
            "Esta sección es unicamente para relaciones. Muestra a qué entidades está conectada, si es 1:1, 1:N, N:M, y su participación.",
          position: "right",
        },
      },
      // Inspector - Atributos
      {
        element: '[data-tour="inspector-attributes-section"]',
        popover: {
          title: "Inspector - Atributos",
          description:
            "En esta sección puedes ver y gestionar los atributos del elemento seleccionado.",
          position: "right",
        },
      },
      // Cambiar a modo Relacional pero primero validar diagrama
      {
        element: '[data-tour="validate-diagram-button"]',
        popover: {
          title: "¡Último Paso!",
          description:
            "Antes de cambiar al modo relacional, asegúrate de validar tu diagrama ER para verificar que no haya errores.",
          position: "bottom",
        },
      },
      // Boton cambiar a modo relacional otra vez
      {
        element: '[data-tour="switch-to-relational-mode-button"]',
        popover: {
          title: "Cambiar a Modo Relacional",
          description:
            "Haz clic en este botón para cambiar al modo de edición relacional.",
          position: "bottom",
        },
      },
      // En modo relacional solicitar al usuario que seleccione una entidad del canvas
      {
        element: '[data-tour="relational-canvas"]',
        popover: {
          title: "Modo Relacional",
          description:
            "Selecciona una tabla en el área de trabajo relacional para explorar sus propiedades en el inspector.",
          position: "right",
        },
      },
      // Inspecionar tabla en modo relacional
      {
        element: '[data-tour="inspector-rel"]',
        popover: {
          title: "Inspector Modo Relacional",
          description:
            "Aquí puedes ver las columnas y propiedades de la tabla seleccionada en modo relacional. Aquí no se pueden borrar o agregar columnas ya que se derivan del diagrama ER.",
          position: "right",
        },
      },
      // Cambiar de vuelta a modo ER
      {
        element: '[data-tour="switch-to-er-mode-button"]',
        popover: {
          title: "Volver a Modo ER",
          description:
            "Utiliza este botón para regresar al modo de edición entidad-relación en cualquier momento.",
          position: "bottom",
        },
      },
      // Exportar SQL
      {
        element: '[data-tour="export-sql-button"]',
        popover: {
          title: "Exportar SQL",
          description:
            "Utiliza este botón para exportar el script SQL generado a partir de tu diagrama relacional.",
          position: "bottom",
        },
      },
      // Finalizar
      {
        popover: {
          title: "¡Has completado el tutorial!",
          description:
            "Ahora estás listo para comenzar a crear tus propios diagramas. ¡Diviértete explorando todas las funciones de la aplicación!",
          position: "top",
          onNextClick: () => {
            tour.destroy();
          },
        },
      },
    ],
  });

  tour.drive();
}
