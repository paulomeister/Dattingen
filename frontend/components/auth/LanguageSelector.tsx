import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/LanguageContext";

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-color" htmlFor="language">
                {t("auth.register.languages.language")}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full text-black font-italic  border-[#14213d]">
                    <SelectValue placeholder={t("auth.register.languages.language")} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="en">
                        {t("auth.register.languages.english")}
                    </SelectItem>
                    <SelectItem value="es">
                        {t("auth.register.languages.spanish")}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
