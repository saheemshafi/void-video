import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { IFileObject, fileSchema } from './file.model';
import { AggregatePaginateModel, Schema, Types, model } from 'mongoose';

export interface IPost {
  owner: Types.ObjectId;
  content: string;
  images: IFileObject[];
}

type IPostModel = AggregatePaginateModel<IPost>;

const postSchema = new Schema<IPost, IPostModel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    images: [fileSchema],
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
postSchema.plugin(mongooseAggregatePaginate as any);

export const Post = model('Post', postSchema) as IPostModel;
