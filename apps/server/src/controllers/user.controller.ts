import asyncHandler from '../utils/async-handler';
import {
  isValidObjectId,
  PaginateOptions,
  PipelineStage,
  Types,
} from 'mongoose';
import ApiError from '../utils/api-error';
import { Video } from '../models/video.model';
import ApiResponse from '../utils/api-response.js';
import { Post } from '../models/post.model';
import { Request, Response } from 'express';

const getUserVideos = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, 'User id passed is not valid.');
  }

  const { page, limit, include_unpublished } = req.query;

  const options: PaginateOptions = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  };

  const pipeline: PipelineStage[] = [
    {
      $match: {
        owner: new Types.ObjectId(userId),
      },
    },
  ];

  if (new RegExp('false').test(include_unpublished as string)) {
    pipeline.push({
      $match: {
        isPublished: true,
      },
    });
  }

  const aggregation = Video.aggregate(pipeline);

  const { docs, ...paginationData } = await Video.aggregatePaginate(
    aggregation,
    options
  );

  const videos = await Video.populate(docs, {
    path: 'owner',
    select: '-watchHistory',
  });

  res.status(200).json(
    new ApiResponse(200, 'User videos retrieved.', {
      ...paginationData,
      videos,
    })
  );
});

const getUserPosts = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, 'User id passed is not valid.');
  }

  const { page, limit } = req.query;

  const options: PaginateOptions = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  };

  const aggregation = Post.aggregate();
  const { docs, ...paginationOptions } = await Post.aggregatePaginate(
    aggregation,
    options
  );

  const posts = await Post.populate(docs, {
    path: 'owner',
    select: ['-watchHistory'],
  });

  res.status(200).json(
    new ApiResponse(200, 'User posts retrieved.', {
      posts,
      ...paginationOptions,
    })
  );
});

export { getUserVideos, getUserPosts };
