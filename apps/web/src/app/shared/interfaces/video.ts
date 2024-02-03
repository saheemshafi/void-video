import { IFile } from '~shared/interfaces/file';
import { User } from '~shared/interfaces/api-response';

export interface Video {
  _id: string;
  title: string;
  description: string;
  likes: number;
  owner: User;
  source: IFile;
  thumbnail: IFile;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
