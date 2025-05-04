import { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BookOpen, Save, Trash2, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../button";

interface Props {
  criterion?: Control;
  onSave: (data: Control) => void; // Cambié el tipo a `Control`
  onDelete?: (controlId: string) => void;
  selectedText?: string;
}

export default function CriterionForm({
  criterion,
  onSave,
  onDelete,
  selectedText,
}: Props) {
  const [compulsoriness, setCompulsoriness] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Control>({
    defaultValues: criterion ?? {
      controlId: "", // Asegúrate de inicializarlo correctamente
      title: "",
      description: selectedText ?? "",
      suitability: "", // Asegúrate de manejarlo correctamente
      cycleStage: "",
      compulsoriness: "", // Deja compulsoriness como string
    },
  });

  const onSubmit = async (data: Control) => {
    setIsSubmitting(true);
    try {
      await onSave(data); // Enviamos el control directamente
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
    } finally {
      setLoading(false);  // Finaliza el estado de carga
    }
  };
  //TODO MEJORANDOOO

  function updateTitleFromSelection(): void {
    if (selectedText) setValue("title", selectedText);
  }

  return (
    <div className="space-y-4 bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={18} className="text-primary-color" />
        <h2 className="text-lg font-semibold text-primary-color">
          {criterion ? "Edit Criterion" : "Create Criterion"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter criterion title"
            className={`border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all
                       ${errors.title ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {errors.title.message}
            </p>
          )}
          {selectedText && (
            <Button
              type="button"
              variant="ghost"
              className="text-xs text-secondary-color hover:text-secondary-color hover:bg-secondary-color/10 px-2 py-1 h-auto"
              onClick={updateTitleFromSelection}
            >
              Use selected text as title
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="suitability" className="text-sm font-medium text-gray-700">Suitability</Label>
          <Select {...register("suitability")}>
            <SelectTrigger className="border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all">
              <SelectValue placeholder="Select suitability" />
            </SelectTrigger>
            <SelectContent>{
              compulsoriness.map((suitability) => (
                <SelectItem key={suitability} value={suitability}>
                  {suitability}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.suitability && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {errors.suitability.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cycleStage" className="text-sm font-medium text-gray-700">Cycle Stage</Label>
          <Select {...register("cycleStage", { required: "Cycle stage is required" })}>
            <SelectTrigger className={`border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all
                           ${errors.cycleStage ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}>
              <SelectValue placeholder="Select cycle stage" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CycleStageEnum).map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cycleStage && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {errors.cycleStage.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
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
