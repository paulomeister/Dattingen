"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Compulsoriness } from "@/types/Criterion";
import { AlertCircle, Save, Trash2, InfoIcon, AlertTriangle } from "lucide-react";

interface CompulsorinessFormProps {
  compulsoriness?: Compulsoriness;
  onSave: (data: Compulsoriness) => void;
  onDelete?: (id: string) => void;
}

const CompulsorinessForm: React.FC<CompulsorinessFormProps> = ({
  compulsoriness,
  onSave,
  onDelete,
}) => {
  const [term, setTerm] = useState(compulsoriness?.term || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // TODO: Implementar integración con API para guardar el término de obligatoriedad
    if (!term.trim()) {
      setError("Term cannot be empty");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Simular llamada a API
      await onSave({ 
        id: compulsoriness?.id || crypto.randomUUID(), 
        term 
      });
    } catch (error) {
      console.error("Error al guardar el término:", error);
      setError("Failed to save term. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // TODO: Implementar integración con API para eliminar el término de obligatoriedad
    if (!compulsoriness || !onDelete) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(compulsoriness.id);
    } catch (error) {
      console.error("Error al eliminar el término:", error);
      setError("Failed to delete term. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={18} className="text-secondary-color" />
        <h2 className="text-lg font-semibold text-secondary-color">
          {compulsoriness ? "Edit Term" : "Create Term"}
        </h2>
      </div>
      
      <div className="bg-secondary-color/5 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <InfoIcon size={16} className="text-secondary-color mt-0.5" />
          <p className="text-sm text-gray-600">
            Terms of obligation define the level of requirement for criteria in audits.
            Examples: "Must", "Should", "May".
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="term" className="text-sm font-medium text-gray-700">Term</Label>
        <Input
          id="term"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter obligation term"
          className={`border-tertiary-color/30 focus:border-secondary-color/50 focus:ring-secondary-color/20 transition-all
                      ${error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
        />
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
            <AlertTriangle size={14} />
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-secondary-color hover:bg-secondary-color/90 text-white flex items-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? "Saving..." : compulsoriness ? "Update Term" : "Save Term"}
        </Button>
        
        {compulsoriness && onDelete && (
          <Button
            onClick={handleDelete}
            disabled={isSubmitting}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompulsorinessForm;
