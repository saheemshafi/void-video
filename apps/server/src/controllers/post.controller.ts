import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '../models/post.model';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import { uploadFileToCloudinary, mapToFileObject } from '../utils/cloudinary';
import { STATUS_CODES } from '../constants';

const uploadPost = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Content is required.');
  }

  const images: (UploadApiResponse | null)[] = [];

  if (Array.isArray(req.files) && req.files.length > 0) {
    const uploads = req.files.map((file) =>
      uploadFileToCloudinary(file.path, {
        folder: 'post-images',
      })
    );

    const uploadResponse = await Promise.allSettled(uploads);

    uploadResponse.forEach((upload) => {
      if (upload.status == 'fulfilled') {
        return images.push(upload.value);
      }
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Some images failed to upload.'
      );
    });
  }

  const post = await Post.create({
    content,
    owner: req.user?._id,
    images: images?.map((upload) => mapToFileObject(upload)),
  });

  if (!post) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to create post'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Created a post.', post));
});

const getPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Post id not valid.');
  }

  const post = await Post.findById(postId).populate('owner', '-watchHistory');

  if (!post) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Post not found.');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Retrieved post.', post));
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {});
const deletePost = asyncHandler(async (req: Request, res: Response) => {});

const likePost = asyncHandler(async (req: Request, res: Response) => {});
const getPostComments = asyncHandler(async (req: Request, res: Response) => {});

export {
  deletePost,
  getPost,
  getPostComments,
  likePost,
  updatePost,
  uploadPost,
};
