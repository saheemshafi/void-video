import { PipelineStage } from 'mongoose';

type ILookupOptions = {
  localField?: string;
  foreignField?: string;
  as?: string;
};

export const $lookupUserDetails = (lookupOptions?: ILookupOptions) => ({
  $lookup: {
    from: 'users',
    localField: lookupOptions?.localField || 'owner',
    foreignField: lookupOptions?.foreignField || '_id',
    as: lookupOptions?.as || 'owner',
    pipeline: [
      {
        $project: {
          username: 1,
          displayName: 1,
          avatar: 1,
        },
      },
    ],
  },
});

export const $lookupVideoDetails = (lookupOptions?: ILookupOptions) => ({
  $lookup: {
    from: 'videos',
    localField: lookupOptions?.localField || 'videos',
    foreignField: lookupOptions?.foreignField || '_id',
    as: lookupOptions?.as || 'videos',
    pipeline: [
      $lookupUserDetails(),
      {
        $addFields: {
          owner: {
            $first: '$owner',
          },
        },
      },
    ],
  },
});

export const $lookupLikes = (
  lookupOptions?: ILookupOptions
): PipelineStage => ({
  $lookup: {
    from: 'likes',
    localField: lookupOptions?.localField || '_id',
    foreignField: lookupOptions?.foreignField || 'video',
    as: lookupOptions?.as || 'likes',
  },
});

export const $lookupSubscriptions = (
  lookupOptions?: ILookupOptions
): PipelineStage => ({
  $lookup: {
    from: 'subscriptions',
    localField: lookupOptions?.localField || '_id',
    foreignField: lookupOptions?.foreignField || 'channel',
    as: lookupOptions?.as || 'subscribers',
  },
});
