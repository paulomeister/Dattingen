import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function UserInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: UserInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-primary-color">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        autoComplete="off"
        className="border-[#14213d] focus-visible:ring-secondary-color placeholder:text-gray-400"
      />
    </div>
  );
}
