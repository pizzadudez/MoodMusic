import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import labelsReducer from './labelsReducer';
import playlistsReducer from './playlistsReducer';
import changesReducer from './changesReducer';

export default combineReducers({
  tracks: tracksReducer,
  labels: labelsReducer,
  playlists: playlistsReducer,
  changes: changesReducer,
});