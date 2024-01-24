import { PaginateOptions, Types } from 'mongoose';
import { STATUS_CODES } from '../constants';
import { Comment } from '../models/comment.model';
import { Like } from '../models/like.model';
import { Video } from '../models/video.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import {
  mapToFileObject,
  removeFilesFromCloudinary,
  uploadFileToCloudinary,
} from '../utils/cloudinary';
import {
  addCommentToVideoSchema,
  changeVideoThumbnailSchema,
  deleteVideoSchema,
  getVideoCommentsSchema,
  getVideoSchema,
  getVideosSchema,
  toggleVideoLikeSchema,
  updateVideoSchema,
  uploadVideoSchema,
} from '../validations/video.validation';
import { Split } from '../types/utils.types';
import { VideoSortOptions } from '../types/validation.types';
import {
  $lookupLikes,
  $lookupSubscriptions,
  $lookupUserDetails,
} from '../db/aggregations';

const uploadVideo = asyncHandler(async (req, res) => {
  const {
    body: { title, description, isPublished },
    files,
  } = validateRequest(req, uploadVideoSchema);

  const tempThumbnailPath = files.thumbnail[0]?.path;
  const tempVideoPath = files.video[0]?.path;

  if (!tempThumbnailPath || !tempVideoPath) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Video or thumbnail failed to upload.'
    );
  }

  const uploads = [
    uploadFileToCloudinary(tempVideoPath, {
      folder: 'videos',
      resource_type: 'video',
      media_metadata: true,
    }),
    uploadFileToCloudinary(tempThumbnailPath, { folder: 'thumbnails' }),
  ];

  const [videoUploadResponse, thumbnailUploadResponse] =
    await Promise.allSettled(uploads);

  if (
    videoUploadResponse?.status == 'rejected' ||
    thumbnailUploadResponse?.status == 'rejected'
  ) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload video.'
    );
  }

  const video = await Video.create({
    owner: req.user?._id,
    title,
    description,
    isPublished,
    source: mapToFileObject(videoUploadResponse?.value),
    thumbnail: mapToFileObject(thumbnailUploadResponse?.value),
  });

  if (!video) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Video uploading failed.'
    );
  }

  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, 'Video uploaded.', video));
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
  } = validateRequest(req, toggleVideoLikeSchema);

  const likeExists = await Like.findOne({
    $or: [
      {
        video: videoId,
        likedBy: req.user?._id,
      },
    ],
  });

  if (likeExists) {
    const deleteStatus = await likeExists.deleteOne();

    if (!deleteStatus.acknowledged) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to remove like.'
      );
    }

    res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, 'Removed the like.', likeExists));
  } else {
    const like = await Like.create({
      likedBy: req.user?._id,
      video: videoId,
    });

    if (!like) {
      throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to like.');
    }

    res
      .status(STATUS_CODES.CREATED)
      .json(new ApiResponse(STATUS_CODES.CREATED, 'Liked the video.', like));
  }
});

const getVideo = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
  } = validateRequest(req, getVideoSchema);

  const video = await Video.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        ...$lookupUserDetails().$lookup,
        pipeline: [
          {
            $lookup: {
              from: 'subscriptions',
              localField: '_id',
              foreignField: 'channel',
              as: 'subscriptionDetails',
              pipeline: [
                {
                  $match: {
                    subscriber: req.user?._id,
                  },
                },
              ],
            },
          },
          $lookupSubscriptions(),
          {
            $addFields: {
              isSubscribed: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $size: '$subscriptionDetails',
                      },
                      0,
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
              totalSubscribers: {
                $size: '$subscribers',
              },
            },
          },
          {
            $project: {
              ...$lookupUserDetails().$lookup.pipeline[0]?.$project,
              isSubscribed: 1,
              totalSubscribers: 1,
            },
          },
        ],
      },
    },
    $lookupLikes(),
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
        owner: 1,
        source: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        likes: 1,
        isPublished: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (video.length == 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not found.');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Video retrieved.', video[0]));
});

const updateVideo = asyncHandler(async (req, res) => {
  const {
    body: { title, description, isPublished },
    params: { videoId },
  } = validateRequest(req, updateVideoSchema);

  const existingVideo = await Video.findById(videoId);

  if (!existingVideo) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not found.');
  }

  if (!existingVideo.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not Authorized.');
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    existingVideo._id,
    {
      $set: { title, description, isPublished },
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to update');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Video updated.', updatedVideo));
});

const changeVideoThumbnail = asyncHandler(async (req, res) => {
  const {
    file: thumbnail,
    params: { videoId },
  } = validateRequest(req, changeVideoThumbnailSchema);

  const videoExists = await Video.findById(videoId);

  if (!videoExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not found.');
  }

  const thumbnailUploadResponse = await uploadFileToCloudinary(thumbnail.path, {
    folder: 'thumbnails',
  });

  if (!thumbnailUploadResponse) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to upload.');
  }

  const videoWithUpdatedThumbnail = await Video.findByIdAndUpdate(videoId, {
    $set: { thumbnail: mapToFileObject(thumbnailUploadResponse) },
  });

  await removeFilesFromCloudinary(videoExists.thumbnail.public_id);

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Changed thumbnail.',
        videoWithUpdatedThumbnail
      )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
  } = validateRequest(req, deleteVideoSchema);

  const videoExists = await Video.findById(videoId);

  if (!videoExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not found.');
  }

  if (!videoExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not authorized.');
  }

  const deleteStatus = await videoExists.deleteOne();

  if (!deleteStatus.acknowledged) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to delete video.'
    );
  }

  await removeFilesFromCloudinary(
    videoExists.thumbnail.public_id,
    videoExists.source.public_id
  );

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Deleted video.', videoExists));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
    query: { limit, page },
  } = validateRequest(req, getVideoCommentsSchema);

  const options: PaginateOptions = {
    page,
    limit,
  };

  const commentsAggregation = Comment.aggregate([
    {
      $match: {
        video: new Types.ObjectId(videoId),
      },
    },
    $lookupUserDetails(),
    $lookupLikes({ foreignField: 'comment' }),
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
        owner: 1,
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

const getVideos = asyncHandler(async (req, res) => {
  const {
    query: { page, limit, sort, query, userId },
  } = validateRequest(req, getVideosSchema);

  const options: PaginateOptions = {
    page,
    limit,
  };

  const [sortByKey, sortType] = <Split<VideoSortOptions>>sort.split('.');

  const aggregation = Video.aggregate([
    {
      $match: {
        isPublished: true,
        owner: userId
          ? new Types.ObjectId(userId)
          : {
              $exists: true,
            },
      },
    },
    {
      $match: {
        $or: [
          {
            title: {
              $regex: query,
              $options: 'i',
            },
          },
        ],
      },
    },
    {
      $sort: {
        [sortByKey]: sortType == 'asc' ? 1 : -1,
      },
    },
    $lookupUserDetails(),
    {
      $unwind: '$owner',
    },
  ]);
  const { docs, ...paginationData } = await Video.aggregatePaginate(
    aggregation,
    options
  );

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Videos retrieved.', {
      videos: docs,
      ...paginationData,
    })
  );
});

const addCommentToVideo = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
    body: { content },
  } = validateRequest(req, addCommentToVideoSchema);

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to comment.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Commented on the video.', comment));
});

export {
  addCommentToVideo,
  changeVideoThumbnail,
  deleteVideo,
  getVideo,
  getVideoComments,
  getVideos,
  toggleVideoLike,
  updateVideo,
  uploadVideo,
};
