import { environment } from "@/env/environment.dev";
import { ResponseDTO } from "@/types/ResponseDTO";
import { RoleEnum } from "@/types/RoleEnum";
import { UserDTO } from "@/types/User";
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
      return "/images/avatars/default.jpg";
  }
};

export const getUserRole = (role: string, language: string | undefined): string => {
  console.log(language)

  switch (role) {
    case "InternalAuditor":
      return language === "es" ? "Auditor Interno" : "Internal Auditor";
    case "Coordinator":
      return language === "es" ? "Coordinador" : "Coordinator";
    case "ExternalAuditor":
      return language === "es" ? "Auditor Externo" : "External Auditor";
    case "Admin":
      return language === "es" ? "Administrador" : "Admin";
    default:
      return language === "es" ? "Usuario" : "User";
  }
};

export async function createUser(
  user: UserDTO,
  token: string | null = null
): Promise<ResponseDTO<UserDTO>> {
  const res = await fetch(`${environment.API_URL}/users/api/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(user),
  });

  return res.json();
}
