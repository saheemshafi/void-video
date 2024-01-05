import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { PaginateOptions, Types } from 'mongoose';
import { STATUS_CODES } from '../constants';
import { Comment } from '../models/comment.model';
import { Like } from '../models/like.model';
import { Post } from '../models/post.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import { mapToFileObject, uploadFileToCloudinary } from '../utils/cloudinary';
import {
  addCommentToPostValidation,
  changePostImagesValidation,
  deletePostValidation,
  getPostCommentsValidation,
  getPostValidation,
  getPostsValidation,
  likePostValidation,
  updatePostValidation,
  uploadPostValidation,
} from '../validations/post.validation';

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

const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { content },
    params: { postId },
  } = validateRequest(req, updatePostValidation);

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Post not found.');
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: { content },
    },
    { new: true }
  );

  if (!updatedPost) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to update.');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Updated post.', updatedPost));
});

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

const likePost = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { postId },
  } = validateRequest(req, likePostValidation);

  const likeExists = await Like.findOne({
    $or: [
      {
        post: postId,
        likedBy: req.user?._id,
      },
    ],
  });

  if (likeExists) {
    const deletedLike = await Like.findByIdAndDelete(likeExists.id);

    if (!deletedLike) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to remove like.'
      );
    }

    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, 'Removed the like.', deletedLike));
  } else {
    const like = await Like.create({
      likedBy: req.user?._id,
      post: postId,
    });

    if (!like) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Like failed unexpectedly.'
      );
    }

    res
      .status(STATUS_CODES.CREATED)
      .json(new ApiResponse(STATUS_CODES.CREATED, 'Liked the post.', like));
  }
});

const changePostImages = asyncHandler(async (req, res) => {
  const {
    params: { postId },
    files,
    body: { replaceWithIds },
  } = validateRequest(req, changePostImagesValidation);

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Post not found');
  }

  let updatedPost;
  for (let i = 0; i < replaceWithIds.length; i++) {
    const imageId = replaceWithIds[i];
    const file = files[i];

    if (!file || !imageId) return;
    const uploadedImage = await uploadFileToCloudinary(file.path, {
      folder: 'post-images',
    });

    if (!uploadedImage) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to upload images.'
      );
    }

    updatedPost = await Post.findOneAndUpdate(
      {
        images: {
          $elemMatch: {
            public_id: {
              $eq: imageId,
            },
          },
        },
      },
      { $set: { 'images.$': mapToFileObject(uploadedImage) } },
      { new: true }
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Changed post images.', updatedPost)
    );
});

const getPostComments = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { postId },
    query: { page, limit },
  } = validateRequest(req, getPostCommentsValidation);

  const options: PaginateOptions = {
    page,
    limit,
  };

  const commentsAggregation = Comment.aggregate([
    {
      $match: {
        post: new Types.ObjectId(postId),
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
        foreignField: 'comment',
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
      },
    },
  ]);

  const { docs, ...paginationData } = await Comment.aggregatePaginate(
    commentsAggregation,
    options
  );

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Retrieved comments.', {
      comments: docs,
      ...paginationData,
    })
  );
});

const addCommentToPost = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { postId },
    body: { content },
  } = validateRequest(req, addCommentToPostValidation);

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    post: postId,
  });

  if (!comment) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to comment.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Commented on the post.', comment));
});

export {
  addCommentToPost,
  deletePost,
  getPost,
  getPostComments,
  getPosts,
  likePost,
  updatePost,
  uploadPost,
  changePostImages,
};
