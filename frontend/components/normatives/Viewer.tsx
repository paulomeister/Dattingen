"use client";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { Input } from "../ui/input";
import { useDocument } from "@/hooks/useDocument";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Viewer = ({
  file = "/somefile.pdf",
  onTextSelection,
}: {
  file?: string;
  onTextSelection: () => void;
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("auto");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const {
    numPages,
    pageNumber,
    scale,
    inputPage,
    onDocumentLoadSuccess,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    handlePageInput,
    setScale
  } = useDocument();

  // Ajustar el tamaño del contenedor automáticamente al tamaño de la ventana
  useEffect(() => {
    const updateContainerSize = () => {
      // La navbar tiene una altura fija de 64px (h-16) y el main tiene un padding vertical de 80px (py-20)
      // Reducimos 160px (64px + 96px) del alto total de la ventana para calcular el espacio disponible
      // También consideramos un pequeño margen adicional para evitar scroll accidental
      const availableHeight = window.innerHeight - 160 - 20;
      setContainerHeight(`${availableHeight}px`);
    };

    // Actualizar el tamaño al montar el componente y cuando cambie el tamaño de la ventana
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  // Ajustar el tamaño inicial del documento para que se ajuste al contenedor
  useEffect(() => {
    if (numPages > 0 && viewerRef.current && containerRef.current) {
      // Esperar un momento para que el documento se renderice completamente
      const timer = setTimeout(() => {
        const pageElement = viewerRef.current?.querySelector('.react-pdf__Page');
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
        clientWidth: viewerRef.current.clientWidth
      };

      // Realiza el zoom
      zoomIn();
      
      // Después del zoom, ajusta la posición de scroll para mantener el centro
      setTimeout(() => {
        if (viewerRef.current) {
          // Calcula el factor de cambio debido al zoom (aproximadamente 1.25x)
          const zoomFactor = 1.25;
          
          // Calcula el nuevo punto central manteniendo el centro de la vista
          const newScrollTop = (scrollPos.top + scrollPos.clientHeight / 2) * zoomFactor - scrollPos.clientHeight / 2;
          const newScrollLeft = (scrollPos.left + scrollPos.clientWidth / 2) * zoomFactor - scrollPos.clientWidth / 2;
          
          // Aplica el nuevo scroll
          viewerRef.current.scrollTop = newScrollTop;
          viewerRef.current.scrollLeft = newScrollLeft;
        }
      }, 10);
    } else {
      zoomIn();
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
        clientWidth: viewerRef.current.clientWidth
      };

      // Realiza el zoom
      zoomOut();
      
      // Después del zoom, ajusta la posición de scroll para mantener el centro
      setTimeout(() => {
        if (viewerRef.current) {
          // Calcula el factor de cambio debido al zoom (aproximadamente 0.8x)
          const zoomFactor = 0.8;
          
          // Calcula el nuevo punto central manteniendo el centro de la vista
          const newScrollTop = (scrollPos.top + scrollPos.clientHeight / 2) * zoomFactor - scrollPos.clientHeight / 2;
          const newScrollLeft = (scrollPos.left + scrollPos.clientWidth / 2) * zoomFactor - scrollPos.clientWidth / 2;
          
          // Aplica el nuevo scroll
          viewerRef.current.scrollTop = Math.max(0, newScrollTop);
          viewerRef.current.scrollLeft = Math.max(0, newScrollLeft);
        }
      }, 10);
    } else {
      zoomOut();
    }
  };

  // Alternar modo pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className="space-y-4"
      ref={containerRef}
      style={{ 
        height: isFullscreen ? "100vh" : containerHeight,
        width: "100%",
        transition: "height 0.3s ease"
      }}
    >
      {/* Contenedor principal con posicionamiento relativo */}
      <div className="relative h-full bg-gray-50 rounded-lg">
        {/* Botones laterales con posicionamiento absoluto */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10 md:flex sm:hidden">
          <Button
            onClick={handleZoomIn}
            className="w-10 h-10 p-0 rounded-full bg-gradient-to-br from-primary-color to-secondary-color hover:from-primary-color/90 hover:to-secondary-color/90 text-white shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handleZoomOut}
            className="w-10 h-10 p-0 rounded-full bg-gradient-to-br from-secondary-color to-tertiary-color hover:from-secondary-color/90 hover:to-tertiary-color/90 text-white shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="w-10 h-10 p-0 rounded-full bg-gradient-to-br from-tertiary-color to-contrast-color hover:from-tertiary-color/90 hover:to-contrast-color/90 text-white shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="w-10 h-10 p-0 rounded-full bg-gradient-to-br from-contrast-color to-contrast-2-color hover:from-contrast-color/90 hover:to-contrast-2-color/90 text-white shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Next Page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          {/* Botón de pantalla completa */}
          <Button
            onClick={toggleFullscreen}
            className="w-10 h-10 p-0 rounded-full bg-gradient-to-br from-primary-color to-tertiary-color hover:from-primary-color/90 hover:to-tertiary-color/90 text-white shadow-lg transition-all duration-300 hover:scale-110"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          
          {/* Contador de página con estilo */}
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md text-center border border-tertiary-color/20 w-[4.5rem] mt-2 animate-in fade-in-50">
            <div className="text-xs text-gray-500 mb-1">Page</div>
            <Input
              type="number"
              value={inputPage}
              onChange={(e) => handlePageInput(e.target.value)}
              min={1}
              max={numPages}
              className="w-full text-center h-8 text-sm border-tertiary-color/30 focus:border-primary-color/50"
            />
            <div className="text-xs text-gray-500 mt-1">of {numPages}</div>
          </div>
          
          {/* Indicador de zoom */}
          <div className="bg-white/90 backdrop-blur-sm py-1.5 px-2 rounded-lg shadow-md text-center border border-tertiary-color/20 text-xs text-gray-600 animate-in fade-in-50">
            {Math.round(scale * 100)}%
          </div>
        </div>
        
        {/* Controles móviles - solo visible en pantallas pequeñas */}
        <div className="absolute top-2 right-2 flex flex-row gap-2 sm:flex md:hidden z-10">
          <Button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-gradient-to-br from-tertiary-color to-contrast-color hover:opacity-90"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="bg-white/80 rounded-md px-2 py-1 text-xs flex items-center">
            {pageNumber}/{numPages}
          </span>
          
          <Button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-gradient-to-br from-contrast-color to-contrast-2-color hover:opacity-90"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Visor del documento */}
        <div
          ref={viewerRef}
          onMouseUp={onTextSelection}
          className="relative overflow-auto ml-0 sm:ml-0 md:ml-20 h-full flex items-center justify-center"
          style={{ 
            backgroundColor: isFullscreen ? 'rgba(243, 244, 246, 0.98)' : 'transparent',
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            right: isFullscreen ? 0 : 'auto',
            bottom: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 50 : 1,
            padding: isFullscreen ? '3rem 5rem' : '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          <Document 
            file={file} 
            onLoadSuccess={onDocumentLoadSuccess}
            className="shadow-lg"
            loading={
              <div className="flex items-center justify-center h-64 w-full">
                <div className="animate-pulse text-primary-color">Cargando documento...</div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-64 w-full text-center p-4">
                <div className="text-red-500 font-medium mb-2">Error al cargar el documento</div>
                <p className="text-gray-500 text-sm">Asegúrate de que el archivo existe y es un PDF válido</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="h-64 w-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary-color/30 border-t-primary-color rounded-full animate-spin"></div>
                </div>
              }
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
