import { Router } from 'express';
import {
  getVideo,
  likeVideo,
  uploadVideo,
  updateVideo,
  deleteVideo,
  getVideoComments,
  getVideos,
} from '../controllers/video.controller';
import { authorize } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const videoRouter = Router();

videoRouter.route('/').post(
  authorize,
  upload.fields([
    {
      name: 'thumbnail',
      maxCount: 1,
    },
    { name: 'video', maxCount: 1 },
  ]),
  uploadVideo
);

videoRouter.route('/').get(getVideos);
videoRouter.route('/:videoId').get(getVideo);
videoRouter.route('/:videoId/like').get(authorize, likeVideo);
videoRouter.route('/:videoId').put(authorize, updateVideo);
videoRouter.route('/:videoId').delete(authorize, deleteVideo);
videoRouter.route('/:videoId/comments').get(getVideoComments);

export default videoRouter;
