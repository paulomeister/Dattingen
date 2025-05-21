import { environment } from "@/env/environment.dev";
import { Associate } from "@/types/Associate";
import { ResponseDTO } from "@/types/ResponseDTO";
import { RoleEnum } from "@/types/RoleEnum";
import { Ruleset } from "@/types/Ruleset";
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
    case "admin":
      return "/images/avatars/admin.png";
    default:
      return "/images/avatars/default.jpg";
  }
};

export const getUserRole = (
  role: string,
  language: string | undefined
): string => {
  switch (role) {
    case "InternalAuditor":
      return language === "es" ? "Auditor Interno" : "Internal Auditor";
    case "Coordinator":
      return language === "es" ? "Coordinador" : "Coordinator";
    case "ExternalAuditor":
      return language === "es" ? "Auditor Externo" : "External Auditor";
    case "admin":
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
      ...(token && { Authorization: `${token}` }),
    },
    body: JSON.stringify(user),
  });

  return res.json();
}

export async function fetchRulesetData(
  rulesetId: string
): Promise<Ruleset | null> {
  try {
    const response = await fetch(
      `${environment.API_URL}/rulesets/api/${rulesetId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch the ruleset data");
    }

    const data = await response.json();
    return data; // Devolver los datos del ruleset
  } catch (error) {
    console.error("Error fetching ruleset data:", error);
    return null; // Devolver null si hay algún error
  }
}

export async function updateRuleset(
  rulesetId: string,
  updatedRuleset: Ruleset
): Promise<Response> {
  return await fetch(
    `${environment.API_URL}/rulesets/api/update/${rulesetId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRuleset),
    }
  );
}

export async function registerAuditors(
  businessId: string,
  associates: Associate[],
  token: string | null = null
): Promise<ResponseDTO<unknown>> {
  try {
    const response = await fetch(
      `${environment.API_URL}/businesses/api/business/registerAssociate/${businessId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token }),
        },
        body: JSON.stringify(associates), // Enviar directamente la lista de AsociateModel
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error registering auditors:", error);
    return {
      status: 500,
      message: "Error registering auditors",
      data: null,
    };
  }
}
