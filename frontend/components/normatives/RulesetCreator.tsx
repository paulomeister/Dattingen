"use client";
import React, { useEffect, useState } from "react";
import CreateNormativeItem from "./CreateNormativeItem";
import Viewer from "./Viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Plus } from "lucide-react";

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
        return () => {
            // Limpieza si es necesaria
        };
    }, []);

    return (
        <div className="flex flex-col gap-6">


            <Card className="overflow-hidden h-100vh shadow-lg border-tertiary-color/20">
                <CardContent className="p-0 h-full">
                    <div className="bg-contrast-color/10 border-b border-tertiary-color/20 p-4 flex justify-between items-center">
                        <h3 className="font-medium text-primary-color">Document Viewer</h3>
                        <Button
                            onClick={openDialog}
                            variant="outline"
                            size="sm"
                            className="bg-contrast-2-color/10 hover:bg-contrast-2-color/30 text-primary-color border-tertiary-color/30"
                        >
                            <Plus size={16} className="mr-1" /> Add Rule
                        </Button>
                    </div>
                    <div className="p-4 overflow-auto h-[calc(100%-4rem)]">
                        <Viewer onTextSelection={handleTextSelection} />
                    </div>
                </CardContent>
            </Card>

            {/* Diálogo flotante para crear normativa */}
            <div
                className={`fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 
                transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            >
                {isCreating && (
                    <CreateNormativeItem
                        onClose={closeDialog}
                        selectedText={selectedText}
                    />
                )}
            </div>
        </div>
    );
};

export default RulesetCreator;