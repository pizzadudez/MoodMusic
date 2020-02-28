import _ from 'lodash';
import {
  FETCH_TRACKS,
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_TRACK_CHANGES,
  CLEAR_TRACK_CHANGES,
  UPDATE_TRACKS,
  TOGGLE_TRACK_LIKE,
} from '../actions/types';

const initialState = {
  tracksById: {},
  ids: [],
  liked: {},
  selected: {},
  changes: {
    labelsToAdd: {},
    labelsToRemove: {},
    playlistsToAdd: {},
    playlistsToRemove: {},
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        tracksById: action.payload,
        ids: Object.keys(action.payload),
        liked: Object.keys(action.payload).reduce(
          (obj, id) => ({
            ...obj,
            [id]: action.payload[id].liked ? true : undefined,
          }),
          {}
        ),
      };
    case MODIFY_TRACK_SELECTION:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.payload]: !state.selected[action.payload],
        },
      };
    case SELECT_ALL_TRACKS:
      return {
        ...state,
        selected: action.selected,
      };
    case DESELECT_ALL_TRACKS:
      return {
        ...state,
        selected: {},
      };
    case UPDATE_TRACKS:
      return updateTracks(state, action);
    case SET_TRACK_CHANGES:
      return setTrackChanges(state, action);
    case CLEAR_TRACK_CHANGES:
      return {
        ...state,
        changes: {
          labelsToAdd: {},
          labelsToRemove: {},
          playlistsToAdd: {},
          playlistsToRemove: {},
        },
      };
    case TOGGLE_TRACK_LIKE:
      return {
        ...state,
        tracksById: {
          ...state.tracksById,
          [action.id]: {
            ...state.tracksById[action.id],
            liked: +action.toggle,
          },
        },
      };
    default:
      return state;
  }
};

const updateTracks = (state, action) => {
  const { labels, playlists, trackId } = action.data;
  const tracks = trackId ? [trackId] : Object.keys(_.pickBy(state.selected));
  const { tracksById } = state;

  return {
    ...state,
    tracksById: {
      ...tracksById,
      ...Object.fromEntries(
        tracks.map(trackId => {
          const newLabels = [
            ...tracksById[trackId].label_ids.filter(
              id => !labels.toRemove.includes(id) && !labels.toAdd.includes(id)
            ),
            ...labels.toAdd,
          ];
          const newPlaylists = [
            ...tracksById[trackId].playlist_ids.filter(
              id =>
                !playlists.toRemove.includes(id) &&
                !playlists.toAdd.includes(id)
            ),
            ...playlists.toAdd,
          ];
          return [
            trackId,
            {
              ...tracksById[trackId],
              label_ids: newLabels,
              playlist_ids: newPlaylists,
            },
          ];
        })
      ),
    },
  };
};

const setTrackChanges = (state, action) => {
  const { labels, playlists, trackId } = action.data;
  const tracks = trackId ? [trackId] : Object.keys(_.pickBy(state.selected));
  const {
    tracksById,
    changes: { labelsToAdd, labelsToRemove, playlistsToAdd, playlistsToRemove },
  } = state;

  const updateChanges = ({ map, otherMap, newIds, adding, trackField }) => {
    if (!newIds.length) return { map, otherMap };
    const newMapChanges = Object.fromEntries(
      tracks.map(trackId => {
        const trackFieldIds = tracksById[trackId][trackField];
        const newTrackMap = {
          ...map[trackId],
          ...Object.fromEntries(
            newIds
              .filter(id => {
                const firstChange =
                  !otherMap[trackId] || otherMap[trackId][id] === undefined;
                if (trackFieldIds.includes(id) === !adding && firstChange) {
                  return true;
                } else if (!firstChange) {
                  otherMap[trackId][id] = false;
                }
                return false;
              })
              .map(id => [id, true])
          ),
        };
        return [trackId, { ...map[trackId], ...newTrackMap }];
      })
    );
    return {
      map: {
        ...map,
        ...newMapChanges,
      },
      otherMap,
    };
  };

  const { map: tempLabelsToAdd, otherMap: tempLabelsToRemove } = updateChanges({
    map: labelsToAdd,
    otherMap: labelsToRemove,
    newIds: labels.toAdd,
    adding: true,
    trackField: 'label_ids',
  });
  const { map: newLabelsToRemove, otherMap: newLabelsToAdd } = updateChanges({
    map: tempLabelsToRemove,
    otherMap: tempLabelsToAdd,
    newIds: labels.toRemove,
    adding: false,
    trackField: 'label_ids',
  });
  const {
    map: tempPlaylistsToAdd,
    otherMap: tempPlaylistsToRemove,
  } = updateChanges({
    map: playlistsToAdd,
    otherMap: playlistsToRemove,
    newIds: playlists.toAdd,
    adding: true,
    trackField: 'playlist_ids',
  });
  const {
    map: newPlaylistsToRemove,
    otherMap: newPlaylistsToAdd,
  } = updateChanges({
    map: tempPlaylistsToRemove,
    otherMap: tempPlaylistsToAdd,
    newIds: playlists.toRemove,
    adding: false,
    trackField: 'playlist_ids',
  });

  return {
    ...state,
    changes: {
      labelsToAdd: newLabelsToAdd,
      labelsToRemove: newLabelsToRemove,
      playlistsToAdd: newPlaylistsToAdd,
      playlistsToRemove: newPlaylistsToRemove,
    },
  };
};
