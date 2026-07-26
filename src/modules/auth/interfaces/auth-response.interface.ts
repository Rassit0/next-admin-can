import { PermissionModule } from "@/modules/roles";

export interface IAuthResponse {
  message: string;
  data: AuthData;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  roleId: string;
  modules: PermissionModule[];
  person?: {
    name: string;
    lastName: string;
    email: string;
  } | null;
}
