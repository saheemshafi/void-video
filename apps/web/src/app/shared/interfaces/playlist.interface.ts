import { User } from '~/app/shared/interfaces/user.interface';
import { IFile } from '~/app/shared/interfaces/file.interface';
import { Populated, Prettify } from './utils.interface';
import { Video } from './video.interface';

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

export type PopulatedPlaylist = Prettify<
  Populated<Playlist, 'videos', Video[]>
>;
