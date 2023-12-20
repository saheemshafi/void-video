import mongoose, { Types } from 'mongoose';

export interface IComment {
  content: string;
  video: Types.ObjectId;
  post: Types.ObjectId;
  owner: Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
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
