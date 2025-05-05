import { useState, useEffect } from "react";
import { environment } from "@/env/environment.dev";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BookOpen, Save, Trash2, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/AuthContext";
import { Control as RulesetControl, PHVAPhase, Ruleset } from "@/types/Ruleset";

interface Props {
  ruleset: Ruleset | null,
  criterion?: RulesetControl;
  onSave: (data: RulesetControl) => void;
  onDelete?: (controlId: string) => void;
  selectedText?: string;
}

export default function CriterionForm({
  criterion,
  onSave,
  onDelete,
  selectedText,
}: Props) {
  const { user } = useAuth();
  const [compulsoriness, setCompulsoriness] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cycleStageOptions, setCycleStageOptions] = useState<string[]>([]);

  // Estado para los valores del formulario
  const [formData, setFormData] = useState<RulesetControl>({
    controlId: criterion?.controlId || "",
    title: criterion?.title || "",
    description: criterion?.description || selectedText || "",
    cycleStage: criterion?.cycleStage || PHVAPhase.PLAN,
    compulsoriness: criterion?.compulsoriness || "",
  });

  const [errors, setErrors] = useState({
    title: "",
    compulsoriness: "",
    cycleStage: "",
  });

  useEffect(() => {
    fetchCompulsoriness();
    setCycleStageOptions(Object.values(PHVAPhase));
  }, [user?.language]);

  // Validación de los campos antes de enviar
  const validateForm = () => {
    const newErrors = { title: "", compulsoriness: "", cycleStage: "" };
    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.cycleStage) {
      newErrors.cycleStage = "Cycle stage is required";
      isValid = false;
    }

    if (!formData.compulsoriness) {
      newErrors.compulsoriness = "Compulsoriness is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log("Form Data:", formData); // Verifica los datos
      await onSave(formData);
    } catch (error) {
      console.error("Error al guardar el control:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCompulsoriness = async () => {
    try {
      const isSpanish = user?.language === "es";
      const res = await fetch(`${environment.API_URL}/rulesets/api/ListCompulsoriness${isSpanish ? "/es" : ""}`);
      const data = await res.json();
      setCompulsoriness(data);
    } catch (error) {
      console.error("Error al obtener los términos de compulsoriedad:", error);
    }
  };

  // Actualizar el estado del formulario cuando el valor cambia
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4 bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={18} className="text-primary-color" />
        <h2 className="text-lg font-semibold text-primary-color">
          {criterion ? "Edit Criterion" : "Create Criterion"}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter criterion title"
            className={`border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all
                       ${errors.title ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="compulsoriness" className="text-sm font-medium text-gray-700">
            Compulsoriness
          </Label>
          <Select
            value={formData.compulsoriness}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, compulsoriness: value }))
            }
          >
            <SelectTrigger className="border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all">
              <SelectValue placeholder="Select compulsoriness" />
            </SelectTrigger>
            <SelectContent>
              {compulsoriness.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.compulsoriness && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {errors.compulsoriness}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cycleStage" className="text-sm font-medium text-gray-700">
            Cycle Stage
          </Label>
          <Select
            value={formData.cycleStage}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, cycleStage: value as PHVAPhase }))
            }
          >
            <SelectTrigger className="border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all">
              <SelectValue placeholder="Select cycle stage" />
            </SelectTrigger>
            <SelectContent>
              {cycleStageOptions.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cycleStage && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {errors.cycleStage}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter criterion description"
            className="border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all resize-none"
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-color hover:bg-primary-color/90 text-white flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? "Saving..." : "Save Criterion"}
          </Button>
          {criterion && onDelete && (
            <Button
              type="button"
              onClick={() => onDelete(criterion.controlId)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
