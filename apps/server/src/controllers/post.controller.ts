import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '../models/post.model';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import uploadToCloudinary, {
  mapToFileObject
} from '../utils/cloudinary';

const uploadPost = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, 'Content is required.');
  }

  const images: (UploadApiResponse | null)[] = [];

  if (Array.isArray(req.files) && req.files.length > 0) {
    const uploads = req.files.map((file) =>
      uploadToCloudinary(file.path, {
        folder: 'post-images',
      })
    );

    const uploadResponse = await Promise.allSettled(uploads);

    uploadResponse.forEach((upload) => {
      if (upload.status == 'fulfilled') {
        return images.push(upload.value);
      }
      throw new ApiError(500, 'Some images failed to upload.');
    });
  }

  const post = await Post.create({
    content,
    owner: req.user?._id,
    images: images?.map((upload) => mapToFileObject(upload)),
  });

  if (!post) {
    throw new ApiError(500, 'Failed to create post');
  }

  res.status(200).json(new ApiResponse(200, 'Created a post.', post));
});

const getPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, 'Post id not valid.');
  }

  const post = await Post.findById(postId).populate('owner', '-watchHistory');

  if (!post) {
    throw new ApiError(404, 'Post not found.');
  }

  res.status(200).json(new ApiResponse(200, 'Retrieved post.', post));
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {});
const deletePost = asyncHandler(async (req: Request, res: Response) => {});

const likePost = asyncHandler(async (req: Request, res: Response) => {});
const getPostComments = asyncHandler(async (req: Request, res: Response) => {});

export {
  deletePost, getPost, getPostComments, likePost, updatePost, uploadPost
};

