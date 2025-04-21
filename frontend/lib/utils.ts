import { RoleEnum } from "@/types/RoleEnum";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserImage = (role: RoleEnum | undefined): string => {
  switch (role) {
    case "InternalAuditor":
      return "/images/avatars/internal_auditor.png";
    case "Coordinator":
      return "/images/avatars/coordinator.png";
    case "ExternalAuditor":
      return "/images/avatars/external_auditor.png";
    case "Admin":
      return "/images/avatars/admin.png";
    default:
      return "/images/avatars/default.png";
  }
};
