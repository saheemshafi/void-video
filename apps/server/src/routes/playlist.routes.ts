import { Router } from 'express';
import {
  changePlaylistThumbnail,
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
playlistRouter
  .route('/:playlistId/change-thumbnail')
  .patch(authorize, upload.single('thumbnail'), changePlaylistThumbnail);

export default playlistRouter;
