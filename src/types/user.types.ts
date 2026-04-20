import { UserRole, UserStatus } from "../constants/user";

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  phone?: string | null;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
