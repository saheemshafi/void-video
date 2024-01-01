import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { PaginateOptions, Types, isValidObjectId } from 'mongoose';
import { Post } from '../models/post.model';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import { uploadFileToCloudinary, mapToFileObject } from '../utils/cloudinary';
import { STATUS_CODES } from '../constants';
import { validateRequest } from '../utils';
import {
  deletePostValidation,
  getPostValidation,
  getPostsValidation,
  uploadPostValidation,
} from '../validations/post.validation';

/**
 * POSTS `/posts`
 * Controller uploading a post.
 */
const uploadPost = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { content },
    files,
  } = validateRequest(req, uploadPostValidation);

  const images: (UploadApiResponse | null)[] = [];

  if (files.length > 0) {
    const uploads = files.map((file) =>
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

/**
 * GET `/posts`
 * Controller getting all posts.
 */
const getPosts = asyncHandler(async (req, res) => {
  const {
    query: { page, limit },
  } = validateRequest(req, getPostsValidation);

  const options: PaginateOptions = { page, limit };

  const aggregation = Post.aggregate();
  const { docs, ...paginationData } = await Post.aggregatePaginate(
    aggregation,
    options
  );

  const posts = await Post.populate(docs, {
    path: 'owner',
    select: ['-watchHistory', '-banner'],
  });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Retrieved posts.', {
      ...paginationData,
      posts,
    })
  );
});

/**
 * GET `/posts/:postId`
 * Controller for getting a post.
 */
const getPost = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { postId },
  } = validateRequest(req, getPostValidation);

  const post = await Post.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'post',
        as: 'likes',
      },
    },
    {
      $addFields: {
        owner: {
          $first: '$owner',
        },
        likes: {
          $size: '$likes',
        },
      },
    },
    {
      $project: {
        owner: {
          username: 1,
          avatar: 1,
          displayName: 1,
        },
        content: 1,
        likes: 1,
        images: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (post.length == 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Post not found.');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Retrieved post.', post[0]));
});

/**
 * PATCH `/posts/:postId`
 * Controller for updating a post.
 */
const updatePost = asyncHandler(async (req: Request, res: Response) => {});

/**
 * DELETE `/posts/:postId`
 * Controller for deleting a post.
 */
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { postId },
  } = validateRequest(req, deletePostValidation);

  const postExists = await Post.findById(postId);

  if (!postExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Post not found.');
  }

  if (!postExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not authorized.');
  }

  const deletedPost = await Post.findByIdAndDelete(postExists._id);

  if (!deletedPost) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to delete post.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Deleted post.', deletedPost));
});

/**
 * GET `/posts/:postId/like`
 * Controller for liking a post.
 */
const likePost = asyncHandler(async (req: Request, res: Response) => {});

/**
 * GET `/posts/:postId/comments`
 * Controller for getting comments of a post.
 */
const getPostComments = asyncHandler(async (req: Request, res: Response) => {});

/**
 * POST `/posts/:postId/comments`
 * Controller for adding a comment to a post.
 */
const addCommentToPost = asyncHandler(
  async (req: Request, res: Response) => {}
);

export {
  deletePost,
  getPost,
  getPostComments,
  getPosts,
  likePost,
  updatePost,
  uploadPost,
  addCommentToPost,
};
