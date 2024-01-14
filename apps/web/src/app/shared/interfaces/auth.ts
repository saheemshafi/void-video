import { ApiResponse } from './api-response';
import { Session } from './session';

export type LoginResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: Session;
}>;

export type SessionResponse = ApiResponse<Session>;
