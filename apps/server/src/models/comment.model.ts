import mongoose, { AggregatePaginateModel, Types } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IComment {
  _id: Types.ObjectId;
  content: string;
  video: Types.ObjectId;
  post: Types.ObjectId;
  owner: Types.ObjectId;
  inReplyTo: Types.ObjectId;
}

type ICommentModel = AggregatePaginateModel<IComment>;

const commentSchema = new mongoose.Schema<IComment, ICommentModel>(
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
    inReplyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
commentSchema.plugin(mongooseAggregatePaginate as any);

export const Comment = mongoose.model(
  'Comment',
  commentSchema
) as ICommentModel;
