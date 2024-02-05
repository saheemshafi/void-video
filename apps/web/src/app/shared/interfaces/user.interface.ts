import { IFile } from '~shared/interfaces/file.interface';

export interface User {
  _id: string;
  avatar: IFile;
  displayName: string;
  username: string;
}
