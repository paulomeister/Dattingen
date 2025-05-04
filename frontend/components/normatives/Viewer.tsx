"use client";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { useViewer } from "@/hooks/useViewer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface ViewerProps {
  fileUrl?: string;
  onTextSelection: () => void;
}

const Viewer: React.FC<ViewerProps> = ({
  fileUrl = "",
  onTextSelection
}) => {
  const {
    // Estado y referencias
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
    viewerProps
  } = useViewer({ onTextSelection });

  return (
    <div className="space-y-4" {...containerProps}>
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
          {...viewerProps}
          className="relative overflow-auto ml-0 sm:ml-0 md:ml-20 h-full flex items-center justify-center"
        >
          <Document
            file={fileUrl}
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