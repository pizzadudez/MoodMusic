import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';

import { updateTracks } from '../../actions/trackActions';
import LabelButton from './LabelButtonTrack';
import Button from '../common/Button';
import CloseIcon from '@material-ui/icons/Close';

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
  const [trackLabels, trackPlaylists] = useMemo(() => {
    if (track) {
      const labels = Object.fromEntries(track.label_ids.map(id => [id, true]));
      const playlists = Object.fromEntries(
        track.playlist_ids.map(id => [id, true])
      );
      return [labels, playlists];
    }
    return [{}, {}];
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
  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const updateAndClose = useCallback(() => {
    setUpdate(true);
  }, [setUpdate]);
  useEffect(() => {
    if (update) {
      const labels = Object.keys(_.pickBy(selectedLabels)).reduce(
        (obj, id) => {
          obj[trackLabels[id] ? 'toRemove' : 'toAdd'][id] = true;
          return obj;
        },
        { toAdd: {}, toRemove: {} }
      );
      const playlists = Object.keys(_.pickBy(selectedPlaylists)).reduce(
        (obj, id) => {
          obj[trackPlaylists[id] ? 'toRemove' : 'toAdd'][id] = true;
          return obj;
        },
        { toAdd: {}, toRemove: {} }
      );
      dispatch(
        updateTracks({
          trackId,
          labels,
          playlists,
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
    <StyledDialog open={!!track} onClose={close}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
      >
        <Button variant="cancel" onClick={close} startIcon={<CloseIcon />} />
      </div>
      {track && (
        <div>
          <h1 style={{ textAlign: 'center' }}>{track.name}</h1>
          <h2 style={{ textAlign: 'center' }}>{track.artist}</h2>
        </div>
      )}
      <div>
        <h3>Genres</h3>
        {genreIds.map(id =>
          [id, ...(labelsById[id].subgenre_ids || [])].map(id => (
            <LabelButton
              key={id}
              itemId={id}
              color={labelsById[id].color}
              original={trackLabels[id]}
              select={selectLabel}
            >
              {labelsById[id].name}
            </LabelButton>
          ))
        )}
      </div>
      <div>
        <h3>Moods</h3>
        {moodIds.map(id => (
          <LabelButton
            key={id}
            itemId={id}
            color={labelsById[id].color}
            original={trackLabels[id]}
            select={selectLabel}
          >
            {labelsById[id].name}
          </LabelButton>
        ))}
      </div>
      <div>
        <h3>Playlists</h3>
        {playlists.map(id => (
          <LabelButton
            key={id}
            itemId={id}
            original={trackPlaylists[id]}
            select={selectPlaylist}
          >
            {playlistsById[id].name}
          </LabelButton>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flex: '1 1 0',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <Button variant="submit" onClick={updateAndClose}>
          Apply Changes
        </Button>
      </div>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #1f1f1f;
    border-radius: 4px;
    min-width: 600px;
    min-height: 700px;
    padding: 8px 10px;
    color: white;
  }
`;
