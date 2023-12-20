import { JwtPayload as JWTPayload } from 'jsonwebtoken';
import { IUser } from './src/models/user.model';

type User = Omit<IUser, 'refreshToken' | 'watchHistory' | 'password'>;

declare module 'jsonwebtoken' {
  interface JwtPayload extends JWTPayload {
    id: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
