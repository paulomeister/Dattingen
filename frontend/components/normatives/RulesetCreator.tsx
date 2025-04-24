"use client";
import React, { useEffect, useState } from "react";
import CreateNormativeItem from "./CreateNormativeItem";
import Viewer from "./Viewer";

const RulesetCreator = () => {
    // Estados para manejar la interactividad
    const [isCreating, setIsCreating] = React.useState<boolean>(false);
    const [selectedText, setSelectedText] = React.useState<string>("");
    const [isVisible, setIsVisible] = useState(false);

    // Funciones para manejar el diálogo
    function closeDialog(): void {
        setIsCreating(false);
    }

    function openDialog(): void {
        setIsCreating(true);
    }

    // Función para manejar la selección de texto
    // Esta función necesita acceso a window, por lo que debe estar en un Cliente Component
    function handleTextSelection(): void {
        const selection = window.getSelection();

        if (selection && selection.toString().trim().length > 0) {
            setSelectedText(selection.toString());
            openDialog();
        }

        window.getSelection()?.removeAllRanges();
    }

    useEffect(() => {
        setIsVisible(true);

        // Opcional: Puedes limpiar eventos o estados al desmontar
        return () => {
            // Limpieza si es necesaria
        };
    }, []);

    return (
        <>
            {/* Diálogo flotante para crear normativa */}
            <div
                className={`fixed top-1/2 right-1 z-1000 transform -translate-x-1/2 -translate-y-1/2 
        transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
            >
                {isCreating && (
                    <CreateNormativeItem
                        onClose={closeDialog}
                        selectedText={selectedText}
                    />
                )}
            </div>

            {/* Visor de documentos con selección de texto */}
            <Viewer onTextSelection={handleTextSelection} />
        </>
    );
};

export default RulesetCreator;