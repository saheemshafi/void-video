import { Router } from 'express';
import {
  addVideoToPlaylist,
  changePlaylistThumbnail,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylists,
  updatePlaylist,
  removeVideoFromPlaylist,
} from '../controllers/playlist.controller';
import { authorize } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const playlistRouter = Router();

playlistRouter
  .route('/')
  .post(authorize, upload.single('thumbnail'), createPlaylist)
  .get(getPlaylists);

playlistRouter
  .route('/:playlistId')
  .get(getPlaylist)
  .patch(authorize, updatePlaylist)
  .delete(authorize, deletePlaylist);

playlistRouter
  .route('/:playlistId/change-thumbnail')
  .patch(authorize, upload.single('thumbnail'), changePlaylistThumbnail);

playlistRouter
  .route('/:playlistId/:videoId')
  .post(authorize, addVideoToPlaylist)
  .delete(authorize, removeVideoFromPlaylist);

export default playlistRouter;
