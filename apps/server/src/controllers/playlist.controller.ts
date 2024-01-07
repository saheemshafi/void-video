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
  addVideoToPlaylistValidation,
  changePlaylistThumbnailValidation,
  createPlaylistValidation,
  deletePlaylistValidation,
  updatePlaylistValidation,
} from '../validations/playlist.validation';

const createPlaylist = asyncHandler(async (req, res) => {
  const {
    body: { title, description, private: isPrivate },
    file: thumbnail,
  } = validateRequest(req, createPlaylistValidation);

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
  } = validateRequest(req, updatePlaylistValidation);

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
  } = validateRequest(req, deletePlaylistValidation);

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
  } = validateRequest(req, changePlaylistThumbnailValidation);

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
    params: { playlistId },
    body: { videoId },
  } = validateRequest(req, addVideoToPlaylistValidation);

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Playlist not found.');
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
    }
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

export {
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  changePlaylistThumbnail,
  addVideoToPlaylist,
};
