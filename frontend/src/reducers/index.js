import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import playlistsReducer from './playlistsReducer';
import labelsReducer from './labelsReducer';

export default combineReducers({
  tracks: tracksReducer,
  playlists: playlistsReducer,
  labels: labelsReducer,
});