import { ApiResponse } from '~/app/shared/interfaces/api-response.interface';
import { User } from '~/app/shared/interfaces/user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}
export type LoginResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: User;
}>;

export interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: File;
  banner?: File;
}
export type CreateAccountResponse = ApiResponse<User>;

export type UserResponse = ApiResponse<User>;
