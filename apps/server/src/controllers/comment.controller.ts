import { STATUS_CODES } from '../constants';
import { $lookupLikes, $lookupUserDetails } from '../db/aggregations';
import { Comment } from '../models/comment.model';
import { Like } from '../models/like.model';
import { validateRequest } from '../utils';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';
import asyncHandler from '../utils/async-handler';
import {
  deleteCommentSchema,
  replyToCommentSchema,
  toggleCommentLikeSchema,
  updateCommentSchema,
} from '../validations/comment.validation';

const toggleCommentLike = asyncHandler(async (req, res) => {
  const {
    params: { commentId },
  } = validateRequest(req, toggleCommentLikeSchema);

  const likeExists = await Like.findOne({
    $or: [
      {
        comment: commentId,
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
      comment: commentId,
    });

    if (!like) {
      throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to like.');
    }

    res
      .status(STATUS_CODES.CREATED)
      .json(new ApiResponse(STATUS_CODES.CREATED, 'Liked the comment.', like));
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const {
    params: { commentId },
    body: { content },
  } = validateRequest(req, updateCommentSchema);

  const commentExists = await Comment.findById(commentId);

  if (!commentExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Comment not found.');
  }

  if (!commentExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not authorized.');
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentExists._id,
    {
      $set: { content },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to update comment.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Updated comment.', updatedComment));
});

const deleteComment = asyncHandler(async (req, res) => {
  const {
    params: { commentId },
  } = validateRequest(req, deleteCommentSchema);

  const commentExists = await Comment.findById(commentId);

  if (!commentExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Comment not found.');
  }

  if (!commentExists.owner.equals(req.user?._id)) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Not authorized.');
  }

  const deleteStatus = await commentExists.deleteOne();

  if (!deleteStatus.acknowledged) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to delete comment.'
    );
  }

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, 'Deleted comment.', commentExists));
});

const replyToComment = asyncHandler(async (req, res) => {
  const {
    params: { commentId },
    body: { content },
  } = validateRequest(req, replyToCommentSchema);

  const commentExists = await Comment.findById(commentId);

  if (!commentExists) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Comment not found.');
  }

  const createdComment = await Comment.create({
    owner: req.user?._id,
    content,
    video: commentExists.video,
    inReplyTo: commentExists._id,
  });

  const comment = await Comment.aggregate([
    { $match: { _id: createdComment._id } },
    $lookupUserDetails(),
    $lookupLikes({ foreignField: 'comment' }),
    {
      $addFields: {
        owner: {
          $first: '$owner',
        },
        replies: [],
      },
    },
  ]);

  if (comment.length === 0) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to reply.');
  }

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(STATUS_CODES.CREATED, 'Replied to comment.', comment[0])
    );
});

export { toggleCommentLike, deleteComment, updateComment, replyToComment };
