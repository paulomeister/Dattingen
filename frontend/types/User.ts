import { RoleEnum } from "./RoleEnum";

// Define user model to match Java model
export interface UserDTO {
  _id: string | null;
  role: RoleEnum;
  bussinessId: string | null;
  language: string;
  name: string;
  username: string;
}
