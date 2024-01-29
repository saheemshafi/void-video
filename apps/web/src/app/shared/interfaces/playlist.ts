import { User } from './api-response';
import { IFile } from './file';

export interface Playlist {
  _id: string;
  title: string;
  description?: string;
  owner: User;
  videos: Array<string>;
  private: boolean;
  thumbnail: IFile;
  views: number;
  totalVideos: number;
}
