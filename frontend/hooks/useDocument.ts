import { useState } from "react";

/**
 * Hook para manejar la lógica del visor de documentos
 * @param initialPage - Página inicial del documento (por defecto 1)
 * @param initialScale - Escala inicial del documento (por defecto 1)
 * @returns Objeto con estados y métodos para manejar el documento
 */
export const useDocument = (initialPage = 1, initialScale = 1) => {
  // Estados para manejar las páginas y el zoom
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(initialScale);
  const [inputPage, setInputPage] = useState<string>("1");

  /**
   * Función que se ejecuta cuando el documento se carga exitosamente
   * @param numPages - Número total de páginas del documento
   */
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setInputPage("1");
  };

  /**
   * Función para navegar a la siguiente página
   */
  const nextPage = () => {
    setPageNumber((prev) => {
      const newPage = prev < numPages ? prev + 1 : prev;
      setInputPage(String(newPage));
      return newPage;
    });
  };

  /**
   * Función para navegar a la página anterior
   */
  const prevPage = () => {
    setPageNumber((prev) => {
      const newPage = prev > 1 ? prev - 1 : prev;
      setInputPage(String(newPage));
      return newPage;
    });
  };

  /**
   * Función para aumentar el zoom del documento
   */
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2));
  };

  /**
   * Función para disminuir el zoom del documento
   */
  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  /**
   * Función para manejar el cambio de página mediante input
   * @param value - Valor del input
   */
  const handlePageInput = (value: string) => {
    setInputPage(value);
    
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= numPages) {
      setPageNumber(pageNum);
    }
  };

  return {
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
  };
};