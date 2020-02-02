import React, { memo } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import TrackSlide from './TrackSlide';
import TrackToolBar from './TrackToolBar';

const stateSelector = createSelector(
  state => state.tracks.tracksById,
  state => state.tracks.ids,
  state => state.tracks.selected,
  (tracksById, tracks, selected) => ({ tracksById, tracks, selected })
);

export default memo(() => {
  console.log('TrackManager');
  const dispatch = useDispatch();
  const { tracksById, tracks, selected } = useSelector(stateSelector);

  return (
    <Wrapper>
      <TrackToolBar />
      <TrackList style={{ height: '100%' }}>
        {tracks.map(id => (
          <TrackSlide
            key={id}
            track={tracksById[id]}
            checked={selected[id] || false}
          />
        ))}
      </TrackList>
    </Wrapper>
  );
});

const TrackList = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 18px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 844px;
`;
