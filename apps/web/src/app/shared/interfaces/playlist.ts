import { User } from '~shared/interfaces/api-response';
import { IFile } from '~shared/interfaces/file';

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
