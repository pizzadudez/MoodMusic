import { combineReducers } from 'redux';
import appReducer from './appReducer';
import tracksReducer from './tracksReducer';
import labelsReducer from './labelsReducer';
import playlistsReducer from './playlistsReducer';
// import changesReducer from './changesReducer';
// import filterReducer from './filterReducer';

export default combineReducers({
  app: appReducer,
  tracks: tracksReducer,
  playlists: playlistsReducer,
  labels: labelsReducer,
  // filter: filterReducer,
  // changes: changesReducer,
});