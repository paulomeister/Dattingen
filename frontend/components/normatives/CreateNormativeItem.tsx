"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X, BookOpen } from "lucide-react";
import CriterionForm from "./CriterionForm";
import { Control } from "@/types/Ruleset";

interface CreateNormativeItemProps {
  onClose: () => void;
  selectedText: string;
  onSaveControl?: (control: Control) => void;
}

const CreateNormativeItem = ({
  onClose,
  selectedText,
  onSaveControl
}: CreateNormativeItemProps) => {

  // Añadimos estado para la animación de entrada/salida
  const [isExiting, setIsExiting] = useState(false);

  // Función mejorada para cerrar con animación
  const handleClose = () => {
    setIsExiting(true);
    // Espera a que termine la animación antes de cerrar realmente
    setTimeout(() => {
      onClose();
    }, 200); // Duración coincide con la transición CSS
  };

  // Función para manejar el guardado de un control
  const handleSaveCriterion = (data: Control) => {
    // Convertir los datos del formulario a un objeto Control
    if (onSaveControl) {
      const newControl: Control = {
        controlId: data.controlId || "", // El ID se generará en el componente padre si está vacío
        title: data.title,
        description: data.description,
        cycleStage: data.cycleStage,
        compulsoriness: data.compulsoriness || "", 
        suitability: " " 
      };

      onSaveControl(newControl);
    }

    // Cerrar después de guardar
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center 
      bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-in-out
      ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <Card
        className={`shadow-xl bg-white rounded-xl overflow-hidden w-full max-w-md border-tertiary-color/20
        transition-all duration-200 ease-in-out max-h-[90vh]
        ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <CardHeader className="flex justify-between items-center border-b border-tertiary-color/20 bg-gradient-to-r from-primary-color to-secondary-color text-white p-4 sticky top-0 z-10">
          <CardTitle className="text-xl font-bold">Create Rule</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0">
            <X size={20} />
          </Button>
        </CardHeader>

        {/* Contenedor con scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          <CardContent className="p-5">
            <div className="animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-4 text-primary-color">
                <BookOpen size={18} />
                <h3 className="font-medium">Create Criterion</h3>
              </div>
              <CriterionForm
                onSave={handleSaveCriterion}
                selectedText={selectedText}
              />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default CreateNormativeItem;
