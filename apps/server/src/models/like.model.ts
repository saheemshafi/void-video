import { Schema, Types, model } from 'mongoose';

export const LIKE_TYPES = ['video', 'post', 'comment'] as const;
export type LIKE_TYPE = (typeof LIKE_TYPES)[number];

export interface ILike {
  type: LIKE_TYPE;
  comment: Types.ObjectId;
  video: Types.ObjectId;
  post: Types.ObjectId;
  likedBy: Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    type: {
      type: String,
      enum: LIKE_TYPES,
      required: true,
    },
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
