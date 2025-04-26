"use client";

import { useEffect, DependencyList } from "react";

/**
 * Hook personalizado para implementar la funcionalidad de debounce
 * @param callback Función a ejecutar después del tiempo de debounce
 * @param dependencies Lista de dependencias que activarán el callback
 * @param delay Tiempo de espera en milisegundos
 */
export function useDebounce(
  callback: () => void,
  dependencies: DependencyList,
  delay: number
): void {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, delay]);
}