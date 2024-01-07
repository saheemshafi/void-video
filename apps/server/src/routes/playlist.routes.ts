import { Router } from 'express';
import {
  addVideoToPlaylist,
  changePlaylistThumbnail,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylists,
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

playlistRouter.route('/').get(getPlaylists);
playlistRouter.route('/:playlistId').get(getPlaylist);

playlistRouter
  .route('/:playlistId/change-thumbnail')
  .patch(authorize, upload.single('thumbnail'), changePlaylistThumbnail);
playlistRouter
  .route('/:playlistId/add-video')
  .post(authorize, addVideoToPlaylist);

export default playlistRouter;
