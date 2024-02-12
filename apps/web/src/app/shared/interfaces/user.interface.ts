import { IFile } from '~shared/interfaces/file.interface';

export interface User {
  _id: string;
  avatar: IFile;
  displayName: string;
  username: string;
}

export type Channel = User & {
  banner: IFile;
  isSubscribed: boolean;
  totalSubscribers: number;
  totalSubscriptions: number;
};
