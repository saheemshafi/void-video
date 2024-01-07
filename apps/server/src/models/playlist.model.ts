import { Schema, Types, model } from 'mongoose';
import { IFileObject, fileSchema } from './file.model';

export interface IPlaylist {
  title: string;
  description?: string;
  owner: Types.ObjectId;
  videos: Types.ObjectId[];
  private: boolean;
  thumbnail: IFileObject;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    private: {
      type: Boolean,
      default: false,
    },
    thumbnail: fileSchema,
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  { timestamps: true }
);

export const Playlist = model('Playlist', playlistSchema);
