import { Router } from 'express';
import {
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
} from '../controllers/playlist.controller';
import { authorize } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const playlistRouter = Router();

playlistRouter
  .route('/')
  .post(authorize, upload.single('thumbnail'), createPlaylist);
playlistRouter.route('/:playlistId').patch(authorize, updatePlaylist);
playlistRouter.route('/:playlistId').delete(authorize, deletePlaylist);

export default playlistRouter;
