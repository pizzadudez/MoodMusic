import React, { memo, useCallback, useMemo } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Checkbox from '@material-ui/core/Checkbox';
import { modifyTrackSelection } from '../../actions/trackActions';

const stateSelector = createSelector(
  state => state.playlists.playlistsById,
  state => state.labels.labelsById,
  (playlistsById, labelsById) => ({
    playlistsById,
    labelsById,
  })
);

export default memo(({ track, checked, widthRestriction }) => {
  console.log('TrackSlide');
  const dispatch = useDispatch();
  const { playlistsById, labelsById } = useSelector(stateSelector);

  const handleSelect = useCallback(
    e => {
      dispatch(modifyTrackSelection(e.target.value));
    },
    [dispatch]
  );

  return (
    <Slide>
      <Checkbox checked={checked} onChange={handleSelect} value={track.id} />
      {widthRestriction ? 'smol' : track.name}
    </Slide>
  );
});

const Slide = styled.div`
  height: 50px;
  width: 100%;
  outline: 1px solid black;
  padding: 4px 8px;
`;
