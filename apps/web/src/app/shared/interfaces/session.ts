import { IFile } from './file';

export interface Session {
  _id: string;
  avatar: IFile;
  displayName: string;
  username: string;
  watchHistory: Array<string>;
}
