import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RoleEnum } from "@/types/RoleEnum";
import { useLanguage } from "@/lib/LanguageContext";

interface RoleSelectorProps {
  value: RoleEnum;
  onChange: (value: RoleEnum) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {

  const { t } = useLanguage()

  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-primary-color">
        {t("auth.register.roles.role")}
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as RoleEnum)}>
        <SelectTrigger className="border-[#14213d] ">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem className="bg-white cursor-pointer hover:bg-secondary-color" value="InternalAuditor">{t("auth.register.roles.auditor")}</SelectItem>
          <SelectItem className="bg-white cursor-pointer hover:bg-secondary-color" value="Coordinator">{t("auth.register.roles.coordinator")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
