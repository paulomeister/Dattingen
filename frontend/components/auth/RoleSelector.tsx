import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RoleEnum } from "@/types/RoleEnum";

interface RoleSelectorProps {
  value: RoleEnum;
  onChange: (value: RoleEnum) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-[#14213d]">
        Role
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as RoleEnum)}>
        <SelectTrigger className="border-[#14213d] focus:ring-[#fca311]">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="InternalAuditor">Enterprise Auditor</SelectItem>
          <SelectItem value="Coordinator">Enterprise Coordinator</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
