import { AggregatePaginateModel, Schema, Types, model } from 'mongoose';
import { IFileObject, fileSchema } from './file.model';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IPlaylist {
  title: string;
  description?: string;
  owner: Types.ObjectId;
  videos: Types.ObjectId[];
  private: boolean;
  thumbnail: IFileObject;
}

type IPlaylistModel = AggregatePaginateModel<IPlaylist>;

const playlistSchema = new Schema<IPlaylist, IPlaylistModel>(
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
playlistSchema.plugin(mongooseAggregatePaginate as any);

export const Playlist = model<IPlaylist, IPlaylistModel>(
  'Playlist',
  playlistSchema
);
