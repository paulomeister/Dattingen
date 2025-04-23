import { Language } from "@/lib/LanguageContext";
import { RoleEnum } from "./RoleEnum";

export interface User {
  _id: string | null;
  businessId: string | null;
  email: string;
  language: Language;
  name: string;
  role: RoleEnum;
  username: string;
  password: string; // TODO quitar la contraseña
}

// Define user model to match Java model
export interface UserDTO {
  _id: string | null;
  role: RoleEnum;
  businessId: string | null;
  language: Language;
  name: string;
  username: string;
}
