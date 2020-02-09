import { combineReducers } from 'redux';
import appReducer from './appReducer';
import tracksReducer from './tracksReducer';
import labelsReducer from './labelsReducer';
import playlistsReducer from './playlistsReducer';
import filterReducer from './filterReducer';
import changesReducer from './changesReducer';

export default combineReducers({
  app: appReducer,
  tracks: tracksReducer,
  playlists: playlistsReducer,
  labels: labelsReducer,
  filter: filterReducer,
  changes: changesReducer,
});
