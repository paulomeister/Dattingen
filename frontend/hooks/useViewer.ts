import { useRef, useState, useEffect } from "react";
import { useDocument } from "./useDocument";

interface UseViewerOptions {
  onTextSelection?: () => void;
}

export function useViewer(options: UseViewerOptions = {}) {
  const { onTextSelection } = options;
  const viewerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("auto");

  const {
    numPages,
    pageNumber,
    scale,
    inputPage,
    onDocumentLoadSuccess,
    nextPage,
    prevPage,
    zoomIn: documentZoomIn,
    zoomOut: documentZoomOut,
    handlePageInput,
    setScale,
  } = useDocument();

  // Ajustar el tamaño del contenedor automáticamente al tamaño de la ventana
  useEffect(() => {
    const updateContainerSize = () => {
      // La navbar tiene una altura fija de 64px (h-16) y el main tiene un padding vertical de 80px (py-20)
      // Reducimos 160px (64px + 96px) del alto total de la ventana para calcular el espacio disponible
      const availableHeight = window.innerHeight - 160 - 20;
      setContainerHeight(`${availableHeight}px`);
    };

    // Actualizar el tamaño al montar el componente y cuando cambie el tamaño de la ventana
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);

    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  // Ajustar el tamaño inicial del documento para que se ajuste al contenedor
  useEffect(() => {
    if (numPages > 0 && viewerRef.current && containerRef.current) {
      // Esperar un momento para que el documento se renderice completamente
      const timer = setTimeout(() => {
        const pageElement =
          viewerRef.current?.querySelector(".react-pdf__Page");
        if (pageElement && containerRef.current) {
          const pageHeight = (pageElement as HTMLElement).offsetHeight;
          const containerHeight = containerRef.current.clientHeight - 40; // 40px de margen

          if (pageHeight > 0 && containerHeight > 0) {
            // Calcular la escala necesaria para ajustar el documento al contenedor
            const fitScale = containerHeight / pageHeight;
            // Usar un mínimo de 0.5 y un máximo de 1 para la escala inicial
            const newScale = Math.max(0.5, Math.min(1, fitScale));
            setScale(newScale);
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [numPages, setScale]);

  // Manejar el zoom con ajuste de vista
  const handleZoomIn = () => {
    if (viewerRef.current) {
      // Guarda la posición de scroll actual antes de zoom
      const scrollPos = {
        top: viewerRef.current.scrollTop,
        left: viewerRef.current.scrollLeft,
        height: viewerRef.current.scrollHeight,
        width: viewerRef.current.scrollWidth,
        clientHeight: viewerRef.current.clientHeight,
        clientWidth: viewerRef.current.clientWidth,
      };

      // Realiza el zoom
      documentZoomIn();

      // Después del zoom, ajusta la posición de scroll para mantener el centro
      setTimeout(() => {
        if (viewerRef.current) {
          // Calcula el factor de cambio debido al zoom (aproximadamente 1.25x)
          const zoomFactor = 1.25;

          // Calcula el nuevo punto central manteniendo el centro de la vista
          const newScrollTop =
            (scrollPos.top + scrollPos.clientHeight / 2) * zoomFactor -
            scrollPos.clientHeight / 2;
          const newScrollLeft =
            (scrollPos.left + scrollPos.clientWidth / 2) * zoomFactor -
            scrollPos.clientWidth / 2;

          // Aplica el nuevo scroll
          viewerRef.current.scrollTop = newScrollTop;
          viewerRef.current.scrollLeft = newScrollLeft;
        }
      }, 10);
    } else {
      documentZoomIn();
    }
  };

  // Manejar el zoom out con ajuste de vista
  const handleZoomOut = () => {
    if (viewerRef.current) {
      // Guarda la posición de scroll actual antes de zoom
      const scrollPos = {
        top: viewerRef.current.scrollTop,
        left: viewerRef.current.scrollLeft,
        height: viewerRef.current.scrollHeight,
        width: viewerRef.current.scrollWidth,
        clientHeight: viewerRef.current.clientHeight,
        clientWidth: viewerRef.current.clientWidth,
      };

      // Realiza el zoom
      documentZoomOut();

      // Después del zoom, ajusta la posición de scroll para mantener el centro
      setTimeout(() => {
        if (viewerRef.current) {
          // Calcula el factor de cambio debido al zoom (aproximadamente 0.8x)
          const zoomFactor = 0.8;

          // Calcula el nuevo punto central manteniendo el centro de la vista
          const newScrollTop =
            (scrollPos.top + scrollPos.clientHeight / 2) * zoomFactor -
            scrollPos.clientHeight / 2;
          const newScrollLeft =
            (scrollPos.left + scrollPos.clientWidth / 2) * zoomFactor -
            scrollPos.clientWidth / 2;

          // Aplica el nuevo scroll
          viewerRef.current.scrollTop = Math.max(0, newScrollTop);
          viewerRef.current.scrollLeft = Math.max(0, newScrollLeft);
        }
      }, 10);
    } else {
      documentZoomOut();
    }
  };

  // Generar propiedades del contenedor
  const containerProps = {
    ref: containerRef,
    style: {
      height: containerHeight,
      width: "100%",
      transition: "height 0.3s ease",
    },
  };

  // Generar propiedades del visor
  const viewerProps = {
    ref: viewerRef,
    onMouseUp: onTextSelection,
    style: {
      backgroundColor: "transparent",
      position: "relative" as const,
      top: "auto",
      left: "auto",
      right: "auto",
      bottom: "auto",
      zIndex: 1,
      padding: "1rem",
      transition: "all 0.3s ease",
    },
  };

  return {
    // Referencias
    viewerRef,
    containerRef,

    // Estado
    containerHeight,
    numPages,
    pageNumber,
    scale,
    inputPage,

    // Acciones
    onDocumentLoadSuccess,
    nextPage,
    prevPage,
    handleZoomIn,
    handleZoomOut,
    handlePageInput,

    // Props listos para usar
    containerProps,
    viewerProps,
  };
}
