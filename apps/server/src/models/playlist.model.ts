import { Schema, Types, model } from 'mongoose';

export interface IPlaylist {
  name: string;
  description: string;
  owner: Types.ObjectId;
  videos: Types.ObjectId[];
}

const playlistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
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
