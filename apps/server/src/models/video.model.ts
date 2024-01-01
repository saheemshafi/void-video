import { Types, model, Schema, AggregatePaginateModel } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { IFileObject, fileSchema } from './file.model';

export interface IVideo {
  owner: Types.ObjectId;
  source: IFileObject;
  thumbnail: IFileObject;
  title: string;
  description: string;
  views: number;
  isPublished: boolean;
}

type IVideoModel = AggregatePaginateModel<IVideo>;

const videoSchema = new Schema<IVideo, IVideoModel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    source: fileSchema,
    thumbnail: fileSchema,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
videoSchema.plugin(mongooseAggregatePaginate as any);

export const Video = model('Video', videoSchema) as IVideoModel;
