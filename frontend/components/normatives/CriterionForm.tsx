import { useForm } from "react-hook-form";
import { Criterion, CycleStageEnum, SuitabilityEnum } from "@/types/Criterion";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

interface Props {
  criterion?: Criterion;
  onSave: (data: DataForm) => void;
  onDelete?: () => void;
  selectedText?: string;
}

interface DataForm {
  title: string;
  description: string;
  cycleStage: CycleStageEnum;
  suitabilities: SuitabilityEnum[];
}

export default function CriterionForm({
  criterion,
  onSave,
  onDelete,
  selectedText,
}: Props) {
  const {register, handleSubmit, setValue, formState: { errors, isSubmitting },} = useForm<DataForm>({
    defaultValues: criterion ?? {
      title: "",
      description: selectedText ?? "",
      suitabilities: [],
      cycleStage: "" as CycleStageEnum,
    },
  });

  const onSubmit = (data: DataForm) => {
    onSave(data);
  };

  function cambiar(): void {
    toast.success("Texto seleccionado: " + (selectedText || ""));
    if (selectedText) setValue("title", selectedText);
  }

  return (
    <>
      <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4">
          {criterion ? "Edit Criterion" : "Create Criterion"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Title:</label>
            <input type="text" {...register("title", { required: "Title is required" })} 
            className="w-full p-2 border rounded-md"/>
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Suitability:</label>
            <select {...register("suitabilities")} className="w-full p-2 border rounded-md">
              {Object.values(SuitabilityEnum).map((suitability) => (
                <option className="hover:cursor-pointer" key={suitability} value={suitability}>
                  {suitability}
                </option>
              ))}
            </select>
            {errors.suitabilities && (
              <p className="text-red-500">{errors.suitabilities.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Cycle Stage:</label>
            <select
              {...register("cycleStage", {required: "Cycle stage is required",})} className="w-full p-2 border rounded-md">
              {Object.values(CycleStageEnum).map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            {errors.cycleStage && (
              <p className="text-red-500">{errors.cycleStage.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Description:</label>
            <textarea {...register("description")} rows={6} className="w-full p-2 border rounded-md"/>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-400 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
      <Button
        className="hover:cursor-pointer hover:bg-gray-200"
        onClick={cambiar}
      >
        Cambiar
      </Button>
    </>
  );
}
