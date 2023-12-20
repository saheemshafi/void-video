import { PaginateOptions, isValidObjectId } from 'mongoose';
import { Comment } from '../models/comment.model';
import { Like } from '../models/like.model';
import { Video } from '../models/video.model';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import uploadFileToCloudinary, { mapToFileObject } from '../utils/cloudinary';

type IVideoUploadFiles =
  | {
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
    }
  | undefined;

/**
 * POST `/videos`
 * Controller for uploading a new video.
 */
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  if (![title, description].every(Boolean)) {
    throw new ApiError(400, 'All fields are required.');
  }

  const tempThumbnailPath = (<IVideoUploadFiles>req.files)?.thumbnail?.[0]
    ?.path;
  const tempVideoPath = (<IVideoUploadFiles>req.files)?.video?.[0]?.path;

  if (!tempVideoPath || !tempThumbnailPath) {
    throw new ApiError(400, 'Video or thumbnail is missing.');
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
    throw new ApiError(500, 'Video failed to upload.');
  }

  if (thumbnailUploadResponse?.status == 'rejected') {
    throw new ApiError(500, 'Thumbnail failed to upload.');
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
    throw new ApiError(500, 'Video uploading failed.');
  }

  res.status(201).json(new ApiResponse(201, 'Video uploaded.', video));
});

/**
 * GET `/videos/:videoId/like`
 * Controller for adding or toggling a like.
 */
const likeVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Video id is absent or not valid.');
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
      throw new ApiError(500, 'Failed to remove like.');
    }

    res
      .status(200)
      .json(new ApiResponse(200, 'Removed the like.', deletedLike));
  } else {
    const like = await Like.create({
      likedBy: req.user?._id,
      type: 'video',
      video: videoId,
    });

    if (!like) {
      throw new ApiError(500, 'Like failed unexpectedly.');
    }

    res.status(201).json(new ApiResponse(201, 'Liked the video.', like));
  }
});

/**
 * GET `/videos/:videoId`
 * Controller for retrieving a single video.
 */
const getVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Video Id absent or not valid.');
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, 'Video not found.');
  }

  res.status(200).json(new ApiResponse(200, 'Video retrieved.', video));
});

/**
 * PUT `/videos/:videoId`
 * Controller for updating a video.
 */
const updateVideo = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new ApiError(400, 'Provide fields to update');
  }

  const videoId = req.params.videoId;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Video Id absent or not valid.');
  }

  const existingVideo = await Video.findById(videoId);

  if (!existingVideo) {
    throw new ApiError(404, 'Video not found.');
  }

  if (!existingVideo.owner.equals(req.user?._id)) {
    throw new ApiError(401, 'Not Authorized.');
  }

  const { title, description, isPublished } = req.body;

  if (req.body.title) {
    existingVideo.title = title;
  }
  if (description) {
    existingVideo.description = description;
  }
  if (isPublished) {
    existingVideo.isPublished = isPublished;
  }

  const updatedVideo = await existingVideo.save();

  if (!updatedVideo) {
    throw new ApiError(500, 'Failed to update');
  }

  res.status(200).json(new ApiResponse(200, 'Video updated.', updatedVideo));
});

/**
 * DELETE `/videos/:videoId`
 * Controller for deleting a video.
 */
const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Video Id absent or not valid.');
  }

  const videoExists = await Video.findById(videoId);

  if (!videoExists) {
    throw new ApiError(404, 'Video not found.');
  }

  if (!videoExists.owner.equals(req.user?._id)) {
    throw new ApiError(401, 'Not authorized.');
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, 'Failed to delete.');
  }

  res.status(200).json(new ApiResponse(200, 'Deleted video.', deletedVideo));
});

/**
 * GET `/videos/:videoId/comments`
 * Controller for getting comments of a video.
 */
const getVideoComments = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Video Id absent or not valid.');
  }

  const comments = await Comment.find({ video: videoId });

  res
    .status(200)
    .json(new ApiResponse(200, 'Retrived comments.', { comments }));
});

/**
 * GET `/videos`
 * Controller for getting all videos.
 */
const getVideos = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const options: PaginateOptions = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  };

  const aggregation = Video.aggregate([{ $match: { isPublished: true } }]);
  const { docs, ...paginationData } = await Video.aggregatePaginate(
    aggregation,
    options
  );

  const videos = await Video.populate(docs, {
    path: 'owner',
    select: '-watchHistory',
  });

  res.status(200).json(
    new ApiResponse(200, 'Videos retrieved.', {
      ...paginationData,
      videos,
    })
  );
});

export {
  deleteVideo,
  getVideo,
  getVideoComments,
  getVideos,
  likeVideo,
  updateVideo,
  uploadVideo,
};
