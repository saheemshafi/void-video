import { ApiResponse } from './api-response';
import { Session } from './session';

export type LoginResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: Session;
}>;

export type CreateAccountResponse = ApiResponse<Session>;

export interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: File;
  banner?: File;
}

export type SessionResponse = ApiResponse<Session>;
