import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import trackIdsReducer from './trackIdsReducer';
import playlistsReducer from './playlistsReducer';
import labelsReducer from './labelsReducer';
import changesReducer from './changesReducer';

export default combineReducers({
  tracks: tracksReducer,
  trackIds: trackIdsReducer,
  playlists: playlistsReducer,
  labels: labelsReducer,
  changes: changesReducer,
});