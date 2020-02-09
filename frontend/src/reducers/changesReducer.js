import { SET_TRACK_CHANGES } from '../actions/types';

const initialState = {
  labelsToAdd: {},
  labelsToRemove: {},
  playlistsToAdd: {},
  playlistsToRemove: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TRACK_CHANGES:
      return setChanges(state, action);
    default:
      return state;
  }
};

const setChanges = (state, action) => {
  const { tracks, tracksById, labels, playlists } = action.data;
  const {
    labelsToAdd,
    labelsToRemove,
    playlistsToAdd,
    playlistsToRemove,
  } = state;

  const updateChanges = ({ map, otherMap, newIds, adding, trackField }) => {
    if (!newIds.length) return { map, otherMap };
    if (trackField === 'label_ids') {
      newIds = newIds.map(id => parseInt(id));
    }
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
                  return false;
                }
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
    labelsToAdd: newLabelsToAdd,
    labelsToRemove: newLabelsToRemove,
    playlistsToAdd: newPlaylistsToAdd,
    playlistsToRemove: newPlaylistsToRemove,
  };
};

// const newLabelsToAdd = {
//   ...labelsToAdd,
//   ...Object.fromEntries(
//     tracks.map(trackId => {
//       const trackLabels = tracksById[trackId].label_ids;
//       const toAdd = {
//         ...labelsToAdd[trackId],
//         ...Object.fromEntries(
//           labels.toAdd
//             .filter(id => {
//               const firstChange =
//                 !labelsToRemove[trackId] ||
//                 labelsToRemove[trackId][id] === undefined;
//               if (!trackLabels.includes(id) && firstChange) {
//                 return true;
//               } else if (!firstChange) {
//                 labelsToRemove[trackId][id] = false;
//                 return false;
//               }
//             })
//             .map(id => [id, true])
//         ),
//       };
//       return [trackId, toAdd];
//     })
//   ),
// };
