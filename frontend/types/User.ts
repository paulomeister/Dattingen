import { RoleEnum } from "./RoleEnum";

// Define user model to match Java model
export interface User {
  authId: string | null;
  username: string;
  name: string;
  email: string;
  role: RoleEnum;
  bussinessId: string | null;
}
