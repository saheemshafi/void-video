import mongoose, { Types } from 'mongoose';

export const COMMENT_TYPES = ['video', 'post'] as const;
export type COMMENT_TYPE = (typeof COMMENT_TYPES)[number];

export interface IComment {
  type: COMMENT_TYPE;
  content: string;
  video: Types.ObjectId;
  post: Types.ObjectId;
  owner: Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    type: {
      type: String,
      enum: COMMENT_TYPES,
    },
    content: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
