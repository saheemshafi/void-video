import { PaginateOptions, Types, isValidObjectId } from 'mongoose';
import { Comment } from '../models/comment.model';
import { Like } from '../models/like.model';
import { Video } from '../models/video.model';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import { uploadFileToCloudinary, mapToFileObject } from '../utils/cloudinary';
import { STATUS_CODES } from '../constants';
import { validateRequest } from '../utils';
import {
  uploadVideoValidation,
  getVideoValidation,
  updateVideoValidation,
  deleteVideoValidation,
  getVideoCommentsValidation,
  getVideosValidation,
  addCommentToVideoValidation,
} from '../validations/video.validation';

/**
 * POST `/videos`
 * Controller for uploading a new video.
 */
const uploadVideo = asyncHandler(async (req, res) => {
  const {
    body: { title, description, isPublished },
    files,
  } = validateRequest(req, uploadVideoValidation);

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

  if (videoUploadResponse?.status == 'rejected') {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Video failed to upload.'
    );
  }

  if (thumbnailUploadResponse?.status == 'rejected') {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Thumbnail failed to upload.'
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

/**
 * GET `/videos/:videoId/like`
 * Controller for adding or toggling a like.
 */
const likeVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Video id is absent or not valid.'
    );
  }

  const likeExists = await Like.findOne({
    $or: [
      {
        video: videoId,
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
      video: videoId,
    });

    if (!like) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Like failed unexpectedly.'
      );
    }

    res
      .status(STATUS_CODES.CREATED)
      .json(new ApiResponse(STATUS_CODES.CREATED, 'Liked the video.', like));
  }
});

/**
 * GET `/videos/:videoId`
 * Controller for retrieving a single video.
 */
const getVideo = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
  } = validateRequest(req, getVideoValidation);

  const video = await Video.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(videoId),
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
        foreignField: 'video',
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

/**
 * PUT `/videos/:videoId`
 * Controller for updating a video.
 */
const updateVideo = asyncHandler(async (req, res) => {
  const {
    body: { title, description, isPublished },
    params: { videoId },
  } = validateRequest(req, updateVideoValidation);

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

/**
 * DELETE `/videos/:videoId`
 * Controller for deleting a video.
 */
const deleteVideo = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
  } = validateRequest(req, deleteVideoValidation);

  const videoExists = await Video.findById(videoId);

  if (!videoExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not found.');
  }

  if (!videoExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not authorized.');
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to delete.');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Deleted video.', deletedVideo));
});

/**
 * GET `/videos/:videoId/comments`
 * Controller for getting comments of a video.
 */
const getVideoComments = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
    query: { limit, page },
  } = validateRequest(req, getVideoCommentsValidation);

  const options: PaginateOptions = {
    page,
    limit,
  };

  const commentsAggregation = Comment.aggregate([
    {
      $match: {
        type: 'video',
        video: new Types.ObjectId(videoId),
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

/**
 * GET `/videos`
 * Controller for getting all videos.
 */
const getVideos = asyncHandler(async (req, res) => {
  const {
    query: { page, limit },
  } = validateRequest(req, getVideosValidation);

  const options: PaginateOptions = {
    page,
    limit,
  };

  const aggregation = Video.aggregate([{ $match: { isPublished: true } }]);
  const { docs, ...paginationData } = await Video.aggregatePaginate(
    aggregation,
    options
  );

  const videos = await Video.populate(docs, {
    path: 'owner',
    select: ['-watchHistory', '-banner'],
  });

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Videos retrieved.', {
      ...paginationData,
      videos,
    })
  );
});

/**
 * GET `/videos/:videoId/comments`
 * Controller for adding a comment to video.
 */
const addCommentToVideo = asyncHandler(async (req, res) => {
  const {
    params: { videoId },
    body: { content },
  } = validateRequest(req, addCommentToVideoValidation);

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
  deleteVideo,
  getVideo,
  getVideoComments,
  getVideos,
  likeVideo,
  updateVideo,
  uploadVideo,
  addCommentToVideo,
};
