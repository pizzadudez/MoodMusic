import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';

import Button from './Button';
import { updateTracks } from '../../actions/trackActions';

const stateSelector = createSelector(
  state => state.tracks.tracksById,
  state => state.labels,
  state => state.playlists,
  (
    tracksById,
    { labelsById, ids: labels },
    { playlistsById, ids: playlists }
  ) => ({
    tracksById,
    labelsById,
    playlistsById,
    genreIds: labels.filter(id => labelsById[id].type === 'genre'),
    moodIds: labels.filter(id => labelsById[id].type === 'mood'),
    playlists: playlists.filter(id => playlistsById[id].type === 'mix'),
  })
);

export default memo(({ open: trackId, setOpen }) => {
  const dispatch = useDispatch();
  const {
    tracksById,
    labelsById,
    playlistsById,
    genreIds,
    moodIds,
    playlists,
  } = useSelector(stateSelector);

  // Track
  const track = useMemo(() => {
    return tracksById[trackId];
  }, [tracksById, trackId]);
  const trackLabels = useMemo(() => {
    if (track) {
      return Object.fromEntries(track.label_ids.map(id => [id, true]));
    } else {
      return {};
    }
  }, [track]);
  const trackPlaylists = useMemo(() => {
    if (track) {
      return Object.fromEntries(track.playlist_ids.map(id => [id, true]));
    } else {
      return {};
    }
  }, [track]);
  // Select
  const [selectedLabels, setSelectedLabels] = useState({});
  const [selectedPlaylists, setSelectedPlaylists] = useState({});
  const selectLabel = useCallback(
    id => {
      setSelectedLabels(selected => ({
        ...selected,
        [id]: !selected[id],
      }));
    },
    [setSelectedLabels]
  );
  const selectPlaylist = useCallback(
    id => {
      setSelectedPlaylists(selected => ({
        ...selected,
        [id]: !selected[id],
      }));
    },
    [setSelectedPlaylists]
  );
  // Close / Done selecting
  const [update, setUpdate] = useState(false);
  const updateAndClose = useCallback(() => {
    setUpdate(true);
  }, [setUpdate]);
  useEffect(() => {
    if (update) {
      const labelsToAdd = Object.entries(selectedLabels)
        .filter(([k, v]) => !trackLabels[k] && v)
        .map(([k]) => k);
      const labelsToRemove = Object.entries(selectedLabels)
        .filter(([k, v]) => trackLabels[k] && v)
        .map(([k]) => k);
      const playlistsToAdd = Object.entries(selectedPlaylists)
        .filter(([k, v]) => !trackPlaylists[k] && v)
        .map(([k]) => k);
      const playlistsToRemove = Object.entries(selectedPlaylists)
        .filter(([k, v]) => trackPlaylists[k] && v)
        .map(([k]) => k);
      dispatch(
        updateTracks({
          tracks: [trackId],
          labels: {
            toAdd: labelsToAdd,
            toRemove: labelsToRemove,
          },
          playlists: {
            toAdd: playlistsToAdd,
            toRemove: playlistsToRemove,
          },
        })
      );
      // Reset modal state and close
      setSelectedLabels({});
      setSelectedPlaylists({});
      setUpdate(false);
      setOpen(false);
    }
  }, [update, setOpen]);

  return (
    <StyledDialog open={!!track} onClose={updateAndClose}>
      <Container>
        {track && (
          <div>
            <h1 style={{ textAlign: 'center' }}>{track.name}</h1>
            <h2 style={{ textAlign: 'center' }}>{track.artist}</h2>
          </div>
        )}
        <div>
          <h3>Genres</h3>
          {genreIds.map(id => (
            <React.Fragment key={'genreFragment_' + id}>
              <Button
                key={id}
                id={id}
                color={labelsById[id].color}
                original={trackLabels[id]}
                select={selectLabel}
              >
                {labelsById[id].name}
              </Button>
              {labelsById[id].subgenre_ids &&
                labelsById[id].subgenre_ids.map(id => (
                  <Button
                    key={id}
                    id={id}
                    color={labelsById[id].color}
                    original={trackLabels[id]}
                    select={selectLabel}
                  >
                    {labelsById[id].name}
                  </Button>
                ))}
            </React.Fragment>
          ))}
        </div>
        <div>
          <h3>Moods</h3>
          {moodIds.map(id => (
            <Button
              key={id}
              id={id}
              color={labelsById[id].color}
              original={trackLabels[id]}
              select={selectLabel}
            >
              {labelsById[id].name}
            </Button>
          ))}
        </div>
        <div>
          <h3>Playlists</h3>
          {playlists.map(id => (
            <Button
              key={id}
              id={id}
              original={trackPlaylists[id]}
              select={selectPlaylist}
            >
              {playlistsById[id].name}
            </Button>
          ))}
        </div>
      </Container>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #444;
    border-radius: 4px;
  }
`;
const Container = styled.div`
  width: 500px;
  height: 600px;
  background-color: #1f1f1f;
  color: white;
  padding: 0 8px;
`;
