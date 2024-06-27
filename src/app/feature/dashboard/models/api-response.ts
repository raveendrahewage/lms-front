import { SystemUser } from './system-user';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResult {
  token?: string;
  expiresIn?: Date;
  user?: SystemUser;
}
