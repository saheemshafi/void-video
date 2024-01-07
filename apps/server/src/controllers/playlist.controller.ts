import { UploadApiResponse } from 'cloudinary';
import { Playlist } from '../models/playlist.model';
import { validateRequest } from '../utils';
import asyncHandler from '../utils/async-handler';
import { mapToFileObject, uploadFileToCloudinary } from '../utils/cloudinary';
import {
  createPlaylistValidation,
  updatePlaylistValidation,
} from '../validations/playlist.validation';
import ApiError from '../utils/api-error';
import { STATUS_CODES } from '../constants';
import ApiResponse from '../utils/api-response';

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
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(STATUS_CODES.OK, 'Playlist created.', createdPlaylist)
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

export { createPlaylist, updatePlaylist };
