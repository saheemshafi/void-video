import { STATUS_CODES } from '../constants';
import { $aggregateSearch } from '../db/aggregations';
import { Playlist } from '../models/playlist.model';
import { User } from '../models/user.model';
import { Video } from '../models/video.model';
import { validateRequest } from '../utils';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import { suggestSearchTermsValidation } from '../validations/search.validation';

const suggestSearchTerms = asyncHandler(async (req, res) => {
  const {
    query: { searchTerm },
  } = validateRequest(req, suggestSearchTermsValidation);

  const playlistsAggregation = Playlist.aggregate([
    $aggregateSearch(searchTerm, ['title', 'description']),
    {
      $project: {
        _id: 0,
        title: 1,
      },
    },
  ]);

  const videosAggregation = Video.aggregate([
    $aggregateSearch(searchTerm, ['title', 'description']),
    {
      $project: {
        _id: 0,
        title: 1,
      },
    },
  ]);

  const usersAggregation = User.aggregate([
    $aggregateSearch(searchTerm, ['username', 'displayName']),
    {
      $project: {
        _id: 0,
        displayName: 1,
      },
    },
  ]);

  const [playlists, videos, users] = await Promise.all([
    playlistsAggregation,
    videosAggregation,
    usersAggregation,
  ]);

  const suggestions = new Set(
    playlists
      .concat(videos, users)
      .map((item) => item.displayName || item.title)
  );

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.OK,
        'Search suggestions retrieved.',
        Array.from(suggestions)
      )
    );
});

export { suggestSearchTerms };
