import { ResourceType, UploadApiResponse } from 'cloudinary';
import { Schema } from 'mongoose';

export type FileProps =
  | 'secure_url'
  | 'url'
  | 'width'
  | 'height'
  | 'public_id'
  | 'resource_type'
  | 'duration';

export const resource_types: ResourceType[] = ['image', 'raw', 'video'];
export type IFileResponse = UploadApiResponse & { duration?: number };
export type IFileObject = Pick<IFileResponse, FileProps>;

const fileSchema = new Schema<IFileObject>({
  public_id: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  resource_type: {
    type: String,
    enum: resource_types,
  },
  duration: {
    type: Number,
  },
  url: {
    type: String,
  },
  secure_url: {
    type: String,
  },
});

export { fileSchema };
