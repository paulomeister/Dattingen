"use client";
import React, { useState, useEffect } from "react";
import CreateNormativeItem from "./CreateNormativeItem";
import Viewer from "./Viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { environment } from "@/env/environment.dev";
import { Ruleset, Control } from "@/types/Ruleset";
import { useRouter } from "next/navigation";
import { updateRuleset } from "@/lib/utils";
import FinishRulesetButton from "./FinishRulesetButton";
import { useLanguage } from "@/lib/LanguageContext";

interface RulesetCreatorProps {
    rulesetId: string | string[]; // Recibe el rulesetId como prop
    onUpdateSuccess?: () => void; // Nueva prop para notificar actualizaciones exitosas
}

const RulesetCreator = ({ rulesetId, onUpdateSuccess }: RulesetCreatorProps) => {
    const { t } = useLanguage();
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string>("");
    const [ruleset, setRuleset] = useState<Ruleset | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    // Nuevo estado para mantener los controles
    const [controls, setControls] = useState<Control[]>([]);
    
    const router = useRouter();

    useEffect(() => {
        async function getFileUrl(): Promise<void> {
            const fileName: string = ruleset!.fileName; // Recibo del AzureResponse el atributo fileName
            // Mandamos a buscar el archivo a backend por su nmbre
            const fileData = await fetch(`${environment.API_URL}/rulesets/api/downloadFile/${fileName}`);

            const fileRes = await fileData.blob();

            const fileObject = new File([fileRes], fileName, { type: "application/pdf" });
            setFileUrl(URL.createObjectURL(fileObject)); // Envía el blob (desde el cliente) al visor
        }

        if (ruleset !== null && rulesetId) {
            const currentStatus = ruleset?.status?.toLowerCase();

            // Si ya ha sido publicado, entonces no se puede editar
            if (currentStatus === "published" || ruleset.status.toLowerCase() === "publicado") {
                router.push(`/rulesets/get/${rulesetId}`);
            } else {
                getFileUrl();
                // Inicializar los controles con los que ya existen en el ruleset
                if (ruleset.controls) {
                    setControls(ruleset.controls);
                }
            }
        }
    }, [ruleset, rulesetId, router]);

    // UseEffect para obtener la data del ruleset
    useEffect(() => {
        const fetchRulesetData = async () => {
            try {
                const res = await fetch(`${environment.API_URL}/rulesets/api/findbyid/${rulesetId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch ruleset data");
                }
                const ruleset: Ruleset = await res.json();
                setRuleset(ruleset);
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

    // Nueva función para manejar el guardado de un nuevo control
    const handleSaveControl = (control: Control) => {

        console.log(control)


        // Asignar un ID único si no tiene uno
        if (!control.controlId) {
            const newId = controls.length > 0
                ? (Math.max(...controls.map(c => parseInt(c.controlId))) + 1).toString()
                : "1";
            control.controlId = newId;
        }

        // Guardar el nuevo control en el estado
        setControls(prevControls => {
            // Verificar si ya existe un control con ese ID
            const existingIndex = prevControls.findIndex(c => c.controlId === control.controlId);

            if (existingIndex >= 0) {
                // Actualizar el control existente
                const updatedControls = [...prevControls];
                updatedControls[existingIndex] = control;
                return updatedControls;
            } else {
                // Agregar nuevo control
                return [...prevControls, control];
            }
        });

        // Cerrar el diálogo después de guardar
        closeDialog();
    };

    // Función para guardar todos los controles en el ruleset
    const saveAllControls = async () => {
        if (!ruleset || !rulesetId) return;

        try {
            const updatedRuleset = {
                ...ruleset,
                controls: controls
            };

            const response = await updateRuleset(rulesetId as string, updatedRuleset);

            if (!response.ok) {
                throw new Error('Failed to update ruleset');
            }

            const updatedData = await response.json();
            setRuleset(updatedData);

            if (onUpdateSuccess) {
                onUpdateSuccess();
            }

            alert(t('rulesets.creator.success.save'));
        } catch (error) {
            console.error('Error saving ruleset:', error);
            alert(t('rulesets.creator.error.save'));
        }
    };

    // Función para finalizar y publicar la normativa
    const handleFinishRuleset = async () => {
        if (!ruleset || !rulesetId) return;

        try {
            const updatedRuleset = {
                ...ruleset,
                controls: controls
            };

            await fetch(`${environment.API_URL}/rulesets/api/update/${rulesetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRuleset),
            });

            const publishResponse = await fetch(`${environment.API_URL}/rulesets/api/publish/${rulesetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!publishResponse.ok) {
                throw new Error('Failed to publish ruleset');
            }

            const publishData = await publishResponse.json();
            console.log("Ruleset publicado:", publishData.message);

            alert(t('rulesets.creator.success.publish'));
            router.push(`/rulesets/get/${rulesetId}`);
        } catch (error) {
            console.error('Error publishing ruleset:', error);
            alert(t('rulesets.creator.error.publish'));
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden h-100vh shadow-lg border-tertiary-color/20">
                <CardContent className="p-0 h-full">
                    <div className="bg-contrast-color/10 border-b border-tertiary-color/20 p-4 flex justify-between items-center">
                        <h3 className="font-medium text-primary-color">{t('rulesets.creator.documentViewer')}</h3>
                        <div className="flex gap-2">
                            <Button
                                onClick={saveAllControls}
                                size="sm"
                                className="bg-primary-color hover:bg-primary-color/90 text-white"
                            >
                                {t('rulesets.creator.saveRuleset')}
                            </Button>
                            <Button
                                onClick={openDialog}
                                variant="outline"
                                size="sm"
                                className="bg-contrast-2-color/10 hover:bg-contrast-2-color/30 text-primary-color border-tertiary-color/30"
                            >
                                <Plus size={16} className="mr-1" /> {t('rulesets.creator.addRule')}
                            </Button>
                        </div>
                    </div>
                    <div className="p-4 overflow-auto h-[calc(100%-4rem)]">
                        <Viewer fileUrl={fileUrl!} onTextSelection={handleTextSelection} />
                    </div>
                </CardContent>
            </Card>

            {/* Botón para finalizar la normativa */}
            <div className="flex justify-center mt-6 mb-12">
                <FinishRulesetButton 
                    rulesetId={rulesetId}
                    rulesetName={ruleset?.name || t('rulesets.creator.thisRuleset')}
                    onFinish={handleFinishRuleset}
                />
            </div>

            {/* Diálogo flotante para crear normativa */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-in-out opacity-100">
                    <CreateNormativeItem 
                        onClose={closeDialog} 
                        selectedText={selectedText}
                        onSaveControl={handleSaveControl}
                    />
                </div>
            )}
        </div>
    );
};

export default RulesetCreator;
