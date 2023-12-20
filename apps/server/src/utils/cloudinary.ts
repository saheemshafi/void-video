import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type Folder =
  | 'thumbnails'
  | 'videos'
  | 'avatars'
  | 'banners'
  | 'post-images'
  | (string & object);

async function uploadFileToCloudinary(
  filePath: string,
  options?: UploadApiOptions & { folder?: Folder }
) {
  if (!filePath) return null;
  console.log('Started uploading for ' + filePath);
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      ...options,
    });
    return uploadResponse;
  } catch (error) {
    console.log('CLOUDINARY: Failed to upload file. ', error);
    throw error;
  } finally {
    fs.unlinkSync(filePath);
  }
}

const mapToFileObject = (file: UploadApiResponse | null | undefined) => {
  if (!file) {
    return null;
  }

  return {
    secure_url: file?.secure_url,
    url: file?.url,
    width: file?.width,
    height: file?.height,
    public_id: file?.public_id,
    resource_type: file?.resource_type,
    duration: file?.duration ?? undefined,
  };
};

export default uploadFileToCloudinary;
export { mapToFileObject };
