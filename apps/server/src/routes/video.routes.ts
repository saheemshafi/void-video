import { Router } from 'express';
import {
  getVideo,
  toggleVideoLike,
  uploadVideo,
  updateVideo,
  deleteVideo,
  getVideoComments,
  getVideos,
  addCommentToVideo,
  changeVideoThumbnail,
} from '../controllers/video.controller';
import { authorize } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const videoRouter = Router();

videoRouter
  .route('/')
  .post(
    authorize(),
    upload.fields([
      {
        name: 'thumbnail',
        maxCount: 1,
      },
      { name: 'video', maxCount: 1 },
    ]),
    uploadVideo
  )
  .get(getVideos);

videoRouter
  .route('/:videoId')
  .get(authorize(true), getVideo)
  .patch(authorize(), updateVideo)
  .delete(authorize(), deleteVideo);

videoRouter
  .route('/:videoId/change-thumbnail')
  .patch(authorize(), changeVideoThumbnail);

videoRouter
  .route('/:videoId/comments')
  .get(getVideoComments)
  .post(authorize(), addCommentToVideo);

videoRouter.route('/:videoId/toggle-like').get(authorize(), toggleVideoLike);

export default videoRouter;
