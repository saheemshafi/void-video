import { PaginateOptions, Types } from 'mongoose';
import { STATUS_CODES } from '../constants';
import { Playlist } from '../models/playlist.model';
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
  reqWithVideoAndPlaylistIdSchema,
  changePlaylistThumbnailSchema,
  createPlaylistSchema,
  deletePlaylistSchema,
  getPlaylistSchema,
  getPlaylistsSchema,
  updatePlaylistSchema,
} from '../validations/playlist.validation';
import { $lookupUserDetails, $lookupVideoDetails } from '../db/aggregations';
import { Split } from '../types/utils.types';
import { SortOptions } from '../types/validation.types';

const createPlaylist = asyncHandler(async (req, res) => {
  const {
    body: { title, description, private: isPrivate },
    file: thumbnail,
  } = validateRequest(req, createPlaylistSchema);

  const thumbnailResponse = await uploadFileToCloudinary(thumbnail.path, {
    folder: 'thumbnails',
  });

  if (!thumbnailResponse) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload playlist thumbnail.'
    );
  }

  const playlist = await Playlist.create({
    title,
    description,
    private: isPrivate,
    owner: req.user?._id,
    thumbnail: mapToFileObject(thumbnailResponse),
  });

  if (!playlist) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to create playlist.'
    );
  }

  const createdPlaylist = await playlist.populate('owner', [
    '-banner',
    '-watchHistory',
    '-email',
  ]);

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        'Playlist created.',
        createdPlaylist
      )
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const {
    body: playlistDetails,
    params: { playlistId },
  } = validateRequest(req, updatePlaylistSchema);

  const playlistExists = await Playlist.findById(playlistId);

  if (!playlistExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistExists._id,
    {
      $set: playlistDetails,
    },
    { new: true }
  );

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Playlist updated.', updatedPlaylist)
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const {
    params: { playlistId },
  } = validateRequest(req, deletePlaylistSchema);

  const playlistExists = await Playlist.findById(playlistId);

  if (!playlistExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
  }

  if (!playlistExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not Authorized.');
  }

  const deleteStatus = await playlistExists.deleteOne();

  if (!deleteStatus.acknowledged) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to delete playlist.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Playlist deleted.', playlistExists)
    );
});

const changePlaylistThumbnail = asyncHandler(async (req, res) => {
  const {
    params: { playlistId },
    file: thumbnail,
  } = validateRequest(req, changePlaylistThumbnailSchema);

  const playlistExists = await Playlist.findById(playlistId);

  if (!playlistExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
  }

  if (!playlistExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not authorized.');
  }

  const thumbnailResponse = await uploadFileToCloudinary(thumbnail.path, {
    folder: 'thumbnails',
  });

  if (!thumbnailResponse) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload thumbnail.'
    );
  }

  const playlistWithUpdatedThumbnail = await Playlist.findByIdAndUpdate(
    playlistExists._id,
    {
      $set: {
        thumbnail: mapToFileObject(thumbnailResponse),
      },
    },
    { new: true }
  );

  if (!playlistWithUpdatedThumbnail) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to change thumbnail.'
    );
  }

  await removeFilesFromCloudinary(playlistExists.thumbnail.public_id);

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Changed playlist thumbnail.',
        playlistWithUpdatedThumbnail
      )
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const {
    params: { playlistId, videoId },
  } = validateRequest(req, reqWithVideoAndPlaylistIdSchema);

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
  }

  if (playlist.videos.includes(new Types.ObjectId(videoId))) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Video is already in playlist.');
  }

  const video = await Video.findById(videoId).populate('owner', [
    '-watchHistory',
    '-banner',
    '-email',
  ]);

  if (!video) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not found.');
  }

  const playlistWithAddedVideo = await Playlist.findByIdAndUpdate(
    playlist._id,
    {
      $push: {
        videos: video._id,
      },
    },
    { new: true }
  );

  if (!playlistWithAddedVideo) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to add video to playlist.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Video added to playlist.', video));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const {
    params: { playlistId, videoId },
  } = validateRequest(req, reqWithVideoAndPlaylistIdSchema);

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
  }

  if (!playlist.videos.includes(new Types.ObjectId(videoId))) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video is not in playlist.');
  }

  const playlistWithRemovedVideo = await Playlist.findByIdAndUpdate(
    playlist._id,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!playlistWithRemovedVideo) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to remove video from playlist.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Video removed from playlist.',
        playlistWithRemovedVideo
      )
    );
});

const getPlaylist = asyncHandler(async (req, res) => {
  const {
    params: { playlistId },
  } = validateRequest(req, getPlaylistSchema);

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(playlistId),
      },
    },
    $lookupUserDetails(),
    $lookupVideoDetails(),
    {
      $addFields: {
        owner: {
          $first: '$owner',
        },
        totalVideos: {
          $size: '$videos',
        },
      },
    },
    {
      $project: {
        owner: 1,
        title: 1,
        videos: 1,
        views: 1,
        totalVideos: 1,
        description: 1,
        private: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (playlist.length == 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Playlist retrieved.', playlist[0]));
});

const getPlaylists = asyncHandler(async (req, res) => {
  const {
    query: { page, limit, sort, query, userId },
  } = validateRequest(req, getPlaylistsSchema);

  const options: PaginateOptions = {
    page,
    limit,
  };

  const [sortByKey, sortType] = <Split<SortOptions>>sort.split('.');

  const playlistsAggregation = Playlist.aggregate([
    {
      $match: {
        private: false,
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
      $addFields: {
        owner: {
          $first: '$owner',
        },
        totalVideos: {
          $size: '$videos',
        },
      },
    },
    {
      $project: {
        owner: 1,
        totalVideos: 1,
        title: 1,
        description: 1,
        views: 1,
        thumbnail: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const { docs, ...paginationData } = await Playlist.aggregatePaginate(
    playlistsAggregation,
    options
  );

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, 'Playlists retrieved.', {
      playlists: docs,
      ...paginationData,
    })
  );
});

export {
  addVideoToPlaylist,
  changePlaylistThumbnail,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylists,
  updatePlaylist,
  removeVideoFromPlaylist,
};
