import { Schema, Types, model } from 'mongoose';

export interface ILike {
  comment: Types.ObjectId;
  video: Types.ObjectId;
  post: Types.ObjectId;
  likedBy: Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Like = model('Like', likeSchema);
