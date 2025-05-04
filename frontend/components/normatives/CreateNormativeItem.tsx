"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X, CheckCircle, BookOpen } from "lucide-react";
import CriterionForm from "./CriterionForm";

const CreateNormativeItem = ({
  onClose,
  selectedText,
}: {
  onClose: () => void;
  selectedText: string;
}) => {
  // Estado para gestionar el formulario seleccionado
  const [selectedForm, setSelectedForm] = useState<"Criterion" | null>(null);

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

  return (
    <div className={`relative inset-0 z-50 flex items-center justify-center 
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
            {selectedText && (
              <div className="mb-5 p-3 bg-contrast-color/10 rounded-lg border border-tertiary-color/20">
                <p className="text-sm text-gray-500 mb-2 font-medium">Selected text:</p>
                <p className="text-sm italic text-gray-700 break-words">{selectedText}</p>
              </div>
            )}

            {!selectedForm ? (
              <div className="grid grid-cols-1 gap-4">
                <p className="text-gray-600 mb-2">What type of rule do you want to create?</p>
                <Button
                  className="bg-primary-color hover:bg-primary-color/90 text-white shadow-md flex items-center justify-start gap-3 p-4 h-auto"
                  onClick={() => setSelectedForm("Criterion")} // Solo permite crear Criterion
                >
                  <CheckCircle size={20} />
                  <div className="text-left">
                    <p className="font-medium">Criterion</p>
                    <p className="text-xs text-white/80 font-light">Create evaluation criteria for audits</p>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="flex items-center gap-2 mb-4 text-primary-color">
                  <BookOpen size={18} />
                  <h3 className="font-medium">Create Criterion</h3>
                </div>
                {/* Solo renderiza CriterionForm */}
                <CriterionForm
                  onSave={() => setSelectedForm(null)}
                  selectedText={selectedText}
                />
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default CreateNormativeItem;
