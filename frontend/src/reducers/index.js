import { combineReducers } from 'redux';
import tracksReducer from './tracksReducer';
import trackIdsReducer from './trackIdsReducer';
import playlistsReducer from './playlistsReducer';
import labelsReducer from './labelsReducer';
import labelIdsReducer from './labelIdsReducer';
import changesReducer from './changesReducer';

export default combineReducers({
  tracks: tracksReducer,
  trackIds: trackIdsReducer,
  labels: labelsReducer,
  labelIds: labelIdsReducer,
  playlists: playlistsReducer,
  changes: changesReducer,
});