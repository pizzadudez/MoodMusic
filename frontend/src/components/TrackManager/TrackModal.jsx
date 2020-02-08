import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';

import Button from './Button';

const stateSelector = createSelector(
  state => state.tracks.tracksById,
  state => state.labels,
  state => state.playlists,
  (tracksById, labels, { playlistsById, ids: playlists }) => ({
    tracksById,
    labelsById: labels.labelsById,
    genreIds: labels.ids.filter(id => labels.labelsById[id].type === 'genre'),
    moodIds: labels.ids.filter(id => labels.labelsById[id].type === 'mood'),
    playlistsById,
    playlists,
  })
);

export default memo(({ open: trackId, setOpen }) => {
  const dispatch = useDispatch();
  const {
    tracksById,
    labelsById,
    genreIds,
    moodIds,
    playlistsById,
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
  // useEffect(() => {
  // }, [trackId]);
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

      // Reset modal state and close
      setSelectedLabels({});
      setSelectedPlaylists({});
      setUpdate(false);
      setOpen(false);
    }
  }, [update, setOpen]);

  // const onClose = useCallback(() => {
  //   console.log(selectedLabels);

  //   setOpen(false);
  // }, [setOpen]);

  return (
    <StyledDialog open={!!track} onClose={updateAndClose}>
      <Container>
        Genres
        {genreIds.map(id => (
          <React.Fragment key={'genreFragment_' + id}>
            <Button
              key={id}
              id={id}
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
                  original={trackLabels[id]}
                  select={selectLabel}
                >
                  {labelsById[id].name}
                </Button>
              ))}
          </React.Fragment>
        ))}
        Moods
        {moodIds.map(id => (
          <Button
            key={id}
            id={id}
            original={trackLabels[id]}
            select={selectLabel}
          >
            {labelsById[id].name}
          </Button>
        ))}
        Playlists
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
      </Container>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)``;
const Container = styled.div`
  width: 500px;
  height: 600px;
  /* display: flex; */
`;
