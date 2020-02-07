import React, { memo, useMemo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

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
    labels,
    playlistsById,
    playlists,
  })
);

export default memo(({ open: trackId, onClose }) => {
  const dispatch = useDispatch();
  const {
    tracksById,
    labelsById,
    labels,
    playlistsById,
    playlists,
  } = useSelector(stateSelector);

  const track = useMemo(() => {
    return tracksById[trackId];
  }, [tracksById, trackId]);

  return (
    <StyledDialog open={!!track} onClose={onClose}>
      <Container>{track && track.name}</Container>
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)``;
const Container = styled.div`
  width: 500px;
  height: 600px;
`;
