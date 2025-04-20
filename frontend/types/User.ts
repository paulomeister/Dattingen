import { RoleEnum } from "./RoleEnum";

// Define user model to match Java model
export interface User {
  _id: string | null;
  username: string;
  name: string;
  email: string;
  password: string;
  language: string;
  role: RoleEnum;
  bussinessId: string | null;
}
