"use client";
import React, { useState, useEffect } from "react";
import CreateNormativeItem from "./CreateNormativeItem";
import Viewer from "./Viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { environment } from "@/env/environment.dev";
import { Ruleset } from "@/types/Ruleset";

interface RulesetCreatorProps {
    rulesetId: string | string[]; // Recibe el rulesetId como prop
}

const RulesetCreator = ({ rulesetId }: RulesetCreatorProps) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string>("");
    const [file, setFile] = useState<string | null>(null);
    const [ruleset, setRuleset] = useState<Ruleset | null>(null);

    // UseEffect para obtener la data del ruleset
    useEffect(() => {
        const fetchRulesetData = async () => {
            try {
                const res = await fetch(`${environment.API_URL}/rulesets/api/findbyid/${rulesetId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch ruleset data");
                }
                const rulesetData = await res.json();
                setRuleset(rulesetData);

                // Aquí usamos directamente la URL del archivo del ruleset
                setFile(rulesetData.link); // Asignamos la URL directamente al estado `file`
            } catch (e) {
                console.error("Error on RulesetCreator:", e);
            }
        };

        fetchRulesetData();
    }, [rulesetId]); // Ejecutar efecto cuando `rulesetId` cambia

    // Funciones para manejar el diálogo
    const closeDialog = () => {
        setIsCreating(false);
    };

    const openDialog = () => {
        setIsCreating(true);
    };

    // Función para manejar la selección de texto
    const handleTextSelection = () => {
        const selection = window.getSelection();

        if (selection && selection.toString().trim().length > 0) {
            setSelectedText(selection.toString());
            openDialog();
        }

        window.getSelection()?.removeAllRanges();
    };

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
                        <Viewer file={file} onTextSelection={handleTextSelection} />
                    </div>
                </CardContent>
            </Card>

            {/* Diálogo flotante para crear normativa */}
            {isCreating && (
                <div
                    className={`fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out opacity-100 scale-100`}
                >
                    <CreateNormativeItem onClose={closeDialog} selectedText={selectedText} />
                </div>
            )}
        </div>
    );
};

export default RulesetCreator;
